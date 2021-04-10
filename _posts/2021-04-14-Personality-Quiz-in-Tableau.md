---
layout: default
title: Building a Personality Quiz in Tableau
categories: [data-viz]
blurb: Giving users a personalised data story through personality quizzes 
img: assets/images/personality-quiz-in-tableau.PNG
published: true
---

## Building a Personality Quiz in Tableau

Personality quizzes have been around since the 1920s. Essentially, it's a short questionnaire that tests traits and behaviours that people exhibit in various situations. 

##### Typical uses are:

- Self-awareness, e.g. Myers Briggs Type
- Profiling of job candidates
- Entertainment, which fictional/movie character are you? [https://openpsychometrics.org/tests/characters/](https://openpsychometrics.org/tests/characters/) 


### Why would you create a Personality Quiz in Tableau?
To add a narrative storey to your dashboard, where the workflow is as follows:

1. The user fills out the quiz.
2. Their answers then filters the data for a specific character
3. This creates a personalised data story

When should you add a personality quiz?
Adding this type of section would not be recommended in all situations, especially if you're creating a business dashboard where your users are looking for quick insights - for example, did sales go up last week? 

When you add a quiz, you decrease the speed at which users receive insights, but you increase interest and engagement by providing a personalized experience.

##### When it works

You want to:

- Create a connection between your user and the data
- Get your audience to see the world from a new perspective
- Build a storyboard / tabbed view

##### When it doesn't work

When speed matters, your audience wants to see the data quickly, i.e. did sales increase last week?

### Build the quiz

Before diving into Tableau, you need to decide on the content for your quiz.

1. Decide on the characters (max. 6) that can be chosen
2. Give each character a personality or typical behaviour
3. Create 4-6 situational questions for your characters to respond to
4. Write an answer to each question based on the personalities of all your characters 

##### Example

For my use case, choosing a chess piece, my characters are:
<br>King ♚, Queen ♛, Bishop ♝, Knight ♞, Rook ♜, Pawn ♟

Then I gave each character a personality: 
<br>♚ -> Commanding &nbsp;♞ -> Courageous
<br>♛ -> Powerful &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;♜ -> Strategic
<br>♝ -> Personal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;♟ -> Lawful

The questions were themed around a quest to a nearby location giving a few decisions on the way, such as:
Whilst travelling you meet a fork in the road, what do you do?

For which I gave the answers:
<br>♚ (Commanding) - Pay someone to take you.
<br>♛ (Powerful) - Climb a tree to get a better view of your destination
<br>♝ (Personal) - Wait and ask someone
<br>♞ (Courageous) - Take the path less travelled
<br>♜ (Strategic) - Take the more travelled path
<br>♟ (Lawful) - Flip a coin

##### In Tableau

1. Create a parameter for each of your questions, data type = string.
2. Assign a number for each character 1 - the total number of characters.
3. In the parameter menu, change "Display as" from a number to the answer of the character to the question

<br>Repeat for all your questions

<img src="/assets/images/personality-quiz-parameter.PNG" style="width:95%;padding:10px;"/>

0 is reserved for the default option, which is displayed as "pick an option", more on that later.

##### Quiz Scores

You will need to calculate the score of each character based on the question parameters.
Since our parameters are strings we need to make sure we match strings or convert the strings to integers.
Repeat for each character

##### Example
Quiz - Character 2 score
```
(IF INT([Question 1])=2 THEN 1 ELSE 0 END) +
(IF INT([Question 2])=2 THEN 1 ELSE 0 END) +
(IF INT([Question 3])=2 THEN 1 ELSE 0 END) +
(IF INT([Question 4])=2 THEN 1 ELSE 0 END) +
(IF INT([Question 5])=2 THEN 1 ELSE 0 END)
```

The calculated field says: "Does the answer to the question match this character? If yes then count that answer and sum to give a total score".

For the 0 - pick an option, you can decide what the default option is, I chose the weakest character. If completing the quiz is required, you can set up a sheet to block the option to continue, which will be removed when all of the questions are answered. Search for "tableau sheet selector" to check out this technique

##### In a dashboard 

In my example linked below, the quiz is on the second tab, which then leads to the third tab where your character and associated data are displayed. 

<a href="https://public.tableau.com/profile/wjsutton#!/vizhome/ChessLifeExpectancy/Title">
<img src="/assets/images/personality-quiz-dashboard.PNG" style="width:95%;padding:10px;"/>
</a>




If you have any feedback for this project please feel free to:

- [Contact me](/contact.html)📫
- Comment on my Instagram account [instagram.com/data.gram](https://www.instagram.com/data.gram/)📸  
- Or send a tweet to [@WJSutton12](https://twitter.com/WJSutton12)💬
