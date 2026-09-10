<template>
  <v-card>
    <v-card-title>Orders assigned to {{ entity.abbrev }}</v-card-title>
    <v-card-subtitle>{{ entity.name }}</v-card-subtitle>
    <v-card-text>
      <list-provider list="orders" v-slot="i" :limit="1000" preload>
        <v-list dense>
          <v-list-item v-for="o in i.items" :key="o.id" @click="toggle(o.id)">
            <v-list-item-action>
              <v-checkbox :input-value="isAssigned(o.id)" :disabled="loading" readonly hide-details />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ o.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </list-provider>
    </v-card-text>
    <v-card-actions>
      <action-button text="Cancel" icon="mdi-cancel" @click="$emit('cancel')" />
      <action-button text="Save" color="primary" :loading="saving" :disabled="loading" icon="mdi-check" @click="save" />
    </v-card-actions>
  </v-card>
</template>

<script>

import ActionButton from './ActionButton'
import ListProvider from './ListProvider'

export default {
  name: 'OrderAssignmentsEditor',
  components: {
    ActionButton,
    ListProvider
  },
  props: { list: { type: String, required: true }, entity: { type: Object, required: true } },
  data () {
    return {
      assigned: [],
      loading: false,
      saving: false
    }
  },
  methods: {
    isAssigned(id) {
      return this.assigned.includes(id);
    },
    toggle(id) {
      if(this.loading) {
        return;
      }
      if(this.isAssigned(id)) {
        this.assigned = this.assigned.filter(o => o !== id);
      } else {
        this.assigned = this.assigned.concat([id]);
      }
    },
    load() {
      this.loading = true;
      this.$store.dispatch(`${this.list}/getOrderAssignments`, { id: this.entity.id })
        .then((data) => {
          this.assigned = data || [];
          this.loading = false;
        });
    },
    save() {
      this.saving = true;
      this.$store.dispatch(`${this.list}/updateOrderAssignment`, { id: this.entity.id, orders: this.assigned })
        .then(() => {
          this.saving = false;
          this.$emit('saved');
        });
    }
  },
  created () {
    this.load();
  }
}
</script>
<style scoped>

</style>
