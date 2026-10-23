<template>
    <v-card tile :loading="loading" :style="style">
      <v-card-title>{{ actionText }}
        <!--
        <v-spacer />
        <action-button icon="mdi-close" text="Close" @click="$emit('hide')" tooltip></action-button>
        -->
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" v-if="dataset" ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="dataset.order"
                :items="$store.state.orders.list"
                item-text="name"
                item-value="id"
                label="Order"
                :loading="ordersLoading"
                prepend-icon="mdi-format-list-bulleted-type"
                :rules="orderRules"
                :readonly="!create"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
          <v-text-field
            v-model="dataset.name"
            :rules="nameRules"
            :counter="255"
            label="Dataset name"
            prepend-icon="mdi-table-search"
            :suffix="dataset.suffix"
            :readonly="!!dataset.doi"
            required
          ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
          <v-text-field
            v-model="dataset.uploader"
            :counter="255"
            label="Uploader name"
            :rules="uploaderRules"
            prepend-icon="mdi-account-outline"
            required
          ></v-text-field>
          </v-col>
            <v-col cols="12" md="6">
          <v-text-field
            v-model="dataset.email"
            :rules="emailRules"
            label="Uploader e-mail"
            prepend-icon="mdi-at"
            required
          ></v-text-field>
          </v-col>
          </v-row>
          <v-text-field
            v-model="dataset.authorsEmail"
            label="Author email(s)"
            :counter="255"
            prepend-icon="mdi-at"
            :rules="aemailRules"
          ></v-text-field>
          <!--<v-text-field
            v-model="dataset.authors"
            :counter="4096"
            label="Authors"
            :rules="authorsRules"
            prepend-icon="mdi-table-edit"
            :readonly="!!dataset.doi"
          ></v-text-field>
          -->
          <dataset-authors-editor v-model="dataset.authors" :readonly="!!dataset.doi" />
          <!--
          <v-text-field
            v-model="dataset.orcid"
            label="First author ORCID"
            prepend-icon="mdi-account-search-outline"
            :rules="orcidRules"
            :readonly="!!dataset.doi"
          ></v-text-field>
          
          <v-text-field
            v-model="dataset.doi"
            label="Dataset DOI"
            readonly
            prepend-icon="mdi-protocol"
          ></v-text-field>
          -->
          <v-switch v-model="dataset.restricted" label="Restricted access" />
          <v-textarea
            v-model="dataset.notes"
            label="Notes"
            rows="5"
            prepend-icon="mdi-note-text-outline"
        ></v-textarea>
          
        </v-form>
      </v-card-text>
    <v-card-actions>
      <action-button icon="mdi-close" @click="$emit('hide')" text="Hide" />
      <action-button icon="mdi-table-plus" @click="save" color="primary" :text="actionText" />
    </v-card-actions>
    </v-card>
</template>

<script>

import ActionButton from './ActionButton'
import DatasetAuthorsEditor from './DatasetAuthorsEditor.vue'

export default {
  name: 'DatasetForm',
  components: {
    ActionButton,
    DatasetAuthorsEditor
  },
  props: { value: Object, loading: Boolean, create: Boolean },
  data () {
    return {
      dataset: Object.assign({}, this.value || {}),
      valid: false,
      ordersLoading: false,
      orderRules: [
        v => !!v || 'Order is required'
      ],
      nameRules: [
        v => !!v || 'Dataset Name is required',
        v => !v || v.length <= 240 || 'Name must be shorter than 240 characters'
      ],
      uploaderRules: [
        v => !!v || 'Uploader Name is required',
        v => !v || v.length <= 255 || 'Uploader name must be shorter than 255 characters'
      ],
      emailRules: [
        v => !!v || 'Uploader E-mail is required',
        v => /.+@.+/.test(v) || 'Uploader E-mail must be valid'
      ],
      authorsRules: [
        v => !v || v.length <= 4096 || 'Author name(s) must be less than 4096 characters'
      ],
      aemailRules: [
        v => !v || v.length <= 255 || 'Author email(s) must be less than 255 characters'
      ],
      orcidRules: [
        v => !!v || /$\d{4}-\d{4}-\d{4}-\d{4}^/.test(v) || 'This not a valid ORCID'
      ]
    }
  },
  computed: {
    actionText() {
      return this.create ? 'Create dataset' : 'Update dataset'
    },
    style() {
      console.debug('recomputing height to ', this.$vuetify.breakpoint.height - 150);
      return {
        'overflow-y': 'auto',
        'max-height': `${this.$vuetify.breakpoint.height - 150}px`
      }
    }
  },
  watch: {
    value(val) {
      this.dataset = Object.assign({}, val || {});
    }
  },
  methods: {
    save() {
      this.$refs.form.validate();
      if(this.valid) {
        console.log('save event called');
        this.$emit('input', this.dataset);
        this.$emit('save', this.dataset);
      } else {
        this.$store.dispatch('notify', {error: true, text: 'Please correct the invalid inputs before saving.'})
      }
    },
  },
  created () {
  },
  mounted () {
    if (!this.$store.state.orders.list.length) {
      this.ordersLoading = true;
      this.$store.dispatch('orders/list', { options: { page: 1, itemsPerPage: 100 } })
        .finally(() => { this.ordersLoading = false; });
    }
  }
}
</script>
<style scoped>

</style>
