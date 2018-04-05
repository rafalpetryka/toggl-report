var TogglClient = require('toggl-api');

var token = process.argv.slice(2)[0];
var toggl = new TogglClient({ apiToken: token });
var startDate = process.argv.slice(2)[1] || '2017-07-01';
var numberOfHoursPerDay = 8;

toggl.getTimeEntries(new Date(startDate).toISOString(), new Date().toISOString(), (err, timeEntries) => {
    if(!err) {
        var dates = new Set(
            timeEntries.map((x) => {
                return x.start.slice(0,10)
            })
        );
        var actualTime = timeEntries.map((x) => {
            if(x.duration > 0) {
                return x.duration;
            } else {
                return 0;
            }
        }).reduce((a, b) => a + b, 0);
        var expectedTime = dates.size * numberOfHoursPerDay * 3600;
        var resultInSeconds = actualTime - expectedTime;
        var resultInMinutes = Math.floor((actualTime - expectedTime) / 60.0);
        let result;
        if(resultInSeconds < 0) {
            resultInMinutes = Math.abs(resultInMinutes);
            result = 'Ups, masz do nadrobienia ';
        } else {
            result = 'Jesteś do przodu ';
        }
        if(resultInMinutes > 59) {
            let hours = Math.floor(resultInMinutes / 60);
            let minutes = resultInMinutes - hours * 60;
            result += `${hours} ${pluralizeHours(hours)} i ${minutes} ${pluralizeMinutes(minutes)}`;
        } else {
            result += resultInMinutes + ' ' + pluralizeMinutes(resultInMinutes);
        }
        return console.log(result);
    } else {
        console.log(err);
    }
});

let pluralizeHours = (hours) => {
    if (hours === 1){
        return 'godzinę';
    } else if ((hours >= 2 && hours <= 4) || (hours > 20 && ["2", "3", "4"].includes(hours.toString().slice(-1)))) {
        return 'godziny';
    } else if ((hours >= 5 && hours <= 21) || hours === 0 || (hours > 20 && ["5", "6", "7", "8", "9", "0", "1"].includes(hours.toString().slice(-1)))) {
        return 'godzin';
    }
}

let pluralizeMinutes = (minutes) => {
    if (minutes === 1){
        return 'minutę';
    } else if ((minutes >= 2 && minutes <= 4) || (minutes > 20 && ["2", "3", "4"].includes(minutes.toString().slice(-1)))) {
        return 'minuty';
    } else if ((minutes >= 5 && minutes <= 21) || minutes === 0 || (minutes > 20 && ["5", "6", "7", "8", "9", "0", "1"].includes(minutes.toString().slice(-1)))) {
        return 'minut';
    }
}