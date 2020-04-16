---
layout: default
title: Beyond The Defaults - R Bar Chart
categories: [data-viz]
blurb: Improving the default output of the R ggplot2 bar chart.
img: assets/beyond_the_defaults/gifs/barplot_loop.gif
published: false
---
## Beyond The Defaults - R Bar Chart

One of the neat things about R is being able to produce charts with the ggplot2 library. There are many tutorials for getting started, however producing a fully finished chart can be a time consuming process. In the mini-series I look at the default charts from [R Graph Gallery](https://www.r-graph-gallery.com/index.html) and try to go beyond the defaults and get towards a best practice data visualisation. 

Bar charts are some of most effective charts for simple data structures. The following walkthrough takes the default [R Graph Gallery bar chart](https://www.r-graph-gallery.com/218-basic-barplots-with-ggplot2.html) and shifts it towards best practice.

#### End Product

<img src="/assets/beyond_the_defaults/bar_chart/barplot_final.png" align="left" style="width:50%;height:50%;padding-right:10px;">

<br><br><br><br><br><br>
<br><br><br><br><br><br>

```r
# Load libraries
library(ggplot2)
library(reshape2)

# Create data
data <- data.frame(
  name=c("A","B","C","D","E") ,  
  value=c(3,12,5,18,45)
)

barplot <- ggplot(data, aes(x=reorder(name, value), y=value)) + #enter data frame
  geom_bar(stat = "identity"
           ,fill = "#7f7fff") + # colour bars
  coord_flip() + # flip vertical bars into horizontal bar
  geom_text(aes(label = value # data labels
                ,y =  value + max(value)*0.03) # positioned just outside bar
            ,size = (5/14)*12 # sizing in line with theme text
            ,colour = "#323232") + #colour text
  theme(
    panel.grid.major = element_blank() # Remove gridlines (major)
    ,panel.grid.minor = element_blank() # Remove gridlines (minor)
    ,panel.background = element_blank() # Remove grey background
    ,plot.title = element_text(hjust = 0, size = 20, colour = "#323232") # Title size and colour
    ,plot.subtitle = element_text(hjust = 0, size = 12, colour = "#323232") # Subtitle size and colour
    ,plot.caption = element_text(vjust = 0.3, size = 12, colour = "#323232") # Caption size and colour
    ,axis.ticks.y = element_blank() # Remove tick marks (Y-Axis)
    ,axis.text.y = element_text(hjust = 1, colour = "#323232", size = 12) # Axis size and colour (Y-Axis)
    ,axis.ticks.x = element_blank() # Remove tick marks (X-Axis)
    ,axis.text.x  = element_blank() # Remove axis scale (X-Axis)
    ,axis.title.x = element_text(size = 12, colour = "#323232") # Axis label size and colour (X-Axis)
  ) +
  geom_hline(yintercept=0, color = "#7f7fff", size=1) + # Axis line size and colour (Y-Axis)
  labs(title = 'My awesome descriptive title' # Title text
       ,subtitle = "Note: this is a subtitle" # Subtitle text
       ,x = element_blank() # Removed Y-Axis text (flipped co-ordinates) 
       ,y = 'Value (units)' # X-Axis text (flipped co-ordinates) 
       ,caption = "Author: My Name, Source: ") + # Caption text
  scale_y_continuous(limits = c(
    ifelse(min(data$value)>=0,0,min(data$value)*1.05) # Minimum X-Axis scale (flipped co-ordinates)
    ,max(data$value)*1.05) # Maximum X-Axis scale (flipped co-ordinates)
    ,expand = c(0,0) # Removing blank space around plot (X-Axis (flipped co-ordinates))
  )

ggsave("barplot_final.png" # filename
       ,plot = barplot # variable for file
       ,width = 5, height = 4, dpi = 300, units = "in") # dimensions and image quality
```

