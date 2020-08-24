---
layout: default
title: Assembling a Gallery of Iron Viz 2020 Submissions from Twitter
categories: [data-viz]
blurb: Iron Viz is Tableau's ultimate data competition, here's how I created a gallery page of submissions from Twitter. 
img: assets/images/ironviz_gallery_image.PNG
published: true
---

## Assembling a Gallery of Iron Viz Submissions

<a href="https://wjsutton.github.io/ironviz2020.html">
<img src="/assets/images/ironviz_gallery_image.PNG" align="right" style="width:35%;height:35%;padding-left:10px;" /></a>

This is the Iron Viz Gallery Page built from this project: [wjsutton.github.io/ironviz2020](https://wjsutton.github.io/ironviz2020.html)

This project involves building a HTML gallery webpage of Tableau Public ironviz 2020 submissions on Twitter. Identified by the hashtag "#ironviz" or "#ironviz2020" and a Tableau Public URL.
Please note this is a cut-down, conceptual walkthrough. The full documentation is available at [github.com/wjsutton/ironviz_2020_gallery](https://github.com/wjsutton/ironviz_2020_gallery)

This project can be divided up into 3 main phases of work

1. Pulling #ironviz and #ironviz2020 tweets from Twitter
2. Identifying Tableau Public URLs and obtaining dashboard images
3. Building HTML code to displaying images in a grid

<img src="/assets/images/ironviz_gallery_flow_diagram.PNG" style="width:100%;padding:10px;"/>

### Phase 1 - Pulling Tweets from Twitter

This section involves interfacing with the Twitter API to pull tweets containing the hashtags 'ironviz' and/or 'ironviz2020'. The original code was written in R utilising the `Rtweet` package but many coding languages can be used to pull this data, e.g. Python with the Tweepy library, Javascript, etc.

With R and rtweet the process change be as straightforward as:

```
library(rtweet)
data <- rtweet::search_tweets('#ironviz', n = 10000)
View(data)
```

Notes on the `rtweet::search_tweets()` function:
- Only returns data from the past 6-9 days
- This extract will include retweets, to exclude them add the clause `include_rts = FALSE`
- To return more than 18,000 statuses you will need to include the clause `retryonratelimit = TRUE`

Also, please note this may require you to have a Twitter App setup, instructions on how to do this can be found here: [https://cran.r-project.org/web/packages/rtweet/vignettes/auth.html](https://cran.r-project.org/web/packages/rtweet/vignettes/auth.html)

After pulling the tweets we will save them locally to be used later.


### Phase 2 - Identifying Tableau Public URLs

Using the data collected in Phase 1, we are looking for URLs under the column urls_expanded_url that look like either of these:

Case 1. [https://public.tableau.com/views/dashboard_name/tab_name?.......](ttps://public.tableau.com/views/dashboard_name/tab_name?.......)

Case 2. [https://public.tableau.com/profile/profile_name#!/vizhome/dashboard_name/tab_name](https://public.tableau.com/profile/profile_name#!/vizhome/dashboard_name/tab_name)

There are a few issues we'll run into:

1. Tweets that aren't ironviz submissions but 'inspired by' posts
2. Submission URLs that link to a profile rather than a viz
3. Short/compressed URLs

For issues 1 & 2, under time constraints these were manual workarounds, in which we edit the data as part of the script. Regarding 3, we used the package `longurl` to expand short URLs. More on these tackling these issues in the docs [github.com/wjsutton/ironviz_2020_gallery](https://github.com/wjsutton/ironviz_2020_gallery)

#### Converting Tableau Public URLs into Screenshots

Tableau Public auto-generates a screenshot of the dashboard, and the link to the image is based on the name of the dashboard uploaded, an example below:

**This is a Tableau Public URL**<br>
[https://public.tableau.com/profile/fredfery#!/vizhome/ThefailingoftheFirstworldcountriesagainstCovid-19ironviz2020/Manyfirstworldleadershavefailedintheirresponsetocoronavirus](https://public.tableau.com/profile/fredfery#!/vizhome/ThefailingoftheFirstworldcountriesagainstCovid-19ironviz2020/Manyfirstworldleadershavefailedintheirresponsetocoronavirus)

**This is a screenshot of the URL**<br>
[https://public.tableau.com/static/images/Th/ThefailingoftheFirstworldcountriesagainstCovid-19ironviz2020/Manyfirstworldleadershavefailedintheirresponsetocoronavirus/1.png](https://public.tableau.com/static/images/Th/ThefailingoftheFirstworldcountriesagainstCovid-19ironviz2020/Manyfirstworldleadershavefailedintheirresponsetocoronavirus/1.png)
)

**So the form is like this**<br>
[https://public.tableau.com/static/images/da/dashboard_name/tab_name/1.png](https://public.tableau.com/static/images/da/dashboard_name/tab_name/1.png)
<br>*where da is the first two letters of the dashboard name.*

Knowing this we can rework all of our Tableau Public URLs to be screenshots of the dashboards to make our gallery page.

These can be then inserted into the HTML as a long list of images using the `<img>` tag

```
<img src='https://public.tableau.com/static/images/da/dashboard_name/tab_name/1.png'>
```

A link can be then applied to wrap the `<img>` tag with `<a href='link'></a>`, for this project I decided to link back to the submitter's original tweet, so they can get an introduction from the author and promotes the opportunity to give a like or post a comment to the author. 

Example:

```
<a href='https://twitter.com/pradeep_zen/status/1287756788792729600'><img src='https://public.tableau.com/static/images/Wh/WhatisReallyinYourCosmetics/IronViz/1.png'></a>
```

Lastly, the order of the images in the dashboard was determined at random, and the order was re-randomised with each update (every few hours) so it gave everyone a fair shot of being top of the page and helped the discovery of submissions that the user may not have been seen before.


### Phase 3 - Building a HTML Gallery Page 

This section involves building the HTML gallery page using R (other scripting languages are available) and the CSS file which lays out the images into a grid and works for mobile and desktop views.

The HTML was divided into 4 parts:
- header
- blurb
- images
- footer

and pasted together to form one document. 

Templates of the files can be found here [github.com/wjsutton/ironviz_2020_gallery/html](https://github.com/wjsutton/ironviz_2020_gallery/tree/master/html)

These are read in R, the blurb KPI 'NUM_OF_VIZZES' from `blurb_template.txt` is updated with the number of iron viz submissions, merged as one variable and written as the HTML file using the `readLines()` and `writeLines()` functions.

Lastly, to view the gallery page locally you can use a regular Chrome browser and navigate to a file `ironviz.html` however the folder must also contain the CSS file for the image grid to work [https://github.com/wjsutton/ironviz_2020_gallery/tree/master/gallery](https://github.com/wjsutton/ironviz_2020_gallery/tree/master/gallery)


### Appreciations

The response from the Tableau community has been immense for what started as a weekend project. I've really appreciated hearing all your support and feedback it's really made all my efforts worthwhile and inspires me to do more - so watch this space! 

The project was even recognised by Francois Ajenstat, Tableau's Chief Product Officer

<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:6695742671723606016" height="438" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>

and made an appearance on [Tableau's Best of the Web](https://www.tableau.com/about/blog/2020/8/best-tableau-web-its-iron-viz-season).

If you have any feedback for this project please feel free to:

- [Contact me](/contact.html)📫
- Raise a pull request on [wjsutton/ironviz_2020_gallery](https://github.com/wjsutton/ironviz_2020_gallery)🐙  
- Or send a tweet to [@WJSutton12](https://twitter.com/WJSutton12)💬
