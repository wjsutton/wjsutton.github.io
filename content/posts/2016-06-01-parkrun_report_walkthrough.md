---
layout: default
categories: [project]
---
## Project Walkthroughs: Parkrun Report
Find this project on Github: <a href ="https://github.com/wjsutton/parkrun_parser">Parkrun Parser</a>

#### **Introduction and Motivation**

Parkrun ([https://www.parkrun.org.uk/](https://www.parkrun.org.uk/)) is a weekly 5km run that occurs around 9 am on a Saturday, all around the world but mostly in the UK. It attracts a wide range of runners from the beginners to seasoned club runners. For my running club, parkrun is a great opportunity to meet with other local runners.
My club liked to manually email members the list of parkrun results on a weekly basis, I believe this could be automated.

#### **Stage 1 Build**
* Scrape the parkrun data
* Create local data source (CSV file)
* Send CSV file to Googlesheets
* Build a Tableau Public report connected to Googlesheets data source

![Stage 1](assets\parkrun_stage_1_workflow.png)

##### Scraping the Data

The function to scrape the club data is available on Github here: <a href ="https://github.com/wjsutton/parkrun_parser">Parkrun Parser</a> "extract_parkrun_cc_report_urls" in [parkrun_functions.R](https://github.com/wjsutton/parkrun_parser/blob/master/parkrun_functions.R)

The process is as follows:
* Received a parkrun consolidated club page URL or list of URLs, e.g. [http://www.parkrun.com/results/consolidatedclub/?clubNum=1242](http://www.parkrun.com/results/consolidatedclub/?clubNum=1242) 
* Read each URL and find the links to each visited parkrun
* Loop through visited parkruns and extract the results 
* Resolve issues throughout, e.g. time delays to prevent having IP address blocked, handling differences for French and Polish parkruns

```r
# get latest consolidated club report results
source("parkrun_functions.R")
url <- "http://www.parkrun.com/results/consolidatedclub/?clubNum=1242"
new_data <- extract_parkrun_cc_report_urls(url)
```
new_data will be one week's worth of club parkrun results including the following columns of data:
* parkrun	
* number	
* date	
* position	
* parkrunner	
* time	
* age_category	
* age_grade	
* gender	
* gender_position	
* club	
* note	
* total_runs
* badges (currently doesn't return anything but "NA")

##### Generate .csv File

At this point generating the CSV file is as simple as:
```r
# write csv file
write.csv(new_data,'parkrun_data.csv',row.names = FALSE)
```

However, this is all results for all runners for the parkruns our club visited. Keeping in mind the Tableau Public output is just our club results we can go ahead and filter by running club with:
```r
# filter for West 4 Harriers running club then write csv
library(dplyr)
w4h_new_data <- new_data %>% filter(new_data$club=='West 4 Harriers')
write.csv(w4h_new_data,'parkrun_data.csv',row.names = FALSE)
```
Reducing the data to what is needed helps save space on Googlesheets and makes Tableau Public not have to work so hard to process our data.

##### Upload to Googlesheets

Why Googlesheets? It's currently the only automatically updating data source that connects to Tableau Public.

The upload process is relatively painless thanks to the "googlesheets" package in R. A walkthrough is available on Github here: [https://github.com/jennybc/googlesheets](https://github.com/jennybc/googlesheets)

In brief for this project we'll need to create and save a token that will allow us to send files to Googlesheets without the need to manually log in or authenticate:
```r
library(googlesheets)
token <- gs_auth(cache = FALSE)
gd_token()
saveRDS(token, file = "googlesheets_token.rds")
```

More on Googlesheets OAuth tokens [here](https://rawgit.com/jennybc/googlesheets/master/vignettes/managing-auth-tokens.html).

After generating this token, we can use this to upload our data file to Googlesheets:
```r
library(googlesheets)
gs_auth(token = "googlesheets_token.rds")
gs_upload("parkrun_data.csv", sheet_title = "results",overwrite = TRUE)
```

##### Visualising the Data

Having worked with Tableau in past Tableau Public feasible solution where users could see a weekly table of results below or on Tableau Public: [Here](https://public.tableau.com/views/West4HarriersParkrunReport/WeeklyParkrunReport?:embed=y&:display_count=yes)

A few notes on the design:
* It is intended to be pretty basic, not a distinct change from the copy 'n' paste email they currently receive
* Add club logo with a KPI banner for some quick stats for this week
* Add the functionality to cycle through previous weeks results
* Added "About Us" tab for any newcomers to the dashboard for a bit of club marketing

_Mobile users, please rotate your phone horizontally._
<iframe align = "center" width = "100%" height = "350" src="https://public.tableau.com/views/West4HarriersParkrunReport/WeeklyParkrunReport?:embed=y&:display_count=yes"/>

Lastly to fully automate this the R code used can be scheduled to run on Windows Task Manager, a crontab, etc. 

#### **Stage 2 Build**

From running the stage 1 process a few upgrades were identified and planned for the second phase such as:
* Did the data fail to run? I do not know unless I manually check the data source or the Tableau workbook
* The original manual job of emailing weekly results has not been automated, a weekly emailable report should be produced

![Stage 2](assets\parkrun_stage_2_workflow.png)

##### Send an email if data scrape failed

As mentioned earlier the function "extract_parkrun_cc_report_urls" in [parkrun_functions.R](https://github.com/wjsutton/parkrun_parser/blob/master/parkrun_functions.R) has a few workarounds due to some inconsistent parkruns, this is out of my control but to assist the debugging of problems, it is helpful to receive a nudge via email when the data has not been received rather than manually checking. 
```r
# check max week of parkrun_data, if date is > 7 days old, send email
report <- read.csv(file = "parkrun_data.csv",stringsAsFactors = F)
report_date <- max(report$date)
last_week <- as.character(Sys.Date()-7)

if(report_date > last_week){
  # send email
}
```
For sending emails I used the `gmailr` library, you could alternatively use `mailr`. For `gmailr` I set up a new Gmail email address and set up the Gmail API using the following walkthrough [https://github.com/jimhester/gmailr](https://github.com/jimhester/gmailr) 

The credentials of the Gmail email address are saved to a text or csv file, this is just good practice to remove passwords and identifiers from your code. Credentials can then be read using:
```r
# Get Gmail credentials
details <- read.csv(file = "gmail_details.csv")
sender <- details$email
recipients <- details$admin
client_id <- details$client_id
client_secret <- details$client_secret

# Authenticate Gmail, create draft and send email
library(gmailr)
gmail_auth(scope = "full",
           id = client_id,
           secret = client_secret, 
           secret_file = NULL)
  
draft <- (mime(From=sender,
               To=recipients,
               Subject="Parkrun update failed",
               body = "The update for parkrun report has failed."
			   
send_message(draft)
```

More about sending emails via `gmailr` here: [https://github.com/jennybc/send-email-with-r](https://github.com/jennybc/send-email-with-r)


##### Generate Rmarkdown HTML report
The report is generated by building an R Markdown file, a full introduction is available here: [https://rmarkdown.rstudio.com/articles_intro.html](https://rmarkdown.rstudio.com/articles_intro.html) essentially for this project creating a standard report that can be updated weekly and rendered as a HTML file to be emailed.
```
```{r, echo=FALSE}```
```
The triple quote allows R code to be run without any outputs from the code being returned in the final document. I use these blocks to load libraries and do the majority of the required calculations. 
```
`r print('Hello World')`
```
The single quote allows for R code snippets to be run inline, I use these for printing the final results to the document. 

**Header and KPIs**

<img style="width: 100%;" src="assets\parkrun_html_header.png">
<br><br>
<img style="float: right;width: 30%" src="assets\parkrun_html_kpis.png">
The header and KPIs are built in similar fashion: 
- Image + Inline R code & Text

Images can inserted with with the markdown format `![](image.png)` or using the HTML `<img src="image.png">` tag. The `<img>` tag I find a bit easier if you wish to resize and position the image using the style attribute e.g. `style=float: left;width: 150px;`<br><br>
Inline R code is used to generate the weekly updated elements, for example, the report date
`r format(as.Date(max(report$date)),format="%d %b %Y")`
or referencing variables for KPIs `r parkrunners` to show the number of parkrunners. Note the data frame `report` and variable `parkrunners` are predefined in `{r, echo=FALSE}` blocks.

Showing milestones when there’s one and upcoming when they are 3 away

**Milestones, Upcoming Milestones and Weekly Results**
<img style="width: 100%;" src="assets\parkrun_html_milestones.png">
Reaching 100 or 200 Parkruns is a serious achievement and should be recognised in the weekly report. Similar if someone is 1 or 2 runs away from a milestone that should be mentioned to spur them on. A data frame of milestones is defined in a `{r, echo=FALSE}` block as where the total runs is a multiple of 25.
```
milestones <- output %>% filter(output$total_runs %% 25 == 0)
```
Similarly upcoming milestones are 1-3 runs off a milestone 
```
milestones_upcoming <- output %>% filter(output$total_runs %% 25 %in% c(22,23,24))
```
Note the `%%` does the modulus operation, essentially it's like division but only returns the remainder, e.g. `10 %% 3` equals 1.
<br>Next, we check whether there is any data in the table to avoid printing an empty table, which is done using an `ifelse` function in R, very similar to IF statement in Excel, if the statement is true then do this, otherwise do that.
```
ifelse(nrow(milestones)>0,'Milestones','')
```
In this example, if the milestones table has 1 or more rows then print the header 'Milestones' otherwise print nothing.
<br>The tables are formatted using the kable function
```
milestones %>% 
	kable() %>% 
		kable_styling(bootstrap_options = c("striped", "hover", "condensed", "responsive"))
```
<br>Headers are given an extra bit of distinction with coloured background by surrounding them with a `<h4>` tag and using the style attribute
```
paste0('<h4 style="background-color:#bedff6; padding: 7px;">',mile_header,'</h4>')
```
After the tables and headers are made they are pasted together then callable as a variable, so are then referenced using  `r mile` and `r mile_up`. <br>
The full list of results is produced in a similar approach but looping through the different Parkrun locations and pasting together a combined list of all headers and tables which is then called.
<img style="width: 100%;" src="assets\parkrun_html_results.png">

Example HTML email report: [Report](assets\parkrun_report.html)


#### **Stage 3 (prospective build)**

Upgrades:
* Update Tableau report, as the Tableau report does the same job as the email, but the Tableau report could visualise all the data collected, providing an All Time and YTD stats view
* Improve the quality of the email, some things aren’t rendering properly on desktop PC compared to mobile, etc.
​