var db = require('../util/db-client');

var getAbbrev = (val) => {
    val = val || '';
    var yearPos = val.search(/. \d\d\d\d./);
    return db.unique((val).substr(0, Math.min(yearPos > 0 ? yearPos + 6 : 50, 50)));
}


var refs = [
    `Elias DO, Hebets EA, Hoy RR & Mason AC. 2005. Seismic signals are crucial for male mating success in a visual specialist jumping spider (Araneae: Salticidae). Animal Behaviour 69(4): 931–938.`,
    `Preston-Mafham R. 1990. The Book of Spiders and Scorpions. London, Quantum Books.`,
    `Nentwig W. 1987. The prey of spiders. In Nentwig W (Ed.),  Ecophysiology of Spiders. Berlin, Springer-Verlag, pp. 249–263.`,
    `Norton R. 2006. How to train a cat to operate a light switch [Video file]. Http://www.youtube.com/watch?v=Vja83KLQXZs, accessed on 13.4.2020 v 11:06`,
    null
];

refs.forEach(r => console.log(getAbbrev(r)));

