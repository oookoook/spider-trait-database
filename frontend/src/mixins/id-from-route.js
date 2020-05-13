export default {
    data() {
        return {
            id: null
        }
    },
    computed: {
    },
    watch: {
        $route(to, from) {
            this.processRouteId();
        }
    },
    mounted() {
        this.processRouteId();
    },
    methods: {
        processRouteId() {
            var p = this.$route.params.id;
            if(!p) {
                return;
            }
            var n = parseInt(p);
            if(!Number.isNaN(n)) {
                this.id = n;
            } 
        }
    }
}