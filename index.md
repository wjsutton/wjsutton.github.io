---
layout: default
---
<div>
<img src="https://pbs.twimg.com/profile_images/1228767622432464896/wi01-oYY_400x400.jpg" align="left" style="width:20%;height:20%;padding-right:10px;"> Hey, I'm Will, I work as a data analyst at the BBC specialising in data visualisation and automated processes. 
<p>This blog is where I test out new projects and document the things I've learnt along the way. If you like what you see or want to know a bit more shoot me a tweet at [@WJSutton12](https://twitter.com/WJSutton12) or contact me [here](/contact.html).</p>
</div>
---

<h4>LATEST POSTS</h4>

<ul style="list-style-position: inside;padding-left: 0;">
	{% for post in site.posts %}{% if post.categories contains "data-viz" or post.categories contains "data-automation" %}
	<div>
		<a href="{{ post.url | prepend: site.baseurl }}" style="color: inherit;text-decoration: inherit"><img src="{{ site.baseurl }}/{{ post.img }}" align="left" style="width:100px;height:100px;padding-right:10px;"><h5>{{ post.title }}</h5>
		<span>{{ post.date | date: "%B %-d, %Y" }} | {{ post.categories }} | {{ post.content | number_of_words | divided_by:180 }} mins </span>
		<p>{{ post.blurb }}</p></a>
		<br>
	</div>
	{% endif %}{% endfor %}
</ul>




