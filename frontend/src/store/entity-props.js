const props = {
    traits: [
        {
            name: 'abbrev',
            label: 'Abbreviation',
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
            autocomplete: { endpoint: 'traitCategories', valueField: 'id', textField: 'name', showAll: true }
        },
        {
            name: 'dataType',
            label: 'Data type',
            isValid: (v) => !!v || 'Data type is required',
            autocomplete: { endpoint: 'dataTypes', valueField: 'id', textField: 'name', showAll: true }
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
            autocomplete: { endpoint: 'references', valueField: 'id', textField: 'fullCitation' }
        }       
    ]
}

export default (endpoint) => {
    return props[endpoint];
}