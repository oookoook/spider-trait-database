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
        getGMapsLink(coords) {
            return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`;
        }
    }
}