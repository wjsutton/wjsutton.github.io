# Tableau Tips & Tricks: #1 Sheet Selectors

![Sheet Selector](/gifs/t&t_01_sheet_selector/sheet_selector_final.gif "Sheet Selector")

## Outline

A sheet selector is a technique in Tableau that allows you to change the type of charts shown on a dashboard.


## Use Cases
- Adding more data within the dashboard without overwhelming a user
- Showing a better suited chart depending on user input


## Prerequisites 

You have two or more charts in individual sheets you wish to alternate between in a dashboard.


## Step 1 - Create a Parameter
- Data type: String
- In list of values enter suitable names for you parameter options, in this case I’ll be switching between State and Sub-Category so these will be my options

![Step 1](/gifs/t&t_01_sheet_selector/sheet_selector_1_create_parameter.gif "Step 1")

## Step 2 - Create Calculated Field

Name: Sheet Selector
CASE [SALES]
WHEN ‘By State' THEN 'A'
WHEN ‘By Sub-Category' THEN 'B'
END
Where:

-  [SALES] is the Parameter you created in Step 1,
- ‘By State’ and ‘By Sub-Category’ are the values your entered for Step 1’s Parameter,
- ‘A’ and ‘B’ generic terms to exclude one chart from the other, e.g. either show A or B

![Step 2](/gifs/t&t_01_sheet_selector/sheet_selector_2_create_calc_field.gif "Step 2")

## Step 3 - Apply Calculated Field 

For all chart you wish to alternate by in the Dashboard add the Calculated Field from Step 2 “Sheet Selector” into the filters. 

- Edit the filter
- Click “Custom Value List”
- Enter the corresponding value from Step 2’s Calculated Field, e.g. A or B
- Click “OK”

![Step 3](/gifs/t&t_01_sheet_selector/sheet_selector_3_apply_calc_field.gif "Step 3")

## Step 4 - Build the Dashboard
- Prepare sheets for the Dashboard e.g. remove unnecessary filters or legends.
- For Step 1’s Parameter right click an select “Show Parameter Control” so it appears in at least one of the sheets 
- In a Dashboard add a vertical layout container and add all sheets to that container
- Hide sheet titles, as these will always appear for the sheet
- Test the parameter to make sure it works as expected

![Step 4](/gifs/t&t_01_sheet_selector/sheet_selector_4_build_dashboard.gif "Step 4")

## FAQs

Can I show multiple charts at once?

- Yes, just make sure in the all the charts you want to show have the same value in the filter’s “Custom Value List” - as described in Step 2.

What do I do about titles?

- Simple option add a text box for title to the top of the vertical layout container
- If you need custom titles per chart, you can make a title as a sheet and give it a calculated field based on the option selected in Step 1’s parameter - I will cover this in a later tutorial

What about a legend?

- Similarly to titles you can create a custom legend as a separate sheet and add it to the Dashboard - again I will cover this is in a later tutorial

Can I do this without a parameter?

- Yes, but you will need some kind of filter be this a quick filter or a dashboard action, you would then build the calculated field replacing the parameter with the quick filter or dashboard action

