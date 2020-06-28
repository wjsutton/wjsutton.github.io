# Load libraries
library(ggplot2)
library(reshape2)

skills <- read.csv("skills.csv",stringsAsFactors = F)

today <- as.character(Sys.Date())
skills$stop_date <- ifelse(skills$stop_date == ''
                   ,paste0(substr(today,9,10),'/',substr(today,6,7),'/',substr(today,1,4))
                   ,skills$stop_date)

skills$start_date <- paste0(substr(skills$start_date,7,10),'-',substr(skills$start_date,4,5),'-',substr(skills$start_date,1,2))
skills$stop_date <- paste0(substr(skills$stop_date,7,10),'-',substr(skills$stop_date,4,5),'-',substr(skills$stop_date,1,2))

skills$start_date <- as.Date(skills$start_date)
skills$stop_date <- as.Date(skills$stop_date)

# Calculate Duration
skills$duration <- as.integer(skills$stop_date-skills$start_date)

skills$years <- floor((skills$duration/365.25)*4)/4

skills$frequency <- as.factor(skills$frequency)
#skills$frequency <- factor(skills$frequency,levels(skills$frequency)[c(1,3,2)])

barplot <- ggplot(skills, aes(x=reorder(skill, years), y=years, fill = frequency)) + # enter data frame
  geom_bar(stat = "identity",colour = 'black') + 
  scale_fill_manual("Current Usage:     ", values = c("Daily" = "#323232", "Weekly" = "grey", "Working Knowledge" = "white")) +
  coord_flip() + # flip vertical bars into horizontal bar
  geom_text(aes(label = years # data labels
                ,y =  years + max(years)*0.01) # positioned just outside bar
                ,size = (5/14)*20 # sizing in line with theme text
                ,colour = "#323232" #colour text
                ,hjust = 0) + #align text
  theme(
    panel.grid.major = element_blank() # Remove gridlines (major)
    ,panel.grid.minor = element_blank() # Remove gridlines (minor)
    ,panel.background = element_blank() # Remove grey background
    ,plot.title = element_text(hjust = 0,vjust =0, size = 28, colour = "#323232") # Title size and colour
    ,plot.subtitle = element_text(hjust = 0, size = 12, colour = "#323232") # Subtitle size and colour
    ,plot.caption = element_text(vjust = 0.3, size = 12, colour = "#323232") # Caption size and colour
    ,axis.ticks.y = element_blank() # Remove tick marks (Y-Axis)
    ,axis.text.y = element_text(hjust = 1, colour = "#323232", size = 20) # Axis size and colour (Y-Axis)
    ,axis.ticks.x = element_blank() # Remove tick marks (X-Axis)
    ,axis.text.x  = element_blank() # Remove axis scale (X-Axis)
    ,axis.title.x = element_text(size = 20, colour = "#323232") # Axis label size and colour (X-Axis)
    #,legend.position = "bottom"
    ,plot.margin=unit(c(0,0,1.1,0),"cm")
    ,legend.position = c(.25,-0.16)
    ,legend.direction = "horizontal"
    ,legend.text = element_text(hjust = 0, size = 16, colour = "#323232") # Title size and colour
    ,legend.title = element_text(hjust = 0, size = 16, colour = "#323232") # Title size and colour
  ) +
  geom_hline(yintercept=0, color = "#7f7fff", size=1) + # Axis line size and colour (Y-Axis)
  labs(title = 'Software Skills' # Title text
       ,subtitle = element_blank() # Subtitle text
       ,x = element_blank() # Removed Y-Axis text (flipped co-ordinates) 
       ,y = 'Years of Experience' # X-Axis text (flipped co-ordinates) 
       ,caption = element_blank()) + # Caption text
  scale_y_continuous(limits = c(
    ifelse(min(skills$years)>=0,0,min(skills$years)*1.2) # Minimum X-Axis scale (flipped co-ordinates)
    ,max(skills$years)*1.2) # Maximum X-Axis scale (flipped co-ordinates)
    ,expand = c(0,0) # Removing blank space around plot (X-Axis (flipped co-ordinates))
  )
# Save the plot
ggsave("assets/skills_barplot.png" # filename
       ,plot = barplot # variable for file
       ,width = 8, height = 6, dpi = 300, units = "in") # dimensions and image quality
