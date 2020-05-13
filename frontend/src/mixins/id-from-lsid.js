import { mapGetters } from 'vuex'

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
        this.processRouteLsid();
    },
    methods: {
        processRouteLsid() {
            var p = this.$route.params.lsid;
            if(!p) {
                return;
            }
            this.$store.dispatch('taxonomy/autocomplete', {query: { valueField: 'id', textField: 'lsid', search: p, count: 1}}).then((items) => {
                if(items.length == 0) {
                    this.$router.push('/taxonomy');
                } else {
                    this.$router.push(`/taxonomy/${items[0].value}`);   
                }
            });
        }
    }
}