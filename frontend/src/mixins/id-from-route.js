export default {
    data() {
        return {
            id: null
        }
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
            this.id = parseInt(this.$route.params.id);
        }
    }
}