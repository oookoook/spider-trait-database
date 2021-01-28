export default [
  { 
    name: 'valid.review',
    readOnly: true,
    text: 'Valid',
    show: (e) => e === false,
    displayValue: (i) => {
      return i.valid.review;
    },
    getIcon: (i) => i.valid.review ? 'mdi-check-outline' : 'mdi-close-outline',
    save: (o, v) => {},
    isValid: (i, e) => i.valid.review || 'Record is not valid',
  },
  { 
    name: 'valid.approve',
    readOnly: true,
    show: (e) => e === true,
    text: 'Valid',
    displayValue: (i) => {
      return i.valid.approve;
    },
    getIcon: (i) => i.valid.approve ? 'mdi-check-outline' : 'mdi-close-outline',
    save: (o, v) => {},
    isValid: (i, e) => i.valid.approve || 'Record is not valid',
  },
  { 
    name: 'valid.duplicate',
    readOnly: true,
    text: 'Duplicate',
    displayValue: (i) => {
      return i.valid.duplicate;
    },
    getIcon: (i) => i.valid.duplicate ? 'mdi-exclamation-thick' : 'mdi-check-outline',
    save: (o, v) => {},
    isValid: (i, e) => !i.valid.duplicate || 'Record is not valid',
  }, 
  {
      name: 'taxonomy.order',
      text: 'Order',
      entity: 'taxonomy',
      displayValue: (i) => i.taxonomy.order,
      save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.order = v; },
      isValid: (i, e) => !!i.taxonomy.id || (!e && !!i.taxonomy.order) || (e === 'create' && !!i.taxonomy.order) ||  (!i.taxonomy.taxon && !!i.taxonomy.lsid) || 'Taxon must be assigned to the record', 
      similar: { endpoint: 'taxonomy', valueField: 'order' }
  },
  {
    name: 'taxonomy.family',
    text: 'Family',
    entity: 'taxonomy',
    displayValue: (i) => i.taxonomy.family,
    save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.family = v; },
    isValid: (i, e) => !!i.taxonomy.id || (!e && !!i.taxonomy.family) || (e === 'create' && !!i.taxonomy.family) || (!i.taxonomy.taxon && !!i.taxonomy.lsid) || 'Taxon must be assigned to the record', 
    similar: { endpoint: 'taxonomy', valueField: 'family' }
  },
  {
    name: 'taxonomy.taxon',
    text: 'Taxon',
    entity: 'taxonomy',
    displayValue: (i) => i.taxonomy.taxon,
    save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.taxon = v; },
    isValid: (i, e) => !!i.taxonomy.id || (!e && !!i.taxonomy.taxon) || (e === 'create' && !!i.taxonomy.taxon) || (!i.taxonomy.taxon && !!i.taxonomy.lsid) || 'Taxon must be assigned to the record', 
    similar: { endpoint: 'taxonomy', valueField: 'fullName' }
  },
  /*
  {
    name: 'taxonomy.genus',
    text: 'Genus',
    entity: 'taxonomy',
    displayValue: (i) => i.taxonomy.genus,
    save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.genus = v; },
    isValid: (i, e) => true, 
    similar: { endpoint: 'taxonomy', valueField: 'genus' }
  },
  {
    name: 'taxonomy.species',
    text: 'Species',
    entity: 'taxonomy',
    displayValue: (i) => i.taxonomy.species,
    save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.species = v; },
    isValid: (i, e) => true, 
    similar: { endpoint: 'taxonomy', valueField: 'species' }
  },
  {
    name: 'taxonomy.subspecies',
    text: 'Subspecies',
    entity: 'taxonomy',
    displayValue: (i) => i.taxonomy.subspecies,
    save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.subspecies = v; },
    isValid: (i, e) => true, 
    similar: { endpoint: 'taxonomy', valueField: 'subspecies' }
  },
  */
  { 
      name: 'taxonomy.lsid',
      text: 'WSC LSID',
      //entity: 'taxonomy', 
      displayValue: (i) => i.taxonomy.lsid,
      save: (o, v) => {if(!o.taxonomy) o.taxonomy={}; o.taxonomy.lsid = v; },
      isValid: (i, e) => !!i.taxonomy.id || !!i.taxonomy.taxon || 'Taxon must be assigned to the record',
      autocomplete: { endpoint: 'taxonomy', valueField: 'lsid' }
    },
    { 
      name: 'originalName',
      text: 'Original name',
      displayValue: (i) => i.originalName, 
      save: (o, v) => { o.originalName = v; }, 
      isValid: (i, e) => !!i.taxonomy.id || !!i.taxonomy.taxon || 'Taxon must be assigned to the record',
      autocomplete: { endpoint: 'taxonomy', valueField: 'fullName' }
    },
    // TODO test validation  for the WSC-based taxons
    { 
      name: 'taxonomy.fullName',
      text: 'Assigned name',
      //entity: 'taxonomy', 
      displayValue: (i) => {
        if(i.taxonomy.fullName) {
          return i.taxonomy.fullName;
        }

        if(!!i.taxonomy.order && !!i.taxonomy.family && !i.taxonomy.id) {
          return 'Taxon not created';
        }

        if(!i.taxonomy.lsid && !i.taxonomy.originalName && !i.taxonomy.order && !i.taxonomy.family) {
          return 'No taxonomic information available';
        }
        
        if (!!i.taxonomy.lsid && !!i.taxonomy.originalName && !i.taxonomy.id) {
          return 'LSID and Original name do not refer to the same WSC taxon';
        }
        if(!!i.taxonomy.originalName && !i.taxonomy.lsid && !i.taxonomy.id) {
          return 'Unknown original name';
        }
        if(!!i.taxonomy.lsid && !i.taxonomy.id) {
          return 'Unknown WSC LSID';
        }
        // taxon is not created
        return 'Unknown error';
      },
      readOnly: true,
      isValid: (i, e) => {
        if(i.taxonomy.id) {
          return true;
        }

        if(!e && !!i.taxonomy.order && !!i.taxonomy.family) {
          // pass record with at least order and family as valid if not an editor
          return true;
        }
        
        if(e && !!i.taxonomy.order && !!i.taxonomy.family) {  
          return 'Taxon not created';
        }

        if(!i.taxonomy.lsid && !i.taxonomy.originalName && !i.taxonomy.order && !i.taxonomy.family) {
          return 'No taxonomic information available. Provide either WCS LSID, orginal name, or full taxonomic categorization (order, family,...]';
        }
        
        if (!!i.taxonomy.lsid && !!i.taxonomy.originalName && !i.taxonomy.id) {
          return 'LSID and Original name do not refer to the same WSC taxon';
        }
        if(!!i.taxonomy.originalName && !i.taxonomy.lsid && !i.taxonomy.id) {
          return 'Unknown original name';
        }

        return 'Unknown error';
      },
    },
    { 
      name: 'trait.abbrev',
      text: 'Trait Abbrev.',
      entity: 'trait', 
      displayValue: (i) => i.trait.abbrev,
      save: (o, v) => {if(!o.trait) o.trait={}; o.trait.abbrev = v; }, 
      isValid: (i, e) => !!i.trait.id || (!e && !!i.trait.name && !!i.trait.description && !!i.trait.dataType) || (e === 'create' && !!i.trait.abbrev) || 'Trait Abbrev. must be set and the trait must exist',
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
          return 'Do not provide Trait Name when Trait ID is set'
        }
        if(!i.trait.abbrev && !i.trait.name) {
          return 'Provide Trait Name when Trait ID is not set'
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
      isValid: (i, e) => {
        if(e === 'create') {
          return true;
        }
        if(i.method.id) {
          return true;
        }
        if(i.trait.abbrev && i.trait.description && !e) {
          return 'Do not provide Trait Description when Trait ID is set'
        }
        if(!i.trait.abbrev && !i.trait.description) {
          return 'Provide Trait Description when Trait ID is not set'
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
      isValid: (i, e) => {
        if(i.method.id) {
          return true;
        }
        if(!e) {
          // contributor messages
          if(i.method.name && i.method.description && !i.method.abbrev) {
            // new method - only name and description are filled in
            return true;
          }
          if(i.method.abbrev && !i.method.id) {
            return "Do not fill in the method abbrev if the method does not exist. Either select an existing method or fill in the method name and description. The method abbrev will be assigned by an editor during the review.";
          }
        }
        if(e === 'create' && i.method.abbrev) {
          return true;
        }
        if(!i.method.name && !i.method.description) {
          return true;
        }
        return 'Method Abbrev. must be set and the method must exist if any of the Method attributes are filled in';
      },
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
          return 'Do not provide Method Name when Method Abbrev. is set'
        }
        if(!i.method.abbrev && !i.method.name && !!i.method.description) {
          return 'Provide Method Name when Method description is set'
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
          return 'Do not provide Method Description when Method Abbrev. is set'
        }
        if(!i.method.abbrev && i.method.name && !i.method.description) {
          return 'Provide Method Description when Method Name is set'
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
      name: 'treatment',
      text: 'Treatment', 
      displayValue: (i) => i.treatment, 
      save: (o, v) => { o.treatment = v; },   
      isValid: (i, e) => true,
    },
    { 
      name: 'eventDate.text',
      text: 'Date', 
      displayValue: (i) => i.eventDate.text,
      save: (o, v) => {if(!o.eventDate) o.eventDate={}; o.eventDate.text = v; }, 
      isValid: (i, e) => !i.eventDate.text || (!!i.eventDate.start && !!i.eventDate.end) || 'If date is provided, it must be in a valid format' 
    },
    { 
      name: 'reference.fullCitation',
      text: 'Reference (Full)',
      entity: 'reference', 
      displayValue: (i) => i.reference.fullCitation,
      save: (o, v) => {if(!o.reference) o.reference={}; o.reference.fullCitation = v; },  
      isValid: (i, e) => !!i.reference.id || !!i.reference.fullCitation || 'Reference must be set',
      similar: { endpoint: 'references', valueField: 'fullCitation', textField: 'fullCitation' }
    },
    { 
      name: 'reference.abbrev',
      text: 'Reference (Abbrev.)',
      entity: 'reference', 
      displayValue: (i) => i.reference.abbrev, 
      save: (o, v) => {if(!o.reference) o.reference={}; o.reference.abbrev = v; },  
      isValid: (i, e) => !!i.reference.id || (!e && !!i.reference.fullCitation) || e==='create' || 'Reference Abbrev. must be set and the reference must exist',
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
      Object.keys(i.location).every(k => i.location[k] == null 
      || (i.location[k] != null && k == 'coords' && i.location.coords.lat.raw == null && i.location.coords.lon.raw == null)
      || (i.location[k] != null && k != 'coords' && i.location[k].raw == null)) 
      || 'Location Abbrev. must be set',
      autocomplete: { endpoint: 'locations', valueField: 'abbrev', textField: ['abbrev', 'locality' ] }
    },
    { 
      name: 'location.coords.lat',
      text: 'Latitude',
      entity: 'location', 
      displayValue: (i) => i.location.coords.lat.raw,
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.coords) o.location.coords = {}; if(!o.location.coords.lat) o.location.coords.lat = {}; o.location.coords.lat.raw = v; }, 
      isValid: (i, e) => (!i.location.coords.lat.raw && !i.location.coords.lon.raw) || !!i.location.coords.lat.conv || 'Value cannot be converted to a valid latitude',
    },
    { 
      name: 'location.coords.lon',
      text: 'Longitude',
      entity: 'location', 
      displayValue: (i) => i.location.coords.lon.raw,
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.coords) o.location.coords = {}; if(!o.location.coords.lon) o.location.lon = {}; o.location.coords.lon.raw = v; }, 
      isValid: (i, e) => (!i.location.coords.lon.raw && !i.location.coords.lat.raw) || !!i.location.coords.lon.conv || 'Value cannot be converted to a valid longitude',
    },
    /*
    { 
      name: 'location.coords.precision',
      text: 'Coordinate precision',
      entity: 'location',  
      displayValue: (i) => i.location.coords.precision.numeric != null ? i.location.coords.precision.numeric : i.location.coords.precision.raw,
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.coords) o.location.coords = {}; if(!o.location.coords.precision) o.location.coords.precision = {}; o.location.coords.precision.raw = v; }, 
      isValid: (i, e) => !i.location.coords.precision.raw || i.location.coords.precision.numeric != null || 'Value is not a valid number',
    },
    */
    { 
      name: 'altitude',
      text: 'Altitude', 
      displayValue: (i) => i.altitude.numeric != null ? i.altitude.numeric : i.altitude.raw, 
      save: (o, v) => { if(!o.altitude) o.altitude = {}; o.altitude.raw = v; }, 
      isValid: (i, e) => !i.altitude.raw || i.altitude.numeric != null || 'Value is not a valid number',
    },
    { 
      name: 'locality',
      text: 'Locality', 
      displayValue: (i) => i.locality,
      save: (o, v) => { o.locality = v; },   
      isValid: (i, e) => true,
    },
    { 
      name: 'country',
      text: 'Country', 
      displayValue: (i) => i.country.raw,
      save: (o, v) => { if(!o.country) o.country = {}; o.country.raw = v; }, 
      isValid: (i, e) => !i.country.raw || !!i.country.id || 'Value does not match any existing country code',
      autocomplete: { endpoint: 'countries', valueField: 'code', textField: ['code', 'name'] }
    },
    /*
    { 
      name: 'location.habitatGlobal',
      text: 'Global habitat', 
      entity: 'location',
      displayValue: (i) => i.location.habitatGlobal.raw, 
      save: (o, v) => {if(!o.location) o.location={}; if(!o.location.habitatGlobal) o.location.habitatGlobal = {}; o.location.habitatGlobal.raw = v; }, 
      isValid: (i, e) => !i.location.habitatGlobal.raw || !!i.location.habitatGlobal.id || 'Value does not match any of the possible values',
      autocomplete: { endpoint: 'locations', valueField: 'habitatGlobal.name' }
    },
    */
    { 
      name: 'habitat',
      text: 'Habitat', 
      displayValue: (i) => i.habitat,
      save: (o, v) => { o.habitat = v; },    
      isValid: (i, e) => true,
    },
    { 
      name: 'microhabitat',
      text: 'Microhabitat', 
      displayValue: (i) => i.microhabitat, 
      save: (o, v) => { o.microhabitat = v; },   
      isValid: (i, e) => true,
    },
    /*
    { 
      name: 'location.stratum',
      text: 'Stratum', 
      entity: 'location',
      displayValue: (i) => i.location.stratum,
      save: (o, v) => {if(!o.location) o.location={}; o.location.stratum= v; },    
      isValid: (i, e) => true,
    },
    */
    { 
      name: 'note',
      text: 'Note', 
      displayValue: (i) => i.note, 
      save: (o, v) => { o.note = v; },   
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