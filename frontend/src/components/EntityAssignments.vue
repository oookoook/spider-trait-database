<template>
  <v-card>
    <v-card-title>Assignments to orders</v-card-title>
    <v-card-subtitle>Assign traits and methods to spider orders</v-card-subtitle>
    <v-card-text>
    <v-row>
      <v-col cols="12" md="6">
        <list-provider list="traits" v-slot="i" :limit="1000" preload>
          <v-card>
            <v-card-title>Traits</v-card-title>
            <v-list>
              <v-list-item v-for="t in i.items" :key="t.id" @click="open('traits', t)">
                <v-list-item-icon>
                  <v-icon>mdi-comment-question-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ t.abbrev }}</v-list-item-title>
                  <v-list-item-subtitle>{{ t.name }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </list-provider>
      </v-col>
      <v-col cols="12" md="6">
        <list-provider list="methods" v-slot="i" :limit="1000" preload>
          <v-card>
            <v-card-title>Methods</v-card-title>
            <v-list>
              <v-list-item v-for="m in i.items" :key="m.id" @click="open('methods', m)">
                <v-list-item-icon>
                  <v-icon>mdi-chart-bell-curve</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ m.abbrev }}</v-list-item-title>
                  <v-list-item-subtitle>{{ m.name }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </list-provider>
      </v-col>
    </v-row>
    </v-card-text>

    <v-bottom-sheet v-model="editing">
      <order-assignments-editor
        v-if="editing"
        :list="selectedList"
        :entity="selectedEntity"
        @saved="editing = false"
        @cancel="editing = false"
      />
    </v-bottom-sheet>
  </v-card>
</template>

<script>

import ListProvider from './ListProvider'
import OrderAssignmentsEditor from './OrderAssignmentsEditor'

export default {
  name: 'entityAssignments',
  components: {
    ListProvider,
    OrderAssignmentsEditor
  },
  data() {
    return {
      editing: false,
      selectedList: null,
      selectedEntity: null
    }
  },
  methods: {
    open(list, entity) {
      this.selectedList = list;
      this.selectedEntity = entity;
      this.editing = true;
    }
  },
  created () {
    // traits/methods lists are order-scoped; clear it so all records across orders are shown here
    this.$store.commit('traits/setOrder', { value: null });
    this.$store.commit('methods/setOrder', { value: null });
  }
}
</script>
<style scoped>

</style>
