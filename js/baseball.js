var teamArray = new Array();

var noSortArr = new Array(); // the same as teamArray but it never gets sorted

var scores = new Array(); // this holds the Score objects in an array

var sched = [
  [ //sched4 array
    [ [1, 4], [2, 3] ],
    [ [1, 3], [2, 4] ],
    [ [1, 2], [3, 4] ]
  ],
  [ //sched6 array,  
    [ [1, 6], [2, 5], [3, 4] ],
    [ [1, 5], [4, 6], [2, 3] ],
    [ [1, 4], [3, 5], [2, 6] ],
    [ [1, 3], [2, 4], [5, 6] ],
    [ [1, 2], [3, 6], [4, 5] ]
  ],
  [ //sched8 array
    [ [1, 8], [2, 7], [3, 6], [4, 5] ],
    [ [1, 7], [6, 8], [2, 5], [3, 4] ],
    [ [1, 6], [5, 7], [4, 8], [2, 3] ],
    [ [1, 5], [4, 6], [3, 7], [2, 8] ],
    [ [1, 4], [3, 5], [2, 6], [7, 8] ],
    [ [1, 3], [2, 4], [5, 8], [6, 7] ],
    [ [1, 2], [3, 8], [4, 7], [5, 6] ]
  ]
]

// $.ajax({
//   type: "DELETE",
//   url: "/backliftapp/scores/1f7275b5-e700-4bb9-81b6-09eda3af3746"
// });

var Score = function(week, game, scoreOne, scoreTwo) {
  this.week = week;
  this.game = game;
  this.scoreOne = scoreOne;
  this.scoreTwo = scoreTwo;
}

var Team = function(teamName, mgName, phoneNum, sponsorName, mgZip, wins, losses, teamId) {
  this.teamName = teamName;
  this.mgName = mgName;
  this.phoneNum = phoneNum;
  this.sponsorName = sponsorName;
  this.mgZip = mgZip;
  this.wins = wins;
  this.losses = losses;
  this.teamId = teamId;

}; 

function getTeamIndex(week, game, num) {
  var index = sched[Math.round(noSortArr.length / 2 - 2)][week][game][num];
  return index - 1;
}

function getTeam(week, game, num) {
  var index = sched[Math.round(noSortArr.length / 2 - 2)][week][game][num];
  console.log(index);
  console.log(noSortArr[index - 1]);
  return noSortArr[index - 1];
}

function updateScores (form) {
  var tempScore = new Score(parseInt(form.gameWeek.value) - 1, parseInt(form.gameNum.value) - 1, parseInt(form.scoreOne.value), parseInt(form.scoreTwo.value));
  scores.push(tempScore);

  $.ajax({
    type: "POST",
    url: "/backliftapp/scores",
    data: {
      week: tempScore.week,
      game: tempScore.game,
      scoreOne: tempScore.scoreOne,
      scoreTwo: tempScore.scoreTwo
    },
    success: function(){
      if (tempScore.scoreOne > tempScore.scoreTwo) {
        var winner = getTeam(tempScore.week, tempScore.game, 0);
        winner.wins++;
        var loser = getTeam(tempScore.week, tempScore.game, 1);
        loser.losses++;
        $.ajax({
          type: "PUT",
          url: "/backliftapp/teams/" + winner.teamId,
          data: {
            wins: winner.wins
          },
          success: function(){
            $.ajax({
              type: "PUT",
              url: "/backliftapp/teams/" + loser.teamId,
              data: {
                losses: loser.losses
              }
            });
          } 
        });
      }
      else {
        var winner = getTeam(tempScore.week, tempScore.game, 1);
        winner.wins++;
        var loser = getTeam(tempScore.week, tempScore.game, 0);
        loser.losses++;
        $.ajax({
          type: "PUT",
          url: "/backliftapp/teams/" + winner.teamId,
          data: {
            wins: winner.wins
          },
          success: function(){
            $.ajax({
              type: "PUT",
              url: "/backliftapp/teams/" + loser.teamId,
              data: {
                losses: loser.losses
              }
            });
          } 
        });
      }
      $.ajax({
        type: "GET",
        url: "/backliftapp/teams",
        success: function(result) {
          teamArray.splice(0, teamArray.length);
          for (var i = 0; i < result.length; i++) {
            var tempTeam = new Team (result[i]["teamName"], 
                                     result[i]["mgName"], 
                                     result[i]["phoneNum"], 
                                     result[i]["sponsorName"], 
                                     result[i]["mgZip"], 
                                     result[i]["wins"], 
                                     result[i]["losses"], 
                                     result[i]["id"]);
            teamArray.push(tempTeam);
          }
          console.log(teamArray);
          writeResults();
        }
      });
    }
  });
};


