<template>
    <v-card tile :loading="loading">
      <v-card-title>{{ actionText }}
        <!--
        <v-spacer />
        <action-button icon="mdi-close" text="Close" @click="$emit('hide')" tooltip></action-button>
        -->
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" v-if="dataset" ref="form">
          <v-row>
            <v-col cols="12" md="4">
          <v-text-field
            v-model="dataset.name"
            :rules="nameRules"
            :counter="240"
            label="Dataset name"
            prepend-icon="mdi-table-search"
            :suffix="dataset.suffix"
            hint="A uniqe ID will be appended to the entered name."
            required
          ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
          <v-text-field
            v-model="dataset.uploader"
            :counter="255"
            label="Uploader name"
            :rules="uploaderRules"
            prepend-icon="mdi-account-outline"
            required
          ></v-text-field>
          </v-col>
            <v-col cols="12" md="4">
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
            v-model="dataset.authors"
            :counter="4096"
            label="Authors"
            :rules="authorsRules"
            prepend-icon="mdi-table-edit"
          ></v-text-field>
          <v-text-field
            v-model="dataset.authorsEmail"
            label="Author email(s)"
            :counter="255"
            prepend-icon="mdi-at"
            :rules="aemailRules"
          ></v-text-field>
          <v-textarea
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

export default {
  name: 'DatasetForm',
  components: {
    ActionButton
  },
  props: { value: Object, loading: Boolean, create: Boolean },
  data () {
    return {
      dataset: Object.assign({}, this.value || {}),
      valid: false,
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
        v => !v || v.length <= 4096 || 'Authors must be less than 4096 characters'
      ],
      aemailRules: [
        v => !v || v.length <= 255 || 'Author email(s) must be less than 255 characters'
      ],
    }
  },
  computed: {
    actionText() {
      return this.create ? 'Create dataset' : 'Update dataset'
    },
  },
  watch: {
    value(val) {
      this.dataset = Object.assign({}, this.value || {});
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
    }

  },
  created () {

  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
