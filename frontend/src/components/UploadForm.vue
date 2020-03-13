<template>
    <v-card tile>
      <v-card-title>Upload file
        <!--
        <v-spacer />
        <action-button icon="mdi-close" text="Close" @click="$emit('hide')" tooltip></action-button>
        -->
      </v-card-title>
      <v-card-text>
        <p>CSV and Excel files are supported. Maximum allowed file size is 100 MB.</p>
        <v-form v-model="valid" ref="form">
          <v-file-input :rules="uploadRules" v-model="file" accept=".xls,.xlsx,application/vnd.ms-excel,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" label="Dataset source file" show-size></v-file-input> 
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
  props: {},
  data () {
    return {
      valid: false,
      file: null,
      uploadRules: [ value => !!value || 'You must provide a file to upload', 
        value => !value || value.size < (100 * 1024 * 1024) || 'File size be less than 100 MB!' ],    
    }
  },
  computed: {
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
