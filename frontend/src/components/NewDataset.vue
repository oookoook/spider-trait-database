<template>
    <v-card class="mb-3" :loading="loading">
      <v-card-title>Create new dataset
        <v-spacer />
        <action-button icon="mdi-close" text="Close" @click="$emit('hide')" tooltip></action-button>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-row>
            <v-col cols="12" md="4">
          <v-text-field
            v-model="dataset.name"
            :rules="nameRules"
            :counter="240"
            label="Dataset name"
            prepend-icon="mdi-table-search"
            :suffix="dataset.suffix"
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
            label="Authors email(s)"
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
      <v-btn text @click="$emit('hide')"><v-icon left>mdi-close</v-icon> Hide</v-btn>
      <v-btn text @click="reset"><v-icon left>mdi-eraser</v-icon> Clear</v-btn>
      <v-btn text @click="save"><v-icon color="primary" left>mdi-table-plus</v-icon> Create dataset</v-btn>
    </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ActionButton from './ActionButton'

export default {
  name: 'NewDataset',
  components: {
    ActionButton
  },
  props: [],
  data () {
    return {
      dataset: {
      },
      valid: false,
      loading: false,
      nameRules: [
        v => !!v || 'Dataset Name is required',
        v => !v || v.length <= 240 || 'Name must be less than 240 characters'
      ],
      uploaderRules: [
        v => !!v || 'Uploader Name is required',
        v => !v || v.length <= 255 || 'Name must be less than 255 characters'
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
    ...mapGetters(['user'])
  },
  watch: {

  },
  methods: {
    reset() {
      this.dataset = {};
      this.dataset.name = this.user.name.replace(' ', '').toLowerCase() + "_" + new Date().toISOString().substr(0,10);
      this.dataset.uploader = this.user.name;
      this.dataset.email = this.user.email;
      /*
      this.dataset.authors = '';
      this.dataset.authorsEmail = '';
      this.dataset.notes = '';
      */

    },
    save() {
      this.$refs.form.validate();
      if(this.valid) {
        this.loading = true;
        this.$store.dispatch('datasets/create', this.dataset)
        .then((id) => { this.loading= false; this.$router.push(`/prepare/${id}`); })
        .catch((err) => { 
          this.loading = false;
          this.$store.dispatch('notify', {error: true, text: `Unable to create the dataset: ${err}`}) 
          });
      } else {
        this.$store.dispatch('notify', {error: true, text: 'Please correct the invalid inputs before saving.'})
      }
    }

  },
  created () {

  },
  mounted () {
    this.reset();
  }
}
</script>
<style scoped>

</style>
