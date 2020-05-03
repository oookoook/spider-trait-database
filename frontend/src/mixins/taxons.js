

export default {
    data() {
        return {
        }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        getWscLink(item) {
            return `https://wsc.nmbe.ch/lsid/${item.lsid}`;
        },
        getTaxon(item) {
            if(!item.genus) {
              return item.family;
            }
            var t = [ item.genus ]
            if(item.species) {
              t.push(item.species);
            }
  
            if(item.subspecies) {
              t.push(item.subspecies);
            }

            if(t.length == 1) {
              t.push('sp.');
            }
            //console.dir(t);
            return t.join(' ');
          },
          getCategory(item) {
            if(item.species) return 'species';
            if(item.genus) return 'genus';
            if(item.family) return 'family';
            return 'species';
          }
    }
}