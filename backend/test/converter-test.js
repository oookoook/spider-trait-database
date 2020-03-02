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

