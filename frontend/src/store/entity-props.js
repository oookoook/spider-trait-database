const props = {
  datasets: [
    {
      name: 'name',
      label: 'Name',
      isValid: (v) => !!v || 'Name is required',
      isReadonly: (item) => !!item.doi
    },
    {
      name: 'uploader',
      label: 'Uploader',
      isValid: (v) => !!v || 'Uploader is required',
      isReadonly: () => false
    },
    {
      name: 'email',
      label: 'Uploader\'s e-mail',
      isValid: (v) => !!v || 'E-mail is required',
      isReadonly: () => false
    },
    
    {
      name: 'authorsEmail',
      label: 'Author\'s e-mail',
      isValid: (v) => true,
      isReadonly: () => false
    },
    {
      name: 'doi',
      label: 'DOI',
      isValid: (v) => true,
      isReadonly: () => true
    },
    {
      name: 'restricted',
      switch: true,
      label: 'Restricted access',
      hint: 'Turn on if data are not public.',
      isValid: (v) => v !== null || 'Access restriction information is required',
      isReadonly: () => false
    },
    {
      name: 'notes',
      label: 'Notes',
      textarea: true,
      isValid: (v) => true,
      isReadonly: () => false,
      cols: 12
    },
    {
      name: 'authors',
      label: 'Author(s)',
      isValid: (v) => true,
      component: 'DatasetAuthorsEditor',
      isReadonly: (item) => !!item.doi,
      cols: 12
    },
],
  traits: [
    {
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'Abbreviation must be unique.',
      isValid: (v) => !!v || 'Abbreviation is required',
      isReadonly: () => false
    },
    {
      name: 'name',
      label: 'Name',
      isValid: (v) => !!v || 'Name is required',
      isReadonly: () => false
    },
    {
      name: 'description',
      label: 'Description',
      isValid: (v) => !!v || 'Description is required',
      isReadonly: () => false
    },
    {
      name: 'category',
      label: 'Category',
      isValid: (v) => !!v || 'Category is required',
      isReadonly: () => false,
      autocomplete: {
        endpoint: 'traitCategories',
        valueField: 'id',
        textField: 'name',
        showAll: true
      }
    },
    {
      name: 'dataType',
      label: 'Data type',
      isValid: (v) => !!v || 'Data type is required',
      isReadonly: () => false,
      autocomplete: {
        endpoint: 'dataTypes',
        valueField: 'id',
        textField: 'name',
        showAll: true
      }
    },
    {
      name: 'standard',
      label: 'Unit',
      isValid: (v) => true,
      isReadonly: () => false
    },
    {
      name: 'reference',
      label: 'Reference',
      isValid: (v) => true,
      autocomplete: {
        endpoint: 'references',
        valueField: 'id',
        textField: 'fullCitation'
      },
      isReadonly: () => false
    }
  ],
  methods: [{
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'Abbreviation must be unique.',
      isValid: (v) => !!v || 'Abbreviation is required',
      isReadonly: () => false
    },
    {
      name: 'name',
      label: 'Name',
      isValid: (v) => !!v || 'Name is required',
      isReadonly: () => false
    },
    {
      name: 'description',
      label: 'Description',
      isValid: (v) => !!v || 'Description is required',
      isReadonly: () => false
    },
    {
      name: 'reference',
      label: 'Reference',
      isValid: (v) => true,
      autocomplete: {
        endpoint: 'references',
        valueField: 'id',
        textField: 'fullCitation'
      },
      isReadonly: () => false
    }
  ],
  references: [{
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'Abbreviation must be unique.',
      isValid: (v) => !!v || 'Abbreviation is required',
      isReadonly: () => false
    },
    {
      name: 'fullCitation',
      label: 'Full citation',
      isValid: (v) => !!v || 'Full citation is required',
      isReadonly: () => false
    },
    {
      name: 'doi',
      label: 'DOI',
      isValid: (v) => true,
      isReadonly: () => false
    }
  ],
  locations: [{
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'A uniqe ID will be appended to the entered name.',
      isValid: (v) => !!v || 'Abbreviation is required',
      isReadonly: () => false
    },
    {
      name: 'lat',
      parent: 'coords',
      label: 'Latitude',
      hint: 'Enter the value in the decimal format (e.g. 49.12345)',
      isValid: (v) => !v || !Number.isNaN(parseFloat(v)) || 'Value cannot be converted to a valid latitude.',
      isReadonly: () => false
    },
    {
      name: 'lon',
      parent: 'coords',
      label: 'Longitude',
      hint: 'Enter the value in the decimal format (e.g. 16.12345)',
      isValid: (v) => !v || !Number.isNaN(parseFloat(v)) || 'Value cannot be converted to a valid longitude.',
      isReadonly: () => false
    },
    // everything below moved to the data record
    /*
    {
      name: 'altitude',
      label: 'Altitude',
      isValid: (v) => !v || !Number.isNaN(parseInteger(v)) || 'Value is not a valid number',
    },
    {
      name: 'locality',
      label: 'Locality',
      isValid: (v) => true
    },
    {
      name: 'country',
      label: 'Country',
      autocomplete: {
        endpoint: 'countries',
        valueField: 'id',
        textField: ['code', 'name']
      },
      isValid: (v) => true
    },
    {
      name: 'habitat',
      label: 'Habitat',
      isValid: (v) => true
    },
    {
      name: 'microhabitat',
      label: 'Microhabitat',
      isValid: (v) => true
    },
    */
  ],
  countries: [
    {
        name: 'name',
        label: 'Name',
        isValid: (v) => !!v || 'Name is required',
        isReadonly: () => false
    },
    {
        name: 'code',
        label: 'Code (3 letters)',
        isValid: (v) => !!v || 'Code (3 letters) is required',
        isReadonly: () => false
    },
    {
        name: 'codeAlpha2',
        label: 'Code (2 letters)',
        isValid: (v) => !!v || 'Code (2 letters) is required',
        isReadonly: () => false
    }
  ],
  measures: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required',
    isReadonly: () => false
  }],
  lifeStages: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required',
    isReadonly: () => false
  }],
  sexes: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required',
    isReadonly: () => false
  }],
  dataTypes: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required',
    isReadonly: () => false
  }],
  traitCategories: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required',
    isReadonly: () => false
  }],
  taxonomy: [
    {
      name: 'order',
      label: 'Order',
      isValid: (v) => !!v || 'Order is required',
      isReadonly: () => false
      
    },
    {
      name: 'family',
      label: 'Family',
      isValid: (v) => !!v || 'Family is required',
      isReadonly: () => false
    },
    {
      name: 'genus',
      label: 'Genus',
      isValid: (v) => true,
      isReadonly: () => false
    },
    {
      name: 'species',
      label: 'Species',
      isValid: (v) => true,
      isReadonly: () => false
    },
    {
      name: 'subspecies',
      label: 'Subspecies',
      isValid: (v) => true,
      isReadonly: () => false
    },
    {
      name: 'validTaxon',
      label: 'Valid taxon',
      isValid: (v) => true,
      autocomplete: {
        endpoint: 'taxonomy',
        valueField: 'id',
        textField: 'fullName'
      },
      isReadonly: () => false
    }
  ]
}

export default (endpoint) => {
  return props[endpoint];
}
