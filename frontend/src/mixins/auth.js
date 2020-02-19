import { mapGetters } from 'vuex'

export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters(['loginUrl', 'user'])
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
            if(this.$route.path == '/login') {
                // redirect to the correct route from the url
                // fill in the user info
                this.$store.dispatch('getUserInfo').then(
                    () => this.$store.dispatch('notify', { error: false, text: `You were successully loged in as ${this.user.name}`}), 
                    () => this.$store.dispatch('notify', { error: true, text: `Unable to log you in.`}));
                var returnRoute = this.$route.query.returnRoute;
                this.$router.replace(returnRoute);
            } else {
                // stores the current route so the login link is updated
                this.$store.commit('lastRoute', {value: this.$route.path });
            }
        }
    }
}