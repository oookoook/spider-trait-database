export default {
    computed: {
        currentOrder() {
            return this.$route.params.order || this.$store.state.editor.order || null;
        },
        orderDisplayName() {
            if (!this.currentOrder) return '';
            const found = this.$store.state.orders.list.find(
                (o) => o.id.toLowerCase() === this.currentOrder.toLowerCase()
            );
            return found ? found.name : (this.currentOrder.charAt(0).toUpperCase() + this.currentOrder.slice(1));
        }
    }
}
