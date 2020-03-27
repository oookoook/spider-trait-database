export default [
    { 
      name: 'taxonomy.wscLsid',
      text: 'WSC LSID',
      //entity: 'taxonomy', 
      displayValue: (i) => i.taxonomy.wscLsid,
      save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.wscLsid = v; },
      isValid: (i, e) => !!i.taxonomy.id || 'Taxon must be assigned to the record',
      autocomplete: { endpoint: 'taxonomy', valueField: 'wsc.lsid' }
    },
    { 
      name: 'taxonomy.originalName',
      text: 'Original name',
      //entity: 'taxonomy', 
      displayValue: (i) => i.taxonomy.originalName,
      save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.originalName = v; }, 
      isValid: (i, e) => !!i.taxonomy.id || 'Taxon must be assigned to the record',
      autocomplete: { endpoint: 'taxonomy', valueField: 'taxonomy.originalName' }
    },
    { 
      name: 'trait.abbrev',
      text: 'Trait Abbrev.',
      entity: 'trait', 
      displayValue: (i) => i.trait.abbrev,
      save: (o, v) => {if(!o.trait) o.trait={}; o.trait.abbrev = v; }, 
      isValid: (i, e) => !!i.trait.id || (!e && !!i.trait.name && !!i.trait.description && !!i.trait.dataType) || (e === 'create' && !!i.trait.abbrev) || 'Trait Abbrev. must be set and the trait must exist.',
      autocomplete: { endpoint: 'traits', valueField: 'abbrev', textField: ['abbrev', 'name'] }
    },
    { 
      name: 'trait.name',
      text: 'Trait name',
      entity: 'trait', 
      displayValue: (i) => i.trait.name,
      save: (o, v) => {if(!o.trait) o.trait={}; o.trait.name = v; },
      isValid: (i, e) => {
        if(e === 'create') {
          return true;
        }
        if(i.method.id) {
          return true;
        }
        if(i.trait.abbrev && i.trait.name && !e) {
          return 'Do not provide Trait Name when Trait ID is set.'
        }
        if(!i.trait.abbrev && !i.trait.name) {
          return 'Provide Trait Name when Trait ID is not set.'
        }
        return true;
      }
    },
    { 
      name: 'trait.description',
      text: 'Trait description',
      entity: 'trait', 
      displayValue: (i) => i.trait.description,
      save: (o, v) => {if(!o.trait) o.trait={}; o.trait.description = v; }, 
      //foreignMatchValue: (i) => i.taxonomy.wscLsid,
      isValid: (i, e) => {
        if(e === 'create') {
          return true;
        }
        if(i.method.id) {
          return true;
        }
        if(i.trait.abbrev && i.trait.description && !e) {
          return 'Do not provide Trait Description when Trait ID is set.'
        }
        if(!i.trait.abbrev && !i.trait.description) {
          return 'Provide Trait Description when Trait ID is not set.'
        }
        return true;
      }
    },
    { 
      name: 'trait.dataType',
      text: 'Data type', 
      entity: 'trait',
      displayValue: (i) => i.trait.dataType.raw,
      save: (o, v) => {if(!o.trait) o.trait={}; if(!o.trait.dataType) o.trait.dataType = {}; o.trait.dataType.raw = v; }, 
      isValid: (i, e) => !!i.trait.dataType.id || 'Value does not match any existing data type',
      autocomplete: { endpoint: 'traits', valueField: 'dataType.name' }
    },
    { 
      name: 'trait.category',
      text: 'Trait category', 
      entity: 'trait',
      displayValue: (i) => i.trait.category.raw,
      save: (o, v) => {if(!o.trait) o.trait={}; if(!o.trait.category) o.trait.category = {}; o.trait.category.raw = v; }, 
      isValid: (i, e) => !!i.trait.id || !!i.trait.category.id || 'Value does not match any existing trait category',
      autocomplete: { endpoint: 'traits', valueField: 'category.name' }
    },
    { 
      name: 'method.abbrev',
      text: 'Method Abbrev.',
      entity: 'method', 
      displayValue: (i) => i.method.abbrev,
      save: (o, v) => {if(!o.method) o.method={}; o.method.abbrev = v; }, 
      isValid: (i, e) => !!i.method.id || (!e && (!!i.method.name || !!i.method.description)) 
      || (e === 'create' && !!i.method.abbrev) || (!i.method.name && !i.method.description) || 'Method Abbrev. must be set and the method must exist if any of the Method attributes is filled in.',
      autocomplete: { endpoint: 'methods', valueField: 'abbrev', textField: ['abbrev','name'] }
    },
    { 
      name: 'method.name',
      text: 'Method name',
      entity: 'method', 
      displayValue: (i) => i.method.name,
      save: (o, v) => {if(!o.method) o.method={}; o.method.name = v; }, 
      isValid: (i, e) => {
        if(e === 'create') {
          return true;
        }
        if(i.method.id) {
          return true;
        }
        if(i.method.abbrev && i.method.name && !e) {
          return 'Do not provide Method Name when Method ID is set.'
        }
        if(!i.method.abbrev && !i.method.name && !!i.method.description) {
          return 'Provide Method Name when Method description is set.'
        }
        return true;
      }
    },
    { 
      name: 'method.description',
      text: 'Method description',
      entity: 'method', 
      displayValue: (i) => i.method.description,
      save: (o, v) => {if(!o.method) o.method={}; o.method.description = v; },  
      isValid: (i, e) => {
        if(e === 'create') {
          return true;
        }
        if(i.method.id) {
          return true;
        }
        if(i.method.abbrev && i.method.description && !e) {
          return 'Do not provide Method Description when Method ID is set.'
        }
        if(!i.method.abbrev && i.method.name && !i.method.description) {
          return 'Provide Method Description when Method Name is set.'
        }
        return true;
      }
    },
    { 
      name: 'value',
      text: 'Value', 
      displayValue: (i) => i.value.numeric != null ? i.value.numeric : i.value.raw,
      save: (o, v) => {if(!o.value) o.value={}; o.value.raw = v; },  
      isValid: (i, e) => !i.value.requiresNumeric || i.value.numeric != null || "Value is not a valid number"
    },
    { 
      name: 'measure',
      text: 'Measure', 
      displayValue: (i) => i.measure.raw,
      save: (o, v) => {if(!o.measure) o.measure={}; o.measure.raw = v; },   
      isValid: (i, e) => !!i.measure.id || 'Value does not match any of the possible values',
      autocomplete: { endpoint: 'data', valueField: 'measure.name' }
    },
    { 
      name: 'sex',
      text: 'Sex', 
      displayValue: (i) => i.sex.raw,
      save: (o, v) => {if(!o.sex) o.sex={}; o.sex.raw = v; }, 
      isValid: (i, e) => !i.sex.raw || !!i.sex.id || 'Value does not match any of the possible values',
      autocomplete: { endpoint: 'data', valueField: 'sex.name' }
    },
    { 
      name: 'lifeStage',
      text: 'Life stage', 
      displayValue: (i) => i.lifeStage.raw,
      save: (o, v) => {if(!o.lifeStage) o.lifeStage={}; o.lifeStage.raw = v; }, 
      isValid: (i, e) => !i.lifeStage.raw || !!i.lifeStage.id || 'Value does not match any of the possible values',
      autocomplete: { endpoint: 'data', valueField: 'lifeStage.name' }
    },
    { 
      name: 'frequency',
      text: 'Frequency', 
      displayValue: (i) => i.frequency.numeric != null ? i.frequency.numeric : i.frequency.raw,
      save: (o, v) => {if(!o.frequency) o.frequency={}; o.frequency.raw = v; },  
      isValid: (i, e) => !i.frequency.raw || i.frequency.numeric != null || 'Value is not a valid number',
    },
    { 
      name: 'sampleSize',
      text: 'Sample size', 
      displayValue: (i) => i.sampleSize.numeric != null ? i.sampleSize.numeric : i.sampleSize.raw,
      save: (o, v) => {if(!o.sampleSize) o.sampleSize={}; o.sampleSize.raw = v; },   
      isValid: (i, e) => !i.sampleSize.raw || i.sampleSize.numeric != null || 'Value is not a valid number',
    },
    { 
      name: 'eventDate.text',
      text: 'Event Date', 
      displayValue: (i) => i.eventDate.text,
      save: (o, v) => {if(!o.eventDate) o.eventDate={}; o.eventDate.text = v; }, 
      isValid: (i, e) => true
    },
    /*
    { 
      name: 'eventDate.start',
      text: 'Event start', 
      displayValue: (i) => i.taxonomy.wscLsid, 
      foreignMatchValue: (i) => i.taxonomy.wscLsid,
      isValid: (i, e) => i.taxonomy.id || 'Taxon must be assigned to the record',
      autocomplete: { endpoint: 'taxonomy', valueField: 'country.code', textField: ['country.code', 'country.name'] }
    },
    { 
      name: 'eventDate.end',
      text: 'Event end', 
      displayValue: (i) => i.taxonomy.wscLsid, 
      foreignMatchValue: (i) => i.taxonomy.wscLsid,
      isValid: (i, e) => i.taxonomy.id || 'Taxon must be assigned to the record',
      autocomplete: { endpoint: 'taxonomy', valueField: 'country.code', textField: ['country.code', 'country.name'] }
    },
    */
    { 
      name: 'reference.fullCitation',
      text: 'Reference (Full)',
      entity: 'reference', 
      displayValue: (i) => i.reference.fullCitation,
      save: (o, v) => {if(!o.reference) o.reference={}; o.reference.fullCitation = v; },  
      isValid: (i, e) => !!i.reference.id || !!i.reference.fullCitation || 'Reference must be set',
      
    },
    { 
      name: 'reference.abbrev',
      text: 'Reference (Abbrev.)',
      entity: 'reference', 
      displayValue: (i) => i.reference.abbrev, 
      save: (o, v) => {if(!o.reference) o.reference={}; o.reference.abbrev = v; },  
      isValid: (i, e) => !!i.reference.id || (!e && !!i.reference.fullCitation) || e==='create' || 'Reference Abbrev. must be set and the reference must exist.',
      autocomplete: { endpoint: 'references', valueField: 'abbrev', textField: ['abbrev', 'fullCitation'] }
    },
    { 
      name: 'reference.doi',
      text: 'Reference DOI',
      entity: 'reference',
      save: (o, v) => {if(!o.reference) o.reference={}; o.reference.doi = v; },   
      displayValue: (i) => i.reference.doi, 
      isValid: (i, e) => true
    },
    { 
      name: 'location.abbrev',
      text: 'Location Abbrev.',
      entity: 'location', 
      displayValue: (i) => i.location.abbrev, 
      save: (o, v) => {if(!o.location) o.location={}; o.location.abbrev = v; },
      // the valid function checks if all the props of the location are null  
      isValid: (i, e) => !!i.location.id || !e || e==='create' || 
      Object.keys(i.location).reduce((total, k) => total && (i.location[k] == null || (i.location[k] != null && i.location[k].raw == null)), true) 
      || 'Location Abbrev. must be set',
      autocomplete: { endpoint: 'locations', valueField: 'abbrev', textField: ['abbrev', 'locality' ] }
    },
    { 
      name: 'location.lat',
      text: 'Latitude',
      entity: 'location', 
      displayValue: (i) => i.location.lat.raw,
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.lat) o.location.lat = {}; o.location.lat.raw = v; }, 
      isValid: (i, e) => !i.location.lat.raw || !!i.location.lat.conv || 'Value cannot be converted to a valid latitude.',
    },
    { 
      name: 'location.lon',
      text: 'Longitude',
      entity: 'location', 
      displayValue: (i) => i.location.lon.raw,
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.lon) o.location.lon = {}; o.location.lat.raw = v; }, 
      isValid: (i, e) => !i.location.lon.raw || !!i.location.lon.conv || 'Value cannot be converted to a valid longitude.',
    },
    { 
      name: 'location.precision',
      text: 'Coordinate precision',
      entity: 'location',  
      displayValue: (i) => i.location.precision.numeric != null ? i.location.precision.numeric : i.location.precision.raw,
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.precision) o.location.precision = {}; o.location.precision.raw = v; }, 
      isValid: (i, e) => !i.location.precision.raw || i.location.precision.numeric != null || 'Value is not a valid number',
    },
    { 
      name: 'location.altitude',
      text: 'Altitude', 
      entity: 'location', 
      displayValue: (i) => i.location.altitude.numeric != null ? i.location.altitude.numeric : i.location.altitude.raw, 
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.altitude) o.location.altitude = {}; o.location.altitude.raw = v; }, 
      isValid: (i, e) => !i.location.altitude.raw || i.location.altitude.numeric != null || 'Value is not a valid number',
    },
    { 
      name: 'location.locality',
      text: 'Locality', 
      entity: 'location',
      displayValue: (i) => i.location.locality,
      save: (o, v) => {if(!o.location) o.location={}; o.location.locality = v; },   
      isValid: (i, e) => true,
    },
    { 
      name: 'location.country',
      text: 'Country', 
      entity: 'location',
      displayValue: (i) => i.location.country.raw,
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.country) o.location.country = {}; o.location.country.raw = v; }, 
      isValid: (i, e) => !i.location.country.raw || !!i.location.country.id || 'Value does not match any existing code',
      autocomplete: { endpoint: 'locations', valueField: 'country.code', textField: ['country.code', 'country.name'] }
    },
    { 
      name: 'location.habitatGlobal',
      text: 'Global habitat', 
      entity: 'location',
      displayValue: (i) => i.location.habitatGlobal.raw, 
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.habitatGlobal) o.location.habitatGlobal = {}; o.location.habitatGlobal.raw = v; }, 
      isValid: (i, e) => !i.location.habitatGlobal.raw || !!i.location.habitatGlobal.id || 'Value does not match any of the possible values',
      autocomplete: { endpoint: 'locations', valueField: 'habitatGlobal.name' }
    },
    { 
      name: 'location.habitat',
      text: 'Habitat', 
      entity: 'location',
      displayValue: (i) => i.location.habitat,
      save: (o, v) => {if(!o.location) o.location={}; o.location.habitat = v; },    
      isValid: (i, e) => true,
    },
    { 
      name: 'location.microhabitat',
      text: 'Microhabitat', 
      entity: 'location',
      displayValue: (i) => i.location.microhabitat, 
      save: (o, v) => {if(!o.location) o.location={}; o.location.microhabitat = v; },   
      isValid: (i, e) => true,
    },
    { 
      name: 'location.stratum',
      text: 'Stratum', 
      entity: 'location',
      displayValue: (i) => i.location.stratum,
      save: (o, v) => {if(!o.location) o.location={}; o.location.stratum= v; },    
      isValid: (i, e) => true,
    },
    { 
      name: 'location.note',
      text: 'Note', 
      entity: 'location',
      displayValue: (i) => i.location.note, 
      save: (o, v) => {if(!o.location) o.location={}; o.location.note = v; },   
      isValid: (i, e) => true,
    },
    { 
      name: 'rowLink',
      text: 'Row link', 
      displayValue: (i) => i.rowLink,
      save: (o, v) => { o.rowLink = v; },    
      isValid: (i, e) => true,
    },
    
  
  ];