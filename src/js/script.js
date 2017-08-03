$(document).ready(function() {
  var clockState = "work";
  var machineState = "pause";
  var initialized = false;
  var ret = [];
  // Configures Knob which indicates the elapsed time
  $(".cir2").knob({
    width: 440,
    height: 440,
    bgColor: "white",
    thickness: ".1",
    angleOffset: -170,
    angleArc: 340,
    rotation: "anticlockwise",
    readOnly: true,
    step: 1,
    displayInput: true
  });

  // Handles clicking the minus icon on the work time
  $("#subFromWork").click(function() {
    var val = parseInt($("#timeOfWork").html());
    if ((val > 1) & (machineState === "pause")) {
      $("#timeOfWork").html(val - 1);
      $("#clock").html(addLeadZero((val - 1).toString()) + ":00");
      initialize();
    }
  });

  // Handles clicking the plus icon on the work time
  $("#addToWork").click(function() {
    var val = parseInt($("#timeOfWork").html());
    if ((val < 60) & (machineState === "pause")) {
      $("#timeOfWork").html(val + 1);
      $("#clock").html(addLeadZero((val + 1).toString()) + ":00");
      initialize();
    }
  });

  // Handles clicking the minus icon on the break time
  $("#subFromBreak").click(function() {
    var val = parseInt($("#timeOfBreak").html());
    if ((val > 1) & (machineState === "pause")) {
      $("#timeOfBreak").html(val - 1);
      initialize();
    }
  });

  // // Handles clicking the plus icon on the break time
  $("#addToBreak").click(function() {
    var val = parseInt($("#timeOfBreak").html());
    if ((val < 60) & (machineState === "pause")) {
      $("#timeOfBreak").html(val + 1);
      initialize();
    }
  });

  // Handles Clicking the clock, which will start or pause the running time
  $("#clock").click(function() {
    if ((machineState === "pause") & initialized) {
      machineState = "play";
      clockState = ret[2];
      startTime(ret[0], ret[1]);
    } else if ((machineState === "play") & initialized) {
      machineState = "pause";
    } else if (!initialized) {
      var workSec = parseInt($("#timeOfWork").html()) * 60;
      $(".cir2").trigger("configure", {
        min: 0,
        max: workSec,
        fgColor: "#FF0000"
      });
      clockState = "break";
      $("#message").text("Work");
      machineState = "play";
      startTime(workSec, workSec);
      initialized = true;
    }
  });

  // Recursive function which updates the clock and fills the circle
  function startTime(sec, totalSec) {
    if (machineState === "play") {
      // If there is time left on the clock
      if (sec > 0) {
        var minute = Math.floor(sec / 60);
        minute = addLeadZero(minute.toString());
        var second = addLeadZero(Math.floor(sec % 60));
        // Updates clock time and fills the circle
        $("#clock").html(minute + ":" + second);
        $(".cir2").val(totalSec - sec).trigger("change");

        // Recursive callback
        setTimeout(function() {
          startTime(sec - 1, totalSec);
        }, 1000);
      }
      // The time left on the clock has reached 00:00
      // Configures knob with the time of the corresponding time
      else {
        var workSec = parseInt($("#timeOfWork").html()) * 60;
        var breakSec = parseInt($("#timeOfBreak").html()) * 60;
        // If the work time has ended
        if (clockState === "work") {
          $(".cir2").trigger("configure", {
            min: 0,
            max: workSec,
            fgColor: "#FF0000"
          });
          clockState = "break";
          $("#message").text("Work");
          soundManager.play('mySound');
          // Callback the function for the Work time
          startTime(workSec, workSec);
        }
        // If the break time has ended
        else if (clockState === "break") {
          $(".cir2").trigger("configure", {
            min: 0,
            max: breakSec,
            fgColor: "#18CAE6"
          });
          clockState = "work";
          $("#message").text("Break");
          soundManager.play('mySound');
          // Callback the function for the Break time
          startTime(breakSec, breakSec);
        }
      }
    } else if (machineState === "pause") {
      ret = [sec, totalSec, clockState];
    }
  }

  // Add leading zero to values less than 10
  function addLeadZero(val) {
    if (val < 10) {
      val = "0" + val;
    }
    return val.toString();
  }

  // Resets the values of #message and initialized
  function initialize() {
    $(".cir2").val(0).trigger("change");
    $("#message").text("");
    initialized = false;
  }

    soundManager.onready(function() {
        soundManager.createSound({
            id: 'mySound',
            url: 'http://www.soundjay.com/button/sounds/button-29.mp3'
        });


    });
});
