coo = require('../util/converter');

/* Test coordinates:
degrees minutes seconds (DMS)	27° 43′ 31.796″ N 18° 1′ 27.484″ W
degrees decimal minutes	Ff	27° 43.529933333333′ N -18° 1.4580666666667′ W
decimal degrees	f	27.725499° N 18.024301° W
*/

//all coords should return the same value (or with sign):
// 27.725499 
// 18.024301
// no assert, sorry, can't be bothered

var c = ['27° 43′ 31.796″ N',`27° 43' 31.796" N`, `27°43'31.796"N`, `27 43 31.796 N`,
'- 27° 43′ 31.796″',` - 27° 43' 31.796" `, ` -27°43'31.796"`, `+27 43 31.796`,
'27° 43.529933333333′ N', ' - 27° 43.529933333333′',
'27.725499°', '27.725499', '27.725499 N',  '+27.725499', '-27.725499'
];


c.forEach(i => console.log(coo.parseCoord(i) + '\t' + i));

console.log(coo.parseNumber('hello'));
console.log(coo.parseNumber('147.5'));


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
console.dir(coo.parseEvent('1963-03-08T14:07-0600'));
console.dir(coo.parseEvent('1963-03-08T14:07:00.000-0600'));
console.dir(coo.parseEvent('2009-02-20T08:40Z'));
console.dir(coo.parseEvent('2018-08-29T15:19'));
console.dir(coo.parseEvent('1809-02-12'));
console.dir(coo.parseEvent('1906-06'));
console.dir(coo.parseEvent('1971'));
console.dir(coo.parseEvent('2007-03-01T13:00:00Z/2008-05-11T15:30:00Z'));
console.dir(coo.parseEvent('1900/1909'));
console.dir(coo.parseEvent('2007-11-13/15'));
console.dir(coo.parseEvent('2020-01'));
console.dir(coo.parseEvent('2020-01/2020-03'));
console.dir(coo.parseEvent('2020-01/xx'));
console.dir(coo.parseEvent('1906-xx'));
console.dir(coo.parseEvent('xx'));
console.dir(coo.parseEvent(null));
console.dir(coo.parseEvent('xxx-x--xx-'));