// load in all data about previously stored teams first, store in teamArray and noSortArray
$.ajax({
  type: "GET",
  url: "/backliftapp/teams",
  success: function(result) {
    for (var i = 0; i < result.length; i++) {
      var tempTeam = new Team (result[i]["teamName"], 
                               result[i]["mgName"], 
                               result[i]["phoneNum"], 
                               result[i]["sponsorName"], 
                               result[i]["mgZip"], 
                               result[i]["wins"], 
                               result[i]["losses"], 
                               result[i]["id"]);
      teamArray.push(tempTeam); 
      var tempTeam2 = new Team (result[i]["teamName"], 
                                result[i]["mgName"], 
                                result[i]["phoneNum"], 
                                result[i]["sponsorName"], 
                                result[i]["mgZip"], 
                                result[i]["wins"], 
                                result[i]["losses"], 
                                result[i]["id"]);
      noSortArr.push(tempTeam2);                       
    };

    $.ajax({
      type: "GET",
      url: "/backliftapp/scores",
      success: function(result){
        for (var i = 0; i < result.length; i++) {
          var tempScore = new Score(parseInt(result[i]["week"]), parseInt(result[i]["game"]), parseInt(result[i]["scoreOne"]), parseInt(result[i]["scoreTwo"]));
          scores.push(tempScore);
          console.log(scores);
        }
        writeResults();
      }
    });
    
  }
});



function sortArray(ta2) { // returns a sorted array of ta2
  var sortedArray = new Array();
  while (ta2.length > 0) {
    var mostIndex = 0;
    for (var i = 1; i < ta2.length; i++) {
      if (ta2[mostIndex].wins < ta2[i].wins) {
        mostIndex = i;
      };
    };
    sortedArray.push(ta2[mostIndex]);
    ta2.splice(mostIndex, 1);
  };
  return sortedArray;
};


function deleteTeam(deleteId) {
  console.log(deleteId);
  $.ajax({
  type: "DELETE",
  url: "/backliftapp/teams/" + deleteId, 
  success: function(result) { 
    console.log("Deleted!");
    teamArray.splice(0, teamArray.length);
    noSortArr.splice(0, noSortArr.length);
    $.ajax({
      type: "GET",
      url: "/backliftapp/teams",
      success: function(result) {
        for (var i = 0; i < result.length; i++) {
          var tempTeam = new Team (result[i]["teamName"], 
                                   result[i]["mgName"], 
                                   result[i]["phoneNum"], 
                                   result[i]["sponsorName"], 
                                   result[i]["mgZip"], 
                                   result[i]["wins"], 
                                   result[i]["losses"], 
                                   result[i]["id"]);
          teamArray.push(tempTeam);   
          var tempTeam2 = new Team (result[i]["teamName"], 
                                    result[i]["mgName"], 
                                    result[i]["phoneNum"], 
                                    result[i]["sponsorName"], 
                                    result[i]["mgZip"], 
                                    result[i]["wins"], 
                                    result[i]["losses"], 
                                    result[i]["id"]);
          noSortArr.push(tempTeam2);                     
        };
        writeResults();
        } 
      });
    } 
  });
};

function writeScores(week, game) {
  // console.log(scores);
  // if (scores[week][game][0] === 0 && scores[week][game][1] === 0) {
  //   return "";
  // }
  // else {
  //   return "Result: " + scores[week][game][0] + " to " + scores[week][game][1];
  // }

  for (var i = 0; i < scores.length; i++) {
    if((scores[i].week == week) && (scores[i].game == game)) {
      return "" + scores[i].scoreOne + " to " + scores[i].scoreTwo;
    }
  };
  return "";

};

function writeSchedule(week) { // week is 1 indexed, i.e. like humans, not computers
  noSortArr = noSortArr; // is necessary because js arrays are weird 
  if((noSortArr.length < 4) || (noSortArr.length > 8)) {
    $("#schedule").html("<p>You need 4-8 teams to have a Schedule</p>")
    return;
  }
  else {
    var weekDiv = document.createElement("div");
    var weekNumPara = document.createElement("p");
    $(weekNumPara).html("Week " + week);
    weekDiv.appendChild(weekNumPara);
    
    var theSch = sched[Math.round(noSortArr.length / 2 - 2)][week-1];
    var hasBye = false;
    if (noSortArr.length % 2 === 1) {
      hasBye = true;
    }
    for (var i = 0; i < theSch.length; i++) {
      if (hasBye && (theSch[i][1] == noSortArr.length + 1) ) {
        var weekByePara = document.createElement("p");
        $(weekByePara).html("(Game " + (i + 1) + ") " + noSortArr[theSch[i][0] - 1].teamName + " have a bye this week.");
        weekDiv.appendChild(weekByePara);
      }
      else {
        var weekGamePara = document.createElement("p");
        $(weekGamePara).html("Game " + (i + 1) + ": " + noSortArr[theSch[i][0] - 1].teamName + " vs. " + noSortArr[theSch[i][1] - 1].teamName + writeScores(week - 1, i));
        weekDiv.appendChild(weekGamePara);
      } 
    }
  $("#schedule").append(weekDiv);
  }
}

