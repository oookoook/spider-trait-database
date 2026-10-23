<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.abbrev }}</v-card-title>
      <v-card-subtitle><v-breadcrumbs class="px-0" :items="breadcrumbs"/></v-card-subtitle>
      <!-- <v-card-subtitle v-if="item">{{ item.doi }}</v-card-subtitle> -->
      <v-card-text v-if="item">
      {{ item.fullCitation }}
      </v-card-text>
        <v-list  v-if="item" three-line>
          <list-item v-if="item.doi" title="DOI" :text="item.doi" icon="mdi-id" link-tooltip="View the original paper" :link="getDOILink(item.doi)" />  
        </v-list>
        <div v-if="item && isLoggedIn" class="px-4 pb-3">
          <div class="subtitle-2 mb-1">PDF attachment</div>
          <v-progress-linear v-if="pdfLoading" indeterminate aria-label="Loading PDF attachment" />
          <v-alert v-if="pdfError" dense type="error">{{ pdfError }}</v-alert>
          <div v-if="pdf && !pdfLoading" class="d-flex flex-wrap align-center">
            <v-btn text color="primary" :href="pdfLink" rel="noopener" title="Download PDF"><v-icon left>mdi-file-pdf-box</v-icon><span class="text-truncate">{{ pdf.filename }}</span></v-btn>
            <span class="caption">{{ (pdf.sizeBytes / (1024 * 1024)).toFixed(2) }} MiB</span>
          </div>
          <span v-else-if="!pdfLoading && !pdfError" class="body-2">No PDF attached.</span>
          <div v-if="showUpdate" class="d-flex flex-wrap mt-2">
            <v-btn small text color="primary" :disabled="pdfBusy || pdfLoading" @click="showUpload = true"><v-icon left>mdi-upload</v-icon>{{ pdf ? 'Replace PDF' : 'Upload PDF' }}</v-btn>
            <v-btn v-if="pdf" small text color="error" :disabled="pdfBusy || pdfLoading" @click="showDelete = true"><v-icon left>mdi-delete</v-icon>Delete PDF</v-btn>
          </div>
          <v-progress-linear v-if="pdfBusy" indeterminate aria-label="Saving PDF attachment" />
        </div>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/order/${currentOrder}/reference/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
          <v-btn v-if="showUpdate" text color="warning" @click="$emit('edit')"><v-icon left>mdi-pencil-outline</v-icon>Edit</v-btn>
          <v-btn v-if="showUpdate" text color="error" @click="showReplace = true"><v-icon left>mdi-pencil-outline</v-icon>Replace &amp; delete</v-btn>
        </v-card-actions>
        <replace-reference-dialog v-model="showReplace" :item="item" @completed="replace"/>
        <v-bottom-sheet v-model="showUpload">
          <upload-form v-if="showUpload" accept=".pdf,application/pdf" :max-file-size="20 * 1024 * 1024" input-label="Reference PDF" description="PDF files only. Maximum size: 20 MiB." @upload="uploadPdf" @hide="showUpload = false" />
        </v-bottom-sheet>
        <v-bottom-sheet v-model="showDelete">
          <v-card><v-card-title>Delete PDF?</v-card-title><v-card-text>The attachment will be permanently removed.</v-card-text>
            <v-card-actions><v-btn text :disabled="pdfBusy" @click="showDelete = false">Cancel</v-btn><v-btn text color="error" :loading="pdfBusy" @click="deletePdf">Delete</v-btn></v-card-actions>
          </v-card>
        </v-bottom-sheet>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'
import ReplaceReferenceDialog from '../components/ReplaceReferenceDialog'
import UploadForm from '../components/UploadForm'

export default {
  name: 'ReferenceDetail',
  components: {
    ListItem,
    ReplaceReferenceDialog,
    UploadForm
  },
  props: { item: Object, loading: Boolean, showUpdate: Boolean, breadcrumbs: Array  },
  data () {
    return {
      showReplace: false,
      showUpload: false,
      showDelete: false,
      pdf: null,
      pdfLoading: false,
      pdfBusy: false,
      pdfError: '',
      pdfRequest: 0
    }
  },
  computed: {
    currentOrder() {
      return this.$store.state.references.order;
    },
    isLoggedIn() { return !!this.$store.getters.isLoggedIn; },
    pdfKey() { return this.isLoggedIn && this.item?.id ? this.item.id : null; },
    pdfLink() { return `${this.$store.getters.baseUrl}references/${this.pdfKey}/pdf`; }
  },
  watch: {
    pdfKey: {
      immediate: true,
      handler() { this.loadPdf(); }
    }
  },
  methods: {
    getDOILink(doi) {
      return doi.replace('doi:', 'https://doi.org/');
    },
    replace(id) {
      this.$router.push(`/${this.currentOrder}/references/${id}`);
    },
    async loadPdf() {
      const request = ++this.pdfRequest;
      this.showUpload = false;
      this.showDelete = false;
      this.pdf = null;
      this.pdfError = '';
      this.pdfLoading = !!this.pdfKey;
      if (!this.pdfKey) { this.showUpload = false; this.showDelete = false; return; }
      try {
        const result = await this.$store.dispatch('get', {endpoint: 'references', params: `${this.pdfKey}/pdf/metadata`, auth: true});
        if (request === this.pdfRequest) {
          if (result === false) this.pdfError = 'Unable to load PDF attachment.';
          else this.pdf = result.item;
        }
      } finally {
        if (request === this.pdfRequest) this.pdfLoading = false;
      }
    },
    async uploadPdf(file) {
      if (this.pdfBusy || !this.pdfKey) return;
      if (this.pdf && !window.confirm('Replace the existing PDF?')) return;
      const key = this.pdfKey;
      const request = this.pdfRequest;
      this.pdfBusy = true;
      this.pdfError = '';
      const body = new FormData();
      body.append('pdf', file);
      try {
        const result = await this.$store.dispatch('put', {endpoint: 'references', params: `${key}/pdf`, body, auth: true});
        if (key === this.pdfKey && request === this.pdfRequest) {
          if (result?.item) { this.showUpload = false; await this.loadPdf(); }
          else this.pdfError = 'Unable to upload PDF.';
        }
      } finally {
        this.pdfBusy = false;
      }
    },
    async deletePdf() {
      if (this.pdfBusy || !this.pdfKey) return;
      const key = this.pdfKey;
      const request = this.pdfRequest;
      this.pdfBusy = true;
      this.pdfError = '';
      try {
        const result = await this.$store.dispatch('delete', {endpoint: 'references', params: `${key}/pdf`, auth: true});
        if (key === this.pdfKey && request === this.pdfRequest) {
          if (result !== false) { this.showDelete = false; await this.loadPdf(); }
          else this.pdfError = 'Unable to delete PDF.';
        }
      } finally {
        this.pdfBusy = false;
      }
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>
