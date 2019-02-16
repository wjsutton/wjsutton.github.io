---
layout: default
---
## Project Walkthroughs: Parkrun Report
Find this project on Github: <a href ="https://github.com/wjsutton/parkrun_parser">Parkrun Parser</a>

**Introduction and Motivation**

Parkrun ([https://www.parkrun.org.uk/](https://www.parkrun.org.uk/)) is a weekly 5km run that occurs around 9am on a Saturday morning, all around the world but mostly in the UK. It attracts a wide range of runner from those beginners to seasoned club runners. For my running club parkrun is a great opportunity to meet with other local runners.
My club liked to manually email members the list of parkrun results on a weekly basis, I believed could be automated.

**Stage 1 Build**
* Scrape the parkrun data
* Create local data source (csv file)
* Send csv to googlesheets
* Build Tableau Public report connected to googlesheets data source

![Stage 1](assets\parkrun_stage_1_workflow.png)

###### Scraping the Data

The function to scrape the club data is available on Github here: <a href ="https://github.com/wjsutton/parkrun_parser">Parkrun Parser</a> "extract_parkrun_cc_report_urls" in [parkrun_functions.R](https://github.com/wjsutton/parkrun_parser/blob/master/parkrun_functions.R)

The process is as follows:
* Received a parkrun consolidated club page url or list of urls, e.g. [http://www.parkrun.com/results/consolidatedclub/?clubNum=1242](http://www.parkrun.com/results/consolidatedclub/?clubNum=1242) 
* Read each url and find the links to each visited parkrun
* Loop through visited parkruns and extract the results 
* Throughout resolve issues, e.g. time delays to prevent having ip address blocked, handling differences for French and Polish parkruns

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

###### Generate .csv File

At this point generating the csv is as simple as:
```r
# write csv file
write.csv(new_data,'parkrun_data.csv',row.names = FALSE)
```

However this is all results for all runners for the parkruns our club visited. Keeping the in mind the Tableau Public output is just our club results we can go ahead and filter by running club with:
```r
# filter for West 4 Harriers running club then write csv
library(dplyr)
w4h_new_data <- new_data %>% filter(new_data$club=='West 4 Harriers')
write.csv(w4h_new_data,'parkrun_data.csv',row.names = FALSE)
```
Reducing the data to what is needed helps save space on Google Sheets and makes Tableau Public not have to work so hard processing our data.

###### Upload to Google Sheets

Why Google Sheets? It's currently the only automatically updating data source that connects to Tableau Public.

The upload process is relatively painless thanks to the "googlesheets" package in R. A walkthrough is available on Github here: [https://github.com/jennybc/googlesheets](https://github.com/jennybc/googlesheets)

In brief for this project we'll need to create and save a token that will allow us to send files to Google Sheets without the need to manually log in or autheniticate:
```r
library(googlesheets)
token <- gs_auth(cache = FALSE)
gd_token()
saveRDS(token, file = "googlesheets_token.rds")
```

More on Google Sheets OAuth tokens here: [https://rawgit.com/jennybc/googlesheets/master/vignettes/managing-auth-tokens.html](https://rawgit.com/jennybc/googlesheets/master/vignettes/managing-auth-tokens.html)

After generating this token we can use this to upload our data file to Google Sheets:
```r
library(googlesheets)
gs_auth(token = "googlesheets_token.rds")
gs_upload("parkrun_data.csv", sheet_title = "results",overwrite = TRUE)
```

###### Visualising the Data

Having worked with Tableau in past Tableau Public feasible solution where users could see a weekly table of results: [Here](https://public.tableau.com/views/West4HarriersParkrunReport/WeeklyParkrunReport?:embed=y&:display_count=yes)
<iframe align = "center" width = "100" height = "100" src="https://public.tableau.com/views/West4HarriersParkrunReport/WeeklyParkrunReport?:embed=y&:display_count=yes"/>

**Stage 2 Build**

From running the stage 1 process a number of upgrades were planned for the second phase such as:
* Did the data fail to run? I don’t know unless I manually check the data source or the Tableau workbook
* The original manual job of emailing weekly results hasn’t been automated, an weekly emailable report should be produced

![Stage 2](assets\parkrun_stage_2_workflow.png)

Did the data run?
R script to check max week of local data source, if date is > 7 days old, send email.
Email
Rmarkdown file to generate html document
Email html document to club

Example html email report: [Report](assets\parkrun_report.html) 

**Stage 3 (prospective build)**

Upgrades:
* Update Tableau report, as the Tableau report does the same job as the email, but the Tableau report could visualise all the data collected, providing an All Time and YTD stats view
* Improve the quality of the email, some things aren’t rendering properly on desktop compared to mobile, etc.
​