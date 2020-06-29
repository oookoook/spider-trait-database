const props = {
  datasets: [
    {
      name: 'name',
      label: 'Name',
      isValid: (v) => !!v || 'Name is required'
    },
    {
      name: 'uploader',
      label: 'Uploader',
      isValid: (v) => !!v || 'Uploader is required'
    },
    {
      name: 'email',
      label: 'Uploader\'s e-mail',
      isValid: (v) => !!v || 'E-mail is required'
    },
    {
      name: 'authors',
      label: 'Author(s)',
      isValid: (v) => true
    },
    {
      name: 'authorsEmail',
      label: 'Author\'s e-mail',
      isValid: (v) => true
    },

],
  traits: [
    {
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'Abbreviation must be unique.',
      isValid: (v) => !!v || 'Abbreviation is required'
    },
    {
      name: 'name',
      label: 'Name',
      isValid: (v) => !!v || 'Name is required'
    },
    {
      name: 'description',
      label: 'Description',
      isValid: (v) => !!v || 'Description is required'
    },
    {
      name: 'category',
      label: 'Category',
      isValid: (v) => !!v || 'Category is required',
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
      isValid: (v) => true
    },
    {
      name: 'reference',
      label: 'Reference',
      isValid: (v) => true,
      autocomplete: {
        endpoint: 'references',
        valueField: 'id',
        textField: 'fullCitation'
      }
    }
  ],
  methods: [{
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'Abbreviation must be unique.',
      isValid: (v) => !!v || 'Abbreviation is required'
    },
    {
      name: 'name',
      label: 'Name',
      isValid: (v) => !!v || 'Name is required'
    },
    {
      name: 'description',
      label: 'Description',
      isValid: (v) => !!v || 'Description is required'
    },
    {
      name: 'reference',
      label: 'Reference',
      isValid: (v) => true,
      autocomplete: {
        endpoint: 'references',
        valueField: 'id',
        textField: 'fullCitation'
      }
    }
  ],
  references: [{
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'Abbreviation must be unique.',
      isValid: (v) => !!v || 'Abbreviation is required'
    },
    {
      name: 'fullCitation',
      label: 'Full citation',
      isValid: (v) => !!v || 'Full citation is required'
    },
    {
      name: 'doi',
      label: 'DOI',
      isValid: (v) => true
    }
  ],
  locations: [{
      name: 'abbrev',
      label: 'Abbreviation',
      hint: 'A uniqe ID will be appended to the entered name.',
      isValid: (v) => !!v || 'Abbreviation is required'
    },
    {
      name: 'lat',
      parent: 'coords',
      label: 'Latitude',
      hint: 'Enter the value in the decimal format (e.g. 49.12345)',
      isValid: (v) => !v || !Number.isNaN(parseFloat(v)) || 'Value cannot be converted to a valid latitude.',
    },
    {
      name: 'lon',
      parent: 'coords',
      label: 'Longitude',
      hint: 'Enter the value in the decimal format (e.g. 16.12345)',
      isValid: (v) => !v || !Number.isNaN(parseFloat(v)) || 'Value cannot be converted to a valid longitude.',
    },
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
  ],
  countries: [
    {
        name: 'name',
        label: 'Name',
        isValid: (v) => !!v || 'Name is required'
    },
    {
        name: 'code',
        label: 'Code (3 letters)',
        isValid: (v) => !!v || 'Code (3 letters) is required'
    },
    {
        name: 'codeAlpha2',
        label: 'Code (2 letters)',
        isValid: (v) => !!v || 'Code (2 letters) is required'
    }
  ],
  measures: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required'
  }],
  lifeStages: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required'
  }],
  sexes: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required'
  }],
  dataTypes: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required'
  }],
  traitCategories: [{
    name: 'name',
    label: 'Name',
    isValid: (v) => !!v || 'Name is required'
  }],
}

export default (endpoint) => {
  return props[endpoint];
}
