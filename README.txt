BY MICHELLE M HEY AND CHRISTIAN C WADDEY

BeerBaseball

This application has the following functionality tested:

Phase One:
-Uses Bootstrap
-Sets up a league by virtue of teams being added. Fewer than 4 teams can be in a league and more than 8 teams can be in a league, but the schedule and scores will not be displayed unless there are between 4 and 8 teams.
-Team info is collected and saved to the backlift server using JSON and AJAX
-Team details are shown if the team is hovered over in the standings list

Phase Two:
-The predefined shedule is implemented by associating each team's place in an unsorted array (+1) with the number in the schedule array.
-Scores can be captured from any game of the season at any time, simply by entering the appropriate week and game number into the form.
-The standings are updated automatically when scores are captured, sometimes the submit button on the update scores modal takes two clicks to register the scores. Opening the javascript console provided us with verification. Users may unfortunately have to do the same.
-The standings are sorted on wins alone. Win percentage does not factor in, but it could be made to do so very easily.