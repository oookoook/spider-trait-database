import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            id: null,
            entityCreate: false,
            entityEdit: false,
        }
    },
    computed: {
        currentPath() {
            return this.$route.path;
        },
        editDialog() {
            return this.isEditor && (this.entityCreate || this.entityEdit);
        },
        ...mapGetters(['isEditor'])
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
            if(p === 'new') {
                this.entityCreate = true;
            } else {
                this.id = parseInt(p);
            }
        },
        entityRefresh(id) {
            if(!this.id && this.entityCreate) {
                this.$router.push(this.currentPath.replace(/new$/, id));
            } else {
                this.$router.go(0);
            }
        },
        entityList(endpoint) {
            this.$router.push(`/${endpoint}`);
        }
    }
}