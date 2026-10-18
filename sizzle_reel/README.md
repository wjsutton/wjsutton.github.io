# Welcome sizzle reel

The silent looping video behind the home page's Welcome section, cut with ffmpeg from talk footage.

| File | What it is | In git? |
|---|---|---|
| `shots.json` | The edit list: every source video (file, owner, URL), the shots in order with timestamps and notes, and `alternates` that were tried or are worth trying. | yes |
| `build.mjs` | Reads `shots.json` and renders `out/sizzle.mp4`, `out/sizzle.webm` and `out/sizzle-poster.jpg`. | yes |
| `*.mp4` source videos | Full downloads, about 3 GB. | no (`.gitignore`) |
| `sheets/` | Timestamped contact sheets used to pick shots. | no |
| `out/` | Render output. | no |

## Rebuild after changing shots

```bash
node build.mjs
```

Then copy the result into the site:

```bash
cp out/sizzle.mp4 ../public/video/welcome.mp4 && cp out/sizzle.webm ../public/video/welcome.webm
```

Keep both videos under about 5 MB (raise the `-crf` values in `build.mjs` if not). The site uses no poster: the Welcome photo shows until the video's first frame, and the video starts 1.5s after page load.

## Add a new video

1. Download it into this folder (YouTube Studio for your own channel, or `yt-dlp -f "bv*[height<=1080][vcodec^=avc1]" <url>`; add `--js-runtimes node` if YouTube errors).
2. Add it to `sources` in `shots.json` with its file name, owner and URL. Check you have permission if you don't own it.
3. Make contact sheets to find moments (one frame every 10s, timestamps burned in):

   ```bash
   ffmpeg -skip_frame nokey -i "video.mp4" -vf "select='isnan(prev_selected_t)+gte(t-prev_selected_t\,10)',scale=240:-2,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':x=4:y=4:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6,tile=8x6" -fps_mode vfr sheets/name_%02d.jpg
   ```

4. Add a shot to `shots` (or `alternates`) and rebuild.

## Shot options

| Field | Example | Effect |
|---|---|---|
| `start`, `end` | `"00:25:34.0"` | Source in and out points. |
| `speed` | `3` | Plays faster; the shot lasts (end − start) / speed. |
| `fade` | `0.2` | Crossfade into this shot, in seconds (default 0.5). Short values feel like cuts. |
| `flip` | `true` | Mirror horizontally, e.g. to move a person right of the site nav. Mirrors text too. |
| `crop` | `"1536:864:0:108"` | ffmpeg `w:h:x:y` crop before scaling to 1080p. |
| `pip` | `{ "crop": "355:194:1551:15", "width": 560, "x": 341, "y": 684 }` | Overlays another region of the same frame, e.g. a webcam tile. |
| `canvas` | `{ "crop": "764:814:770:110", "height": 1000, "x": 941, "y": 40 }` | Blurs and darkens the shot, then places this region on top at full strength. |

## Editing guidelines that worked

- 2–3 second shots; wide stage shots, live demos and audience reactions; no webcam-only or text-heavy frames.
- Keep the subject right of centre: the left ~35% sits under the brand, nav rail and a dark scrim.
- The last shot crossfades into the first, so the loop has no visible seam. Check the end and start frames after any reorder.
