---
layout: default
title: Building a Shiny App Quiz inspired by BBC's House of Games
categories: [data-viz]
blurb: Inspired by the BBC TV programme Richard Osman's House of Games this a recreation of some of the quiz rounds packaged up in an R shiny app.
img: assets/images/house_of_games_micro.PNG
published: true
---
## Building a Shiny App Quiz

<a href="https://wjsutton.shinyapps.io/house_of_games/">
<img src='/assets/images/house_of_games_micro.PNG' align="right" style="width:35%;height:35%;padding-left:10px;"> 
</a>

I love a good quiz, and I'm a regular watcher of gameshows old and new. 

After watching a few episodes of Richard Osman’s House of Games I figured I could recreate a similar style of quiz for friends and family to take part in.

Richard Osman’s House of Games is composed of several rounds, each with their own question format, some examples are:

- **Cine-nyms** <br>Film quotes are reworded using a thesaurus.<br><br>
- **Where is Kazakhstan** <br>Answer to a question is a point on a map, you give your answer as a location point on a map.<br><br>
- **Answer Smash** <br>Picture from a theme (e.g. tools) and answer to a question smash together to form 1 answer, e.g. picture of a Hammer + "Underwater Disney adventure about this little humanoid creature" = Hammermaid (Hammer + Mermaid).<br><br>
- **Broken Karaoke** <br>The first letter of each word from the lyrics of a popular song appears on screen in the rhythm of the song.<br>

Some rounds present a higher technical challenge than others. For speed of deployment, I opted for what was currently possible with open source tools provided.

#### The `learnr` Package

After some research, I found the `learnr` package, which was developed by the RStudio team to support workshops and new users learn the R language. 

The `learnr` package builds a shiny app document with support for is creating quiz questions. From reviewing the docs the quiz question formats are limited to:

- Multiple choice, single answer
- Multiple choice, multiple answers
- Put the option in the correct order 

So rounds like **Where is Kazakhstan** would not be possible without development work. But I still felt a fun & challenging quiz would be possible.

#### Building Questions

To get a prototype quiz up and running I manually made the quiz questions. I had attempted building a function to reword film quotes **Cine-nyms** but the quality of output was quite poor, and for what was a weekend project this was eating up too much time.

There are plans to develop an automated solution to expand the number of questions available depending on feedback. 

Embeding questions in the Rmarkdown file follows the form:

```
quiz(caption="",
  question("What is 1 + 2?"),
    answer("1"),
    answer("2"),
    answer("3", correct = TRUE),
    answer("4"),
    random_answer_order = TRUE
    ,correct = paste0('CORRECT! The answer is 3!)
    ,incorrect = paste0('WRONG! The answer is 3!')
  ),
#	...
#	Add additional questions here
#	...
  )
``` 

Note:

- `random_answer_order` will randomise up the answers to questions.
- `correct` & `incorrect` are custom messages upon submitting the right/wrong answers.

#### Styling with CSS

The custom style here makes a bit impact on the looks and feel of the quiz. I honestly received better feedback for the app after styling it - despite the quiz questions bein the same!

To add a custom style to the shiny app you can create a css file. The css file must be located in the following path:
```
project_folder/css/mystyles.css
```
and in the Rmarkdown yaml you can reference this css file using:
```
output: 
  learnr::tutorial:
          progressive: true
          allow_skip: true
          css: css/house_of_games.css

```

For building the css file my process involved a lot of back and forth using the Google chrome developer tools. 

1. Inspect the section you want to change it with Google developer tools.
2. Add some styles to the css file for that section.
3. Refresh the page and see if anything has changed.

#### Publishing

The last step is publishing the quiz, this requires a [shinyapp.io account](https://www.shinyapps.io/) free accounts are available. And publishing can be executed from RStudio.

You can try out my quiz for yourself by clicking the image below or this link: [wjsutton.shinyapps.io/house_of_games/](https://wjsutton.shinyapps.io/house_of_games/).

<p align="center">
<a href="https://wjsutton.shinyapps.io/house_of_games/">
<img src='/assets/images/house_of_games.PNG' style="width:90%;height:90%;"> 
</a>
</p>

If you have any feedback for this project please feel free to:

- [Contact me](/contact.html)📫
- Raise a pull request on [wjsutton/house_of_games](https://github.com/wjsutton/house_of_games)🐙  
- Or send a tweet to [@WJSutton12](https://twitter.com/WJSutton12)💬
