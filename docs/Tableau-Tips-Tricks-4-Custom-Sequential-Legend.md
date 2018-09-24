# Tableau Tips & Tricks: #4 Custom Sequential Legends
AKA: Legend as a Sheet

## Outline

Add a custom sequential legend to a dashboard

## Use Cases
- Making a consistent legend not dependent on a chart

## Step 1 - Set all Sequential Charts to the same range
- In your Tableau dashboard for each chart using a sequential range set them all to a standard range by:
- Go to sheet
- Click "Color", Edit Colours..
- Click "Advanced" then set you start and end ranges

![Step 1](wjsutton.github.io/gifs/t&t_04_sequential_legend/custom_seq_legend_1_set_seq_for_all.gif "Step 1")


## Step 2 - Build Legend Range in Excel and Insert to Tableau
- Create a numerical list based on the colour range you entered in Step 1, I use 10 points (this only affects the numbers of colours displayed in the legend - you can increase or decrease this depending on your case)
- Copy the Excel data, in Tableau right click on "Data" and then "Paste" to enter the data as a data source
- Begin building the sequential legend:
- Duplicate "Legend", convert it to a Dimension and add it to Rows
- Create a calculated field
     name: dummy field
     calculation: MIN(1)
- Add "dummy field" to Columns
- Add the Measure version of "Legend" to Color

![Step 2](wjsutton.github.io/gifs/t&t_04_sequential_legend/custom_seq_legend_2_excel_transfer.gif "Step 2")


## To be Continued...


## Step 3 - Build Sequential Legend

![Step 3](wjsutton.github.io/gifs/t&t_04_sequential_legend/custom_seq_legend_3_build_seq.gif "Step 3")


## Step 4 - Tidy up Sequential Legend

![Step 4](wjsutton.github.io/gifs/t&t_04_sequential_legend/custom_seq_legend_4_tidy_up_seq.gif "Step 4")


## Step 5 - Add legend to dashboard

![Step 5](wjsutton.github.io/gifs/t&t_04_sequential_legend/custom_seq_legend_5_add_to_dash.gif "Step 5")

## FAQs