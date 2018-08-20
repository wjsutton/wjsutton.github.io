# Tableau Tips & Tricks: #2 Title as a Sheet

![](https://d2mxuefqeaa7sj.cloudfront.net/s_10F82E5790D9C2764499E419D702B7A2737CA30D62F1BC628789579AA615BAF4_1534707391624_title_as_sheet_final.gif)

## Outline

Adding a title as a separate sheet rather than using the standard chart titles. 

## Use Cases
- When using a sheet selector the standard chart titles will appear as ‘NULL’ or ‘None’


## Prerequisites 

You have charts that need different titles where the standard chart title doesn’t do what you want.


## Step 1 - Create a Sheet and a Calculated Field
- Create a new sheet that will be your title
- Create a calculated field using a CASE expression mapping your parameter inputs to specific title, for example:

CASE [SALES]
WHEN 'By State' THEN 'US Superstore Sales by State, 2014'
WHEN 'By Sub-Category' THEN 'US Superstore Sales by Sub-Category, 2014'
END
Where:

- [SALES] is the input Parameter
- ‘By State’ and ‘By Sub-Category’ are the values for the Parameter [SALES],
- ‘US Superstore Sales by State, 2014’ and 'US Superstore Sales by Sub-Category, 2014’ are example titles
![](https://d2mxuefqeaa7sj.cloudfront.net/s_10F82E5790D9C2764499E419D702B7A2737CA30D62F1BC628789579AA615BAF4_1534707452666_title_as_sheet_1_create_sheet_and_calc_field.gif)

## Step 2 - Format Title
- Format the title using the text box to your preference or style guide
- Turn off tooltips if you don’t need them
![](https://d2mxuefqeaa7sj.cloudfront.net/s_10F82E5790D9C2764499E419D702B7A2737CA30D62F1BC628789579AA615BAF4_1534707463456_title_as_sheet_2_create_chart+title.gif)

## Step 3 - Add Sheet to Dashboard
- Drag the sheet to top of the layout container
- Set Fit to ‘Fit Width’
- Check the Parameter works as expected
![](https://d2mxuefqeaa7sj.cloudfront.net/s_10F82E5790D9C2764499E419D702B7A2737CA30D62F1BC628789579AA615BAF4_1534707473662_title_as_sheet_3_add_title_to_dashboard.gif)

## FAQs

Can I use this without a parameter input?

- Essentially yes, all we are doing here is defining a title as a calculated field and saying “If Option A happens show Title A” as such the CASE expression in Step 1 can be reworked to use a quick filter or dashboard action.

As this is a calculated field can I add dimensions and measures to it, e.g. year?

- Yes, although you will need to pass on any filters to the Chart Title sheet, and ensure the all the dimensions and measures are aggregated to one value, otherwise you’ll end up with multiple titles in the sheet, e.g. 
        US Superstore Sales by State, 2014
        US Superstore Sales by State, 2013

