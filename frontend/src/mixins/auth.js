import { mapGetters } from 'vuex'

export default {
    data() {
        return {
        }
    },
    computed: {
        role() {
            if(this.isAdmin) return 'Administrator';
            if(this.isEditor) return 'Editor';
            if(this.isContributor) return 'Contributor';
            return 'Reader';
        },
        ...mapGetters(['loginUrl', 'logoutUrl', 'user', 'lastRoute', 'isContributor', 'isEditor', 'isAdmin'])
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
                    () => this.$store.dispatch('notify', { error: false, text: `You were successfully logged in as ${this.user.name}. Your role is ${role}.`}), 
                    () => this.$store.dispatch('notify', { error: true, text: `Unable to log you in.`}));
                // should be stored in the local storage (vuex persistence)
                var returnRoute = this.lastRoute ? this.lastRoute : '/';
                this.$router.replace(returnRoute);
            } else if(this.$route.path == '/logout') {
                this.$store.dispatch('logout').then(
                    () => this.$store.dispatch('notify', { error: false, text: `You were successfully logged out.`}), 
                    () => this.$store.dispatch('notify', { error: true, text: `Unable to log you out.`}));
                // should be stored in the local storage (vuex persistence)
                var returnRoute = this.lastRoute ? this.lastRoute : '/';
                this.$router.replace(returnRoute);
            } else {
                // stores the current route to the store and to the local storage
                this.$store.commit('lastRoute', {value: this.$route.path });
                this.$store.dispatch('verifySession', {});
            }
        }
    }
}