---
layout: default
title: Tableau Tips & Tricks - 1 Sheet Selectors
categories: [tableau tips & tricks]
blurb: Sheet swapping in Tableau, a technique that allows you to change the type of charts shown on a dashboard.
img: assets/tableau_tips_and_tricks_gifs/t&t_01_sheet_selector/sheet_selector_final.gif
published: true
---
## Tableau Tips & Tricks: #1 Sheet Selectors

![Sheet Selector](/assets/tableau_tips_and_tricks_gifs/t&t_01_sheet_selector/sheet_selector_final.gif "Sheet Selector")

### Outline

A sheet selector is a technique in Tableau that allows you to change the type of charts shown on a dashboard.


### Use Cases
- Adding more data within the dashboard without overwhelming a user
- Showing a better-suited chart depending on user input


### Prerequisites 

You have two or more charts in individual sheets you wish to alternate between in a dashboard.


### Step 1 - Create a Parameter
- Data type: String
- In a list of values enter suitable names for your parameter options, in this case, I’ll be switching between State and Sub-Category so these will be my options

![Step 1](/assets/tableau_tips_and_tricks_gifs/t&t_01_sheet_selector/sheet_selector_1_create_parameter.gif "Step 1")

### Step 2 - Create Calculated Field

Name: Sheet Selector
CASE [SALES]
WHEN ‘By State' THEN 'A'
WHEN ‘By Sub-Category' THEN 'B'
END
Where:

-  [SALES] is the Parameter you created in Step 1,
- ‘By State’ and ‘By Sub-Category’ are the values you entered for Step 1’s Parameter,
- ‘A’ and ‘B’ generic terms to exclude one chart from the other, e.g. either show A or B

![Step 2](/assets/tableau_tips_and_tricks_gifs/t&t_01_sheet_selector/sheet_selector_2_create_calc_field.gif "Step 2")

### Step 3 - Apply Calculated Field 

For the charts you wish to alternate by in the Dashboard add the Calculated Field from Step 2 “Sheet Selector” into the filters. 

- Edit the filter
- Click “Custom Value List”
- Enter the corresponding value from Step 2’s Calculated Field, e.g. A or B
- Click “OK”

![Step 3](gifs/t&t_01_sheet_selector/sheet_selector_3_apply_calc_field.gif "Step 3")

### Step 4 - Build the Dashboard
- Prepare sheets for the Dashboard e.g. remove unnecessary filters or legends.
- For Step 1’s Parameter right-click an select “Show Parameter Control” so it appears in at least one of the sheets 
- In a Dashboard add a vertical layout container and add all sheets to that container
- Hide sheet titles, as these will always appear for the sheet
- Test the parameter to make sure it works as expected

![Step 4](/assets/tableau_tips_and_tricks_gifs/t&t_01_sheet_selector/sheet_selector_4_build_dashboard.gif "Step 4")

### FAQs

Can I show multiple charts at once?

- Yes, just make sure in all the charts you want to show have the same value in the filter’s “Custom Value List” - as described in Step 2.

What do I do about titles?

- Simple option add a text box for a title to the top of the vertical layout container
- If you need custom titles per chart, you can make a title as a sheet and give it a calculated field based on the option selected in Step 1’s parameter - I have this here:
[Title as a Sheet](Tableau-Tips-Tricks-2-Title-as-a-Sheet.html)

What about a legend?

- Similarly, titles you can create a custom legend as a separate sheet and add it to the Dashboard - I have covered two cases here:
- [Custom Categorical Legend](Tableau-Tips-Tricks-3-Custom-Categorical-Legend.html)
- [Custom Sequential Legend](Tableau-Tips-Tricks-4-Custom-Sequential-Legend.html)

Can I do this without a parameter?

- Yes, but you will need something to act as a filter, be this a quick filter or a dashboard action, you would then build the calculated field replacing the parameter with the quick filter or dashboard action

### Try it yourself!
Dashboard Link: <https://public.tableau.com/views/TipsTricks1-SheetSelector/SheetSelector?:embed=y&:display_count=yes>