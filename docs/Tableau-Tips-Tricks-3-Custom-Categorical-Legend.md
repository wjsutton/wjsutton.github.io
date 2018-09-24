# Tableau Tips & Tricks: #3 Custom Categorical Legends
AKA: Legend as a Sheet

## Outline

Add a custom categorical legend to a dashboard

## Use Cases
- Making a consistent legend not dependent on a chart
- Merging different legends together as one

## Example of Problem
![Example of Problem](wjsutton.github.io/gifs/t&t_03_categorical_legend/custom_cat_legend_1.gif "Example of Problem")

I have a standard Tableau legend for three charts in my dashboard, if I apply filters they will be applied to the legend, in some cases the legend will not represent all the colours in the dashboard which may be confusing. 

## Step 1 - Build the data in Excel and import to Tableau
- In Excel in a column enter a heading (in this case "Legend") followed by your legend options
- Copy this data in Excel
- In Tableau, under the heading "Data" click "Paste" 

![Step 1](wjsutton.github.io/gifs/t&t_03_categorical_legend/custom_cat_legend_2_excel_transfer.gif "Step 1")


## Step 2 - Create dummy field and build legend
- Using the imported data start building the legend by:
- Add "Legend" to Rows
- Add "Legend" to Color
- Create a calculated field
     name: dummy field
     calculation: MIN(1)
- Add "dummy field" to Columns
- Change chart type to Shape: Filled Square
- Add "Legend" to Label 

![Step 2](wjsutton.github.io/gifs/t&t_03_categorical_legend/custom_cat_legend_3_build_dummy_field.gif "Step 2")


## Step 3 - Clean up legend
- Edit the axis of "dummy field" to a range of 0 to 8 (this will shift the marks to the left, you can adjust this range to your preference)
- Right click on the axis, untick "Show Header"
- Format the lines on the chart, set all to "None" until no lines appear on the legend 
- Edit the title to Legend and format

![Step 3](wjsutton.github.io/gifs/t&t_03_categorical_legend/custom_cat_legend_4_clean_up.gif "Step 3")


## Step 4 - Add legend to dashboard
- Drag the newly created sheet to your dashboard
- Delete the default legend which is inserted
- Set view to "Entire View"
- If you have dashboard actions make sure they don't apply to your legend sheet

![Step 4](wjsutton.github.io/gifs/t&t_03_categorical_legend/custom_cat_legend_5_add_to_dash.gif "Step 4")


## FAQs

Do I have to insert data from Excel?

- No depending on how your data is structured you may be able to use the existing data source and create a sheet in a similar fashion. 
