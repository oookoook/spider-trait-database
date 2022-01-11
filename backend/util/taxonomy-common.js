const getFullName = (r) => {
    if(!r.genus) {
        return r.family;
    }
    var t = [ r.genus ]
    if(r.species) {
        t.push(r.species);
    }
  
    if(r.subspecies) {
        t.push(r.subspecies);
    }
    
    if(t.length == 1) {
        t.push('sp.');
    }

    return t.join(' ');
}

module.exports = {
    getFullName
}