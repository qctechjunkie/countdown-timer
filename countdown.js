var normalFontColor = "#FFFFFF";
var normalBackgroundColor = "#000000";

var warningFontColor = "#FFFF00";
var warningBackgroundColor = "#000000";

var alertFontColor = "#FF0000";
var alertBackgroundColor = "#000000";


var expiredBlink  = false;
var blinkSwapped  = false; // True if blink state has colors swapped
// ..at the moment
var expiredCount  = false;

var timer         = 300;
var warningSwitch = 60
var alarmSwitch   = 30

var updateSeconds = 10;
var warningUpdate = 5;
var alarmUpdate   = 1;

function update() {
  display()
  var now = new Date()
  now = now.getTime()
  var left = target - now
  if (left > 0 || expiredBlink || expiredCount) {
    var nextUpdate = left % 1000
    if (nextUpdate == 0)
      nextUpdate = 1
    else if (nextUpdate < 0)
      nextUpdate = 1000
    setTimeout("update()", nextUpdate)
  }
}

function display() {
  var now = new Date();
  now = now.getTime();
  var left = target - now

  // Round to nearest second, being clever about negative numbers
  if ((left % 1000 + 1000) % 1000 < 500) {
    left = Math.floor(left / 1000);
  } else {
    left = Math.ceil(left / 1000);
  }

  if (left < 0 && !expiredCount) {
    left = 0;
  }

  // Round up to multiple of n
  var round = updateSeconds;

  if (left <= alarmSwitch) {
    round = alarmUpdate;
  } else if (left <= warningSwitch) {
      round = warningUpdate;
  }

  var rounded = Math.floor((left + round - 1) / round) * round;
  var minutes = Math.floor(rounded / 60);
  var seconds = rounded % 60;

  if (seconds < 0) {
    minutes += 1;
    seconds = -seconds;
    if (minutes == 0) {
      minutes = "-" + minutes;
    }
  }

  var sec = seconds;

  if (seconds < 10) {
    sec = "0" + seconds;
  }

  document.getElementById("countdown").innerHTML = minutes + ":" + sec;

  if (left <= 0 && expiredBlink) {
    // Blink every two seconds.  Blinking is done by swapping the
    // foreground and background colors.
    blinkSwapped = !blinkSwapped
    if (blinkSwapped) {
      document.body.style.color           = alertFontColor;
      document.body.style.backgroundColor = alertBackgroundColor;
    } else {
      document.body.style.color           = alertBackgroundColor;
      document.body.style.backgroundColor = alertFontColor;
    }

  } else if (left <= alarmSwitch) {
    document.body.style.color           = alertFontColor;
    document.body.style.backgroundColor = alertBackgroundColor;
  } else if (left <= warningSwitch) {
    document.body.style.color           = warningFontColor;
    document.body.style.backgroundColor = warningBackgroundColor;
  }

}

//
// Set up a dictionary that has all our default variables
//
var dictionary = [];

dictionary['normalBackgroundColor']   = normalBackgroundColor;
dictionary['normalFontColor']         = normalFontColor;
dictionary['warningBackgroundColor']  = warningBackgroundColor;
dictionary['warningFontColor']        = warningFontColor;
dictionary['alertBackgroundColor']    = alertBackgroundColor;
dictionary['alertFontColor']          = alertFontColor;

if (expiredBlink) {
  dictionary['expiredBlink'] = "true";
} else {
  dictionary['expiredBlink'] = "false";
}

if (expiredCount) {
  dictionary['expiredCount'] = "true";
} else {
  dictionary['expiredCount'] = "false";
}

dictionary['timerMinutes']  = Math.floor(timer / 60);
dictionary['timerSeconds']  = timer % 60;
dictionary['warningSwitch'] = warningSwitch;
dictionary['alarmSwitch']   = alarmSwitch;
dictionary['updateSeconds'] = updateSeconds;
dictionary['warningUpdate'] = warningUpdate;
dictionary['alarmUpdate']   = alarmUpdate;

//
// Parse name/value pairs from the URL.
//
// First, strip off the leading '?'
var searchString = decodeURIComponent(document.location.search);
searchString = searchString.substring(1);

var nvPairs = searchString.split("&");
// Now loop through the pairs, and extract what we want
for (i = 0; i < nvPairs.length; i++) {
    var nvPair = nvPairs[i].split("=");
    var name = nvPair[0];
    var value = nvPair[1];
    dictionary[name] = value;
}

normalFontColor       = dictionary['normalFontColor'];
normalBackgroundColor  = dictionary['normalBackgroundColor'];

warningFontColor      = dictionary['warningFontColor'];
warningBackgroundColor= dictionary['warningBackgroundColor'];

alertFontColor        = dictionary['alertFontColor'];
alertBackgroundColor  = dictionary['alertBackgroundColor'];


if (dictionary['expiredBlink'] == "true")
    expiredBlink = true
else
    expiredBlink = false
if (dictionary['expiredCount'] == "true")
    expiredCount = true
else
    expiredCount = false

timer         = +dictionary['timerMinutes'] * 60 + (+dictionary['timerSeconds'])
warningSwitch = +dictionary['warningSwitchMinutes'] * 60  + (+dictionary['warningSwitchSeconds'])
alarmSwitch   = +dictionary['alarmSwitchMinutes'] * 60  + (+dictionary['alarmSwitchSeconds'])
updateSeconds = +dictionary['updateSeconds']
warningUpdate = +dictionary['warningUpdate']
alarmUpdate   = +dictionary['alarmUpdate']


var now = new Date();
now = now.getTime()
var target = now + timer * 1000

document.body.style.color = normalFontColor
document.body.style.backgroundColor = normalBackgroundColor

setTimeout("update()", 1000)
display()
