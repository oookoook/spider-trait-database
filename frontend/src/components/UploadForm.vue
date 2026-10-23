<template>
    <v-card tile>
      <v-card-title>Upload file
        <!--
        <v-spacer />
        <action-button icon="mdi-close" text="Close" @click="$emit('hide')" tooltip></action-button>
        -->
      </v-card-title>
      <v-card-text>
        <p>{{ description || `CSV and Excel files are supported. Maximum allowed file size is ${sizeLabel}.` }}</p>
        <v-form v-model="valid" ref="form">
          <v-file-input :rules="uploadRules" v-model="file" :accept="accept" :label="inputLabel" show-size></v-file-input>
        </v-form>
      </v-card-text>
    <v-card-actions>
      <action-button icon="mdi-close" @click="$emit('hide')" text="Hide" />
      <action-button icon="mdi-upload" @click="save" color="primary" text="Upload file" />
    </v-card-actions>
    </v-card>
</template>

<script>

import ActionButton from './ActionButton'

export default {
  name: 'UploadForm',
  components: {
    ActionButton
  },
  props: {
    accept: { type: String, default: '.xls,.xlsx,application/vnd.ms-excel,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    maxFileSize: { type: Number, default: 100 * 1024 * 1024 },
    description: { type: String, default: '' },
    inputLabel: { type: String, default: 'Dataset source file' }
  },
  data () {
    return {
      valid: false,
      file: null
    }
  },
  computed: {
    sizeLabel() { return `${this.maxFileSize / (1024 * 1024)} MiB`; },
    uploadRules() {
      return [value => !!value || 'You must provide a file to upload',
        value => !value || value.size <= this.maxFileSize || `File size must not exceed ${this.sizeLabel}`];
    }
  },
  watch: {
  },
  methods: {
    save() {
      this.$refs.form.validate();
      if(this.valid) {
        this.$emit('upload', this.file);
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
