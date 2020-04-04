// there are libraries to do this, but thery do not match this use case
// https://www.npmjs.com/package/parse-coords
// the library is used when parsing the whole line as lat, lon

const getSign = function(letter) {
    var l = letter.toUpperCase();
    if(l == 'S' || l == 'W') {
        return -1;
    } else {
        return 1;
    }
}

const parseCoord = function(str) {
    // there are many ways to write the coords:
    // 1. degrees, minutes, seconds and sings: -49°54"13'
    // 2. degrees, minutes, seconds and letters: 49°54"13'E
    // 3. degrees, minutes and sings: -49°54.124
    // 4. degrees, minutes and letters: 49°54.123'E
    // 5. decimals and letters: 49.15495° E
    // 6. decimals and signs: -49.15495° (this is the target format)
    // (7. degrees, minutes,.. but with spaces)
    str = str.trim();
    var match;

    // use regex to find the format:
    var f6 = new RegExp("^[+-]?\\d+.\\d+\\s*°?$");
    if(f6.test(str)) {
        return parseFloat(str.replace('°',''));
    }

    var f5 = new RegExp("^(\\d+.\\d+)\\s*°?\\s*(\\w)$");
    match = str.match(f5);
    if(match) {
        return match[1] * getSign(match[2]);
    }

    // the easy formats did not match - we have to do it "per partes"

    var sign = 1;
    // is there a plus or minus sign?
    var sre = new RegExp("^\\s?([+-])");
    match = str.match(sre);
    if(match) {
        // update the sign
        var sgn = match[1];
        if(sgn === '-') {
            sign = -1;
        }
    }

    // is there a letter?
    
    var lre = new RegExp("(\\w)\\s*$");
    match = str.match(lre);
    if(match) {
        // update the sign
        var letter = match[1];
        sign = getSign(letter);
    }

    var deg = 0;
    var min = 0;
    var sec = 0;

    // all parts present - formats 1 and 2 and 7
    // beware that the degrees, minutes, seconds signs can be replaced by spaces
    var f12 = new RegExp("(\\d+)\\s?°?\\s?(\\d+)\\s?['′]?\\s?(\\d+.?\\d*)\\s?[\"″]?");
    match = str.match(f12);
    if(match) {
        deg = parseInt(match[1]);
        min = parseInt(match[2]);
        sec = parseFloat(match[3]);
        return sign * (deg + (min / 60) + (sec/3600));
    }


    // all parts present - formats 3 and 4 and 7
    var f34 = new RegExp("(\\d+)\\s?°?\\s?(\\d+.?\\d*)\\s?[\'′]?");
    match = str.match(f34);
    if(match) {
        deg = parseInt(match[1]);
        min = parseFloat(match[2]);
        return sign * (deg + (min / 60));
    }
    return null;
}

const parseNumber = function(val) {
    val = val.replace('%', '');
    var num = parseFloat(val);
    if(Number.isNaN(num)) {
        return null;
    } else {
        return num;
    }
}

//https://www.geeksforgeeks.org/how-to-get-the-number-of-days-in-a-specified-month-using-javascript/
const getDaysInMonth = function(val) {
    var a = val.split('-');
    if(a.length != 2) {
        // this is not a valid date - should not happen
        throw('invalid mont identifier');
    }
    // the months in the constructor are indexed from 0, in the string from 0
    var d = new Date(parseInt(a[0]), parseInt(a[0]), 0);
    return d.getDate();
}

/*
The date-time or interval associated to the trait. Examples: 
1963-03-08T14:07-0600 (8 Mar 1963 at 2:07pm in the time zone six hours earlier than UTC). 
2009-02-20T08:40Z (20 February 2009 8:40am UTC). 
2018-08-29T15:19 (3:19pm local time on 29 August 2018). 
1809-02-12 (some time during 12 February 1809). 
1906-06 (some time in June 1906). 1971 (some time in the year 1971). 
2007-03-01T13:00:00Z/2008-05-11T15:30:00Z (some time during the interval between 1 March 2007 1pm UTC and 11 May 2008 3:30pm UTC). 
1900/1909 (some time during the interval between the beginning of the year 1900 and the end of the year 1909). 
2007-11-13/15 (some time in the interval between 13 November 2007 and 15 November 2007).
*/
const parseEvent = function(val) {
    // TODO implement the event parsing
    var start = null;
    var end = null;
    
    if(!val) {
        return {start, end};
    }

    var a  = val.split('/');

    if(!a[1]) {
        a.push(a[0]);
    }

    // only year is set
    if(a[0].length == 4) {
        a[0]+='-01-01';
    }
    // year and month is set
    if(a[0].length == 7) {
        a[0]+='-01';
    }

    // ISO-like format without seconds and miliseconds
    if(a[0].length == 21 && a[0][17] == '-') {
        a[0]=a[0].substr(0,17) + `:00.000` + a[0].substr(17);
    }

    // only year is set
    if(a[1].length == 4) {
        a[1]+='-12-31';
    }

    // ISO-like format without seconds and miliseconds
    if(a[1].length == 21 && a[1][17] == '-') {
        a[1]=a[1].substr(0,17) + `:00.000` + a[1].substr(17);
    }

    // year and month is set
    if(a[1].length == 7) {
        try {
            a[1]+=`-${getDaysInMonth(a[1])}T23:59:59.999`;
        } catch(e) {
            a[1] = null;
        }
    }

    if(a[1].length == 2) {
        a[1]=a[0].substr(0,8) + a[1];
    }

    if(a[1].length == 10) {
        a[1]=a[1] + 'T23:59:59.999Z';
    }


    var startnumval = Date.parse(a[0]);
    var endnumval = Date.parse(a[1]);
    if(!isNaN(startnumval)) {
        start = new Date(startnumval);
    }
    if(!isNaN(endnumval)) {
        end = new Date(endnumval);
    }

    return { start, end };
}

module.exports = {
    parseCoord,
    parseNumber,
    parseEvent
}