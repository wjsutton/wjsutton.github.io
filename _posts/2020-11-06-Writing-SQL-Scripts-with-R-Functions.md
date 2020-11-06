---
layout: default
title: Writing SQL Scripts with R Functions
categories: [data-automation]
blurb: Tips on producing fast, flexible and replicable SQL scripts with R 
img: assets/images/printer_icon.png
published: true
---

## Producing fast, flexible and replicable SQL scripts with R

For the majority of analytics functions, there is usually some element of reporting to stakeholders, which can be a repetitive and time-consuming task and more required than ever given the demand from business to respond swiftly to changes. 

In my role, I've combined m knowledge of SQL and R programming to ease the reporting burden on my team, freeing up time to focus on additional insights we can provide.

The reporting needs translate to several SQL scripts run need to be:
- run every day
- consistent with your reporting definitions
- efficient, so they don't waste resources, reduce the risk of bottlenecks and cost less (if using a data lake cost per query solution)
- redefined when definitions or requirements change
- reproduced to re-run data, backfilled after a change in definitions or be executed after a server mishap 

Using R (or any other scripting language like Python) you can create functions to write SQL statements. You can give this function arguments which can then be included in the SQL script, for example, the date range of the SQL query.

#### Create function and write SQL to a file
```
# Create Function
global_sales_weekly <- function(date_from,date_to){
  
  query <- paste0("
SELECT 
region
,DATE_TRUNC('week',date) as date
,'Weekly' as date_type
,product
,SUM(sales) as sales
,'",Sys.Date(),"' as data_written_date
FROM schema.global_sales
WHERE date>='",date_from,"'
AND date<='",date_to,"'
GROUP BY 
region
,DATE_TRUNC('week',date)
,product
")
  
  return(query)
  
}

# Run Function
weekly_sales <- global_sales_weekly(date_from = '2020-10-26',date_to = '2020-11-01')

# Write SQL to file
fileConn <- file("weekly_sales.sql")
writeLines(weekly_sales, fileConn)
close(fileConn)

```
Note:
- `,'Weekly' as date_type` is for the future user viewing this in a spreadsheet, so it is clear that the data was run over the week than just a day
- `,'",Sys.Date(),"' as data_written_date` is for reference so we know when the data was run if we need to understand if it's been affected by any issues with the database

We can open this file with a text editor and copy it to a SQL application (like SQL Workbench) and execute the query, which is fine if we only have a few queries to execute. 

#### Looping over several dates to create multiple queries
```
# Make lists of start & end dates
start_dates <- c('2020-10-26','2020-10-19','2020-10-12')
end_dates <- c('2020-11-01','2020-10-25','2020-10-18')

# Loop over all dates
for(i in seq(start_dates)){
  
  # Run Function
  weekly_sales <- global_sales_weekly(date_from = start_dates[i],date_to = end_dates[i])
  
  # Remove dashs for file name
  file_date <- gsub('-','',start_dates[i])
  
  # Write SQL to file
  fileConn <- file(paste0("weekly_sales_",file_date,".sql"))
  writeLines(weekly_sales, fileConn)
  close(fileConn)
}
```
If you are fortunate to have access to a server that is connected to your database you can write several queries to a folder and have a script that iterates through the folder and executes each script. This can be very handy for running SQL queries overnight.

#### Executing queries
```
# Function to read SQL scripts
# From: https://stackoverflow.com/questions/44853322/how-to-read-the-contents-of-an-sql-file-into-an-r-script-to-run-a-query
getSQL <- function(filepath){
  con = file(filepath, "r")
  sql.string <- ""
  
  while (TRUE){
    line <- readLines(con, n = 1)
    
    if ( length(line) == 0 ){
      break
    }
    
    line <- gsub("\\t", " ", line)
    
    if(grepl("--",line) == TRUE){
      line <- paste(sub("--","/*",line),"*/")
    }
    
    sql.string <- paste(sql.string, line)
  }
  
  close(con)
  return(sql.string)
}

# Connect to Database (Redshift)
library(RJDBC)
conn <- dbConnect(...)

# Read SQL and get query results
query <- getSQL("weekly_sales.sql")
orders <- dbGetQuery(conn,query)

# Write data as insert
query <- getSQL("weekly_sales.sql")
insert_query <- paste0("INSERT INTO my_schema.my_global_weekly_sales_table (",query,")")
dbSendQuery(conn,query)
```

So we've created weekly sale, what about daily or monthly? For these, we can edit our function to add the option of picking the `date_type` of Daily, Weekly or Monthly.

#### Adding additional arguments
```
# Create Function
global_sales <- function(date_from,date_to,date_type = c('Daily','Weekly','Monthly')){
  
  date_column <- ifelse(date_type == "Daily","date",
                        ifelse(date_type == "Weekly","DATE_TRUNC('week',date)"
                               ,"DATE_TRUNC('month',date)"))
  
  
  query <- paste0("
SELECT 
region
,",date_column," as date
,'",date_type,"' as date_type
,product
,SUM(sales) as sales
,'",Sys.Date(),"' as data_written_date
FROM schema.global_sales
WHERE date>='",date_from,"'
AND date<='",date_to,"'
GROUP BY 
region
,",date_column,"
,product
")
  
  return(query)
  
}

daily_sales <- global_sales(date_from = '2020-10-26',date_to = '2020-11-01',date_type = 'Daily')
weekly_sales <- global_sales(date_from = '2020-10-26',date_to = '2020-11-01',date_type = 'Weekly')
monthly_sales <- global_sales(date_from = '2020-10-01',date_to = '2020-10-31',date_type = 'Monthly')

# Write SQL to file
fileConn <- file("daily_sales.sql")
writeLines(daily_sales, fileConn)
close(fileConn)

fileConn <- file("weekly_sales.sql")
writeLines(weekly_sales, fileConn)
close(fileConn)

fileConn <- file("monthly_sales.sql")
writeLines(monthly_sales, fileConn)
close(fileConn)
```
#### Central definitions

In practice, I have 10-20 functions that are writing 100s of queries in a week. Some standard definitions will apply to all the queries, like country grouping. 

In these cases, you can create a central `definitions` file and `source(definitions.R)` at the beginning of each function. In doing this when you make changes to the central `definitions` file the changes will be automatically applied to all of your future SQL queries. 

If you have any feedback for this project please feel free to:

- [Contact me](/contact.html)📫
- Raise a pull request on [wjsutton/useful_r_functions](https://github.com/wjsutton/useful_r_functions)🐙  
- Or send a tweet to [@WJSutton12](https://twitter.com/WJSutton12)💬

Cover icon made by <a href="https://www.flaticon.com/authors/icongeek26" title="Icongeek26">Icongeek26</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>