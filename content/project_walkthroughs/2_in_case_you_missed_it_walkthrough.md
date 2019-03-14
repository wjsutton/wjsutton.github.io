---
layout: default
---
## Project Walkthroughs: In Case You Missed It
Find this project on Github: <a href ="https://github.com/wjsutton/icymi_email">In Case You Missed It</a>

#### **Intro**
Twitter is great for keeping up to date with various interests and communities but I don’t want to spend all my time on waiting for updates, is there a way I can give myself a digest of all the new resources from Twitter?

#### **Solution**
Set up a Twitter scraper to pull all the tweets I would see in a week and send them to me in a weekly email sorted by popularity. For ease, popularity is just: number of likes + number of retweets
[Insert diagram]
Using the library "rtweet" I am able to create a cookie and log on to my twitter account and view the timeline tweets with this function:
Due to rate limiting and some functionality of the Twitter API I can’t just ask how many tweets have been received since a particular date I can only request the last X number of tweets. As I’m not following an overwhelming amount of users requesting 500 tweets a day should be sufficient.
For saving twitter data during the week we have to be careful not to add the same tweets multiple times but also if we see a tweet we have seen before to update the previously saved tweet
Old tweets and new tweets are then saved and overwrite the existing CSV file.
Scheduled for 4 pm on Windows Task Manager.
For sending the email I’ve set up an RMarkdown report to be rendered and emailed 30 minutes after the last extract of tweets.
The RMarkdown report reads the CSV file and extracts only the necessary elements (URL, twitter account & text, popularity) to form a 3 column email report. So that links aren’t repeated the report created is distinct by URL with multiple twitter accounts & text concatenated together and popularity summed.
[Insert screenshot]
crude but it does the job

#### **Extras**
identify if at least 1 weeks worth of tweets have been received
Look to include notifications from slack
Themes of the week from the text?
​