// Builds the Welcome loop from shots.json with ffmpeg.
//   node build.mjs            -> out/sizzle.mp4, out/sizzle.webm, out/sizzle-poster.jpg
// Shots are joined with crossfades, and the last shot crossfades back into the
// first, so the trimmed result loops with no visible seam.
import { readFileSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const FADE = 0.5; // seconds per crossfade
const FPS = 30;
const { sources, shots } = JSON.parse(readFileSync(new URL('./shots.json', import.meta.url), 'utf8'));

const secs = (t) => t.split(':').reduce((acc, p) => acc * 60 + parseFloat(p), 0);
// Optional per shot: "crop" (ffmpeg crop=w:h:x:y, e.g. to cut away a webcam strip), "flip" (mirror),
// "pip" {crop, width, x, y}: a second region of the same frame (e.g. a webcam tile) overlaid on top,
// and "canvas" {crop, height, x, y}: the shot becomes a blurred, darkened backdrop with this region
// placed on it at full strength (for screen shares where a pip would cover the action).
// "speed" (e.g. 3 = 3x faster) and "fade" (seconds for the crossfade into this shot; default FADE).
const clips = shots.map((s) => ({
  file: sources[s.source].file, start: secs(s.start), src: secs(s.end) - secs(s.start),
  dur: (secs(s.end) - secs(s.start)) / (s.speed ?? 1), speed: s.speed ?? 1, fade: s.fade ?? FADE,
  pre: [s.crop && `crop=${s.crop}`, s.flip && 'hflip'].filter(Boolean).map((f) => f + ',').join(''),
  pip: s.pip, canvas: s.canvas,
}));
clips.push(clips[0]); // first shot again, for the loop seam

const args = ['-v', 'error', '-y'];
clips.forEach((c) => args.push('-ss', String(c.start), '-t', String(c.src), '-i', c.file));

// Normalise every clip: 1080p, 30fps, square pixels, same timebase/pixel format.
const norm = `fps=${FPS},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1`;
const tail = `format=yuv420p,settb=AVTB`;
const filters = clips.map((c, i) => {
  const sp = `setpts=(PTS-STARTPTS)/${c.speed},`;
  if (!c.pip && !c.canvas) return `[${i}:v]${sp}${c.pre}${norm},${tail}[v${i}]`;
  const base = c.canvas ? `${c.pre}${norm},boxblur=24:2,eq=brightness=-0.3` : `${c.pre}${norm}`;
  let f = `[${i}:v]${sp}split=3[a${i}][b${i}][c${i}];[a${i}]${base}[s${i}]`;
  let cur = `s${i}`;
  if (c.canvas) {
    f += `;[b${i}]crop=${c.canvas.crop},fps=${FPS},scale=-2:${c.canvas.height},setsar=1[k${i}];[${cur}][k${i}]overlay=${c.canvas.x}:${c.canvas.y}[t${i}]`;
    cur = `t${i}`;
  } else f += `;[b${i}]nullsink`;
  if (c.pip) f += `;[c${i}]crop=${c.pip.crop},fps=${FPS},scale=${c.pip.width}:-2,setsar=1[p${i}];[${cur}][p${i}]overlay=${c.pip.x}:${c.pip.y},${tail}[v${i}]`;
  else f += `;[c${i}]nullsink;[${cur}]${tail}[v${i}]`;
  return f;
});

// Chain crossfades; offset k = total length so far minus overlaps.
let prev = 'v0', acc = clips[0].dur;
for (let k = 1; k < clips.length; k++) {
  const fade = clips[k].fade;
  const offset = acc - fade;
  filters.push(`[${prev}][v${k}]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(3)}[x${k}]`);
  prev = `x${k}`;
  acc = offset + clips[k].dur;
}
// Loop = from the end of the first fade-in to the end of the final fade back into shot 1.
const seam = clips[0].fade;
const loopEnd = acc - clips[0].dur + seam;
filters.push(`[${prev}]trim=start=${seam}:end=${loopEnd.toFixed(3)},setpts=PTS-STARTPTS[out]`);

mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
const base = [...args, '-filter_complex', filters.join(';'), '-map', '[out]', '-an'];
const run = (extra, out) => {
  execFileSync('ffmpeg', [...base, ...extra, out], { stdio: 'inherit' });
  console.log(`${out}  ${(statSync(out).size / 1e6).toFixed(2)} MB`);
};

run(['-c:v', 'libx264', '-preset', 'slow', '-crf', '31', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'], 'out/sizzle.mp4');
run(['-c:v', 'libvpx-vp9', '-crf', '49', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2'], 'out/sizzle.webm');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'out/sizzle.mp4', '-frames:v', '1', '-q:v', '3', 'out/sizzle-poster.jpg']);
console.log(`loop length ${(loopEnd - seam).toFixed(2)}s`);
