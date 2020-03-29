

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
            return `https://wsc.nmbe.ch/${this.getCategory(item)}/${item.wsc.id}`;
        },
        getTaxon(item) {
            var t = [ item.genus, item.species];
            if(item.subspecies) {
              t.push(item.subspecies);
            }
            //console.dir(t);
            return t.join(' ');
          },
          getCategory(item) {
            if(item.species) return 'species';
            if(item.genus) return 'genus';
            if(item.family) return 'family';
          }
    }
}