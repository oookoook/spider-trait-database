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
            autocomplete: { endpoint: 'traits', valueField: 'category.name' }
        },
        {
            name: 'dataType',
            label: 'data type',
            isValid: (v) => !!v || 'Data type is required',
            autocomplete: { endpoint: 'traits', valueField: 'dataType.name' }
        },
        {
            name: 'standard',
            label: 'Unit',
            isValid: (v) => true
        },       
    ]
}

export default (endpoint) => {
    return props[endpoint];
}