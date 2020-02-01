export default {
    data() {
        return {
            id: null
        }
    },
    watch: {
        $route(to, from) {
            this.processRoute();
          }
    },
    mounted() {
        this.processRoute();
    },
    methods: {
        processRoute() {
            this.id = parseInt(this.$route.params.id);
        }
    }
}