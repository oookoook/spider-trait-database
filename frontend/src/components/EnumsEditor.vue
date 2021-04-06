<template>
  <v-card>
    <v-card-title>Enumerations</v-card-title>
    <v-card-subtitle>Enumerations can be edited here</v-card-subtitle>
    <v-card-text>
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="e in enums" :key="`${e.list}_col`">
        <list-provider :list="e.list" v-slot="i" :key="`${e.list}_lp`" :limit="1000" preload>
        <v-card>
            <v-card-title>{{ e.title }}</v-card-title>
        <v-list single-line :key="`${e.list}_list`">
          <v-list-item v-for="ei in i.items" :key="ei.id">
            <v-list-item-icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ ei.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <action-button tooltip icon="mdi-pencil" color="primary" text="Edit" @click="e.id = ei.id; e.create = false; e.edit = true;"/>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-actions>
            <action-button color="primary" icon="mdi-plus" @click="e.id=null; e.create = true; e.edit = true; "/>
        </v-card-actions>
        </v-card>
            <entity-provider
            :list="e.list"
            :id="e.id"
            :create="e.create"
            v-slot="epi"
            @update="e.edit = false; i.update()"
            @create="e.edit = false; i.update()"
            @remove="e.edit = false; i.update()">
        <v-bottom-sheet v-model="e.edit">
            <entity-dialog
                v-if="e.edit"
                :loading="epi.loading"
                :create="e.create"
                :item="epi.item"
                :entity-props="epi.entityProps"
                @save="epi.save"
                @remove="epi.remove"
                @cancel="e.edit = false"
            />
        </v-bottom-sheet>
        </entity-provider>

        </list-provider>
        
      </v-col>
    </v-row>

    <list-provider list="countries" v-slot="i">
    <countries-table class="mt-3" :items="i.items" 
    :loading="i.loading" 
    :total="i.total" 
    :autocomplete-items="i.autocompleteItems" 
    :autocomplete-loading="i.autocompleteLoading" 
    @update="i.update"
    @create="countries.id = null; countries.create = true; countries.edit = true;"
    @edit="(item) => {countries.id = item.id; countries.create = false; countries.edit = true;}" 
    @autocomplete="i.autocomplete" />
    <entity-provider
            list="countries"
            :id="countries.id"
            :create="countries.create"
            v-slot="epi"
            @update="countries.edit = false; i.update()"
            @create="countries.edit = false; i.update()"
            @remove="countries.edit = false; i.update()">
        <v-bottom-sheet v-model="countries.edit">
            <entity-dialog
                v-if="countries.edit"
                :loading="epi.loading"
                :create="countries.create"
                :item="epi.item"
                :entity-props="epi.entityProps"
                @save="epi.save"
                @remove="epi.remove"
                @cancel="countries.edit = false"
            />
        </v-bottom-sheet>
        </entity-provider>
    
    </list-provider>

    </v-card-text>
  </v-card>
</template>

<script>

import ActionButton from './ActionButton'
import ListProvider from './ListProvider'
import EntityProvider from './EntityProvider'
import EntityDialog from './EntityDialog'
import CountriesTable from './CountriesTable'

export default {
  name: 'enumsEditor',
  components: {
    ActionButton,
    ListProvider,
    EntityProvider,
    EntityDialog,
    CountriesTable
  },
  data() {
    return {
      enums: [
        {list: 'measures', title: 'Measures', edit: false, create: false, id: null, options: null}, 
        {list: 'lifeStages', title: 'Life Stages', edit: false, create: false, id: null, options: null},
        {list: 'sexes', title: 'Sexes', edit: false, create: false, id: null, options: null},
        {list: 'dataTypes', title: 'Data Types', edit: false, create: false, id: null, options: null},
        {list: 'traitCategories', title: 'Trait Categories', edit: false, create: false, id: null, options: null},
        //{list: 'countries', title: 'Countries'}
        ],
        countries: {
            edit: false,
            create: false,
            id: null
        }
    }
  }
}
</script>
<style scoped>

</style>
