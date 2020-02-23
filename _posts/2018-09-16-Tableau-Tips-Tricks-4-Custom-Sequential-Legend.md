---
layout: default
title: Tableau Tips & Tricks - 4 Custom Sequential Legends
categories: [data-viz]
blurb: Customised sequential legends in Tableau.
img: assets/tableau_tips_and_tricks_gifs/t&t_04_sequential_legend/custom_seq_legend_4_tidy_up_seq.gif 
published: true
---
## Tableau Tips & Tricks: #4 Custom Sequential Legends
AKA: Legend as a Sheet

### Outline

Add a custom sequential legend to a dashboard

### Use Cases
- Making a consistent legend not dependent on a chart

### Step 1 - Set all Sequential Charts to the same range
- In your Tableau dashboard for each chart using a sequential range set them all to a standard range by:
- Go to sheet
- Click "Color", Edit Colours
- Click "Advanced" then set you start and end ranges

![Step 1](/assets/tableau_tips_and_tricks_gifs/t&t_04_sequential_legend/custom_seq_legend_1_set_seq_for_all.gif "Step 1")


### Step 2 - Build Legend Range in Excel and Insert to Tableau
- Create a numerical list based on the colour range you entered in Step 1, I use 10 points (this only affects the numbers of colours displayed in the legend - you can increase or decrease this depending on your case)
- Copy the Excel data, in Tableau right click on "Data" and then "Paste" to enter the data as a data source
- Begin building the sequential legend:
- Duplicate "Legend", convert it to a Dimension and add it to Rows
- Create a calculated field
     name: dummy field
     calculation: MIN(1)
- Add "dummy field" to Columns
- Add the Measure version of "Legend" to Color

![Step 2](/assets/tableau_tips_and_tricks_gifs/t&t_04_sequential_legend/custom_seq_legend_2_excel_transfer.gif "Step 2")


### Step 3 - Continue Building Sequential Legend
- Rotate axis so the coloured bars are horizontal and maximise their size
- Create data labels by adding your measure to Label and set "Marks to Label" to "Max/Min", format the measure if necessary
- Hide the axis header by right-clicking and unticking "Show Header", remove default legend

![Step 3](/assets/tableau_tips_and_tricks_gifs/t&t_04_sequential_legend/custom_seq_legend_3_build_seq.gif "Step 3")


### Step 4 - Tidy up Sequential Legend
- Alter the dummy field axis to move the sequential legend up by altering the axis range, in the example I pick -0.2 to 1, however you may need to convert the dummy field to a numeric/decimal type - this can be done by edit the calculated field to MIN(1.0)
- Rename the Sheet Title to Legend and format
![Step 4](/assets/tableau_tips_and_tricks_gifs/t&t_04_sequential_legend/custom_seq_legend_4_tidy_up_seq.gif "Step 4")


### Step 5 - Add legend to dashboard
- Drag the newly sheet into your dashboard, adjust as necessary
- Make sure you disable any filter or actions from affecting this sheet

![Step 5](/assets/tableau_tips_and_tricks_gifs/t&t_04_sequential_legend/custom_seq_legend_5_add_to_dash.gif "Step 5")

### FAQs

Do I have to insert data from Excel?

- No depending on how your data is structured you may be able to use the existing data source and create a sheet in a similar fashion. 

### Try it yourself!
[Dashboard Link](https://public.tableau.com/views/TipsTricks4-CustomSequentialLegend/GlobalSuperstoreSales?:embed=y&:display_count=yes)