function writeResults() {
  teamArray = sortArray(teamArray); //simply a method call
  
  $("#standings").html("");
   for(var i = 0; i < teamArray.length; i++) {
    //var textNode = document.createTextNode(teamArray[i].teamName);
    
    var divTeamName = document.createElement("div");

    divTeamName.id = teamArray[i].teamId;

    $(divTeamName).html(teamArray[i].teamName + " <button class='deleteBtn' onClick='deleteTeam(this.parentNode.id)'>Delete</button> Wins: " + teamArray[i].wins + " Losses: " + teamArray[i].losses);  

    if(i % 2 === 0) divTeamName.className = "grayClass popup";
    else divTeamName.className = "lightGray popup";
    //document.getElementById("standings").appendChild(divTeamName);
    $("#standings").append(divTeamName);
    var subDiv = document.createElement("div");

    $(subDiv).html("Team Name: " + teamArray[i].teamName + "</br>Managed By: " + teamArray[i].mgName + "</br>Manager Phone: " + teamArray[i].phoneNum + "</br>Team Sponsor: " + teamArray[i].sponsorName + "</br>Zip Code: " + teamArray[i].mgZip);

    // var divText = document.createTextNode("");
    // subDiv.appendChild(divText);
    divTeamName.appendChild(subDiv);
    $("#standings .popup div").hide();

    $("#standings .popup").hover(
      function() {
        $(this).children().last().show();
      },
      function() {
        $(this).children().last().hide();
      });
  }
  $("#schedule").html("");
  for (var i = 0; i < (Math.round(noSortArr.length / 2) * 2 - 1); i++) 
    writeSchedule(i + 1);
};

      

function createTeam(form) {
  var sampleTeam = new Team (form.teamName.value, form.mgName.value, form.phoneNum.value, form.sponsorName.value, form.mgZip.value, 0, 0, 0);
  var sampleTeam2 = new Team (form.teamName.value, form.mgName.value, form.phoneNum.value, form.sponsorName.value, form.mgZip.value, 0, 0, 0);

  teamArray.push(sampleTeam);
  noSortArr.push(sampleTeam2);  
  
  $.ajax({
    type: "POST",
    url: "/backliftapp/teams",
    data: {
      teamName: form.teamName.value,
      mgName: form.mgName.value,
      phoneNum: form.phoneNum.value,
      sponsorName: form.sponsorName.value,
      mgZip: form.mgZip.value,
      wins: 0,
      losses: 0
    },
    success: function(result){
      $("#teamForm")[0].reset();


      sampleTeam.teamId = result['id'];
      sampleTeam2.teamId = result['id'];

      writeResults();
    }
    
  });         
};

$(document).ready(function(){
  $("#teamForm").submit(function(e){
    e.preventDefault();
  }).validate({
       rules: {
      teamName: {
        minlength: 2,
        maxlength: 20,
        required: true
      },
      mgName: {
        minlength: 2,
        maxlength: 20,
        required: true
      },
       phoneNum: {
        digits: true,
        required: true,
        rangelength: [10, 10]
    },
    sponsorName: {
        minlength: 2,
        maxlength: 20,
        required: true
      },
      mgZip: {
        digits:true,
        required:true,
        rangelength:[5,5]
      },
      
      subject: {
    selectNone: true

      },

    },
    highlight: function(label) {
        $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
        label
            .text('OK!').addClass('valid')
            .closest('.control-group').addClass('success');
    },
    submitHandler: function(form){
      createTeam(form);
    }
  });
});

$(document).ready(function(){
  $("#scoreForm").submit(function(e){
    e.preventDefault();
  }).validate({
       rules: 
      {
      gameWeek: {
        digits: true,
        min: 1,
        // max: 3,
        required: true
      },
      gameNum: {
        digits: true,
        min: 1,
        // max: 2,
        required: true
      },
      scoreOne: {
        digits: true,
        required: true,
        min: 0
      },
      scoreTwo: {
        digits: true,
        required: true,
        min: 0
      },
      
      subject: {
        selectNone: true
      },

    },
    highlight: function(label) {
        $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
        label
            .text('OK!').addClass('valid')
            .closest('.control-group').addClass('success');
    },
    submitHandler: function(form){
      updateScores(form);
    }
  });
});

