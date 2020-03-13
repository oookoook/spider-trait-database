<template>
  <v-card :loading="loading">
    <v-card-title>Data editor</v-card-title>
      <v-toolbar dense class="my-3">
        <action-button text="Dataset detail" icon="mdi-card-text-outline" toolbar @click="dsEdit = true" />
        <action-button color="success" text="Upload data" icon="mdi-upload" toolbar @click="upload = true" />
        <action-button text="Delete all the data" icon="mdi-table-remove" toolbar @click="deleteData"/>
        <action-button text="Delete the dataset" icon="mdi-delete-forever-outline" toolbar @click="deleteDataset" />
        <v-divider vertical class="mx-3" />
        <v-btn-toggle group dense mandatory v-model="validityFilter">
          <action-button text="Show all rows" icon="mdi-table" toolbar/>
          <action-button color="success" text="Show valid rows" icon="mdi-check-outline" toolbar />
          <action-button  color="error" text="Show invalid rows" icon="mdi-close-outline" toolbar />
        </v-btn-toggle>
        <v-divider vertical class="mx-3" />
          <v-btn-toggle group dense mandatory v-model="editMode">  
            <action-button text="Edit only the selected row" icon="mdi-table-row" toolbar />
            <action-button text="Edit the selected value in the whole column" icon="mdi-table-column" toolbar />
            <action-button text="Use this value as rule for value change" icon="mdi-table-search" toolbar />
            <action-button text="View distinct values in the selected column" icon="mdi-format-list-numbered" toolbar />
            <action-button text="Delete selected row" icon="mdi-table-row-remove" toolbar/>
          </v-btn-toggle>
        <v-divider vertical class="mx-3" />
        <v-spacer />
        <v-divider vertical class="mx-3" />
        <action-button v-if="!editor && isValid" color="success" text="Send for review" icon="mdi-send" toolbar @click="review" />
        <action-button v-if="!editor && !isValid" color="warning" text="Send for review (dataset invalid)" icon="mdi-send" toolbar @click="review"/>
        <action-button v-if="editor" color="error" text="Reject" icon="mdi-undo" toolbar @click="reject"/>
        <action-button v-if="editor" color="success" text="Approve" icon="mdi-stamper" toolbar @click="approve"/>
      </v-toolbar>

        <edit-table editor
        :items="list" 
        :loading="loading" 
        :total="total"
        :options="options" 
        @selectCell="selectCell" 
         />
      
        <!--
          Dataset editor
          TODO Data modifier
            - list of columns - old value, new value (autocomplete)
            - right part of the screen: two options: 
               - Edit value where record id IS row id
               - Edit all occurences of the value where the value in column x is y (this should be for both the cases - replacing the values in the column
                 or setting up the value based on values in a different column)
          File uploader
          Deletion Confirmation dialogs
        -->
        
        <v-bottom-sheet v-model="dsEdit">
            <dataset-form @hide="dsEdit = false" @save="updateDataset" :loading="loading" v-model="dataset"></dataset-form>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="upload">
            <upload-form @upload="uploadFile" @hide="upload = false"/>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="confirm.dialog">
            <v-card>
              <v-card-title>{{ confirm.title || 'Confirm action' }}</v-card-title>
              <v-card-text><span>{{ confirm.text }}</span> Are you sure?</v-card-text>
              <v-card-actions>
                  <action-button text="Cancel" @click="confirm.dialog = false" icon="mdi-cancel">
                  <action-button text="Confirm" @click="confirm.action" icon="mdi-check">
              </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        
        <!--
          Overlay showing the progress
          -->
        <v-overlay :value="job != null">
          <v-progress-circular :size="300" :width="30" :value="job.progress" color="warning">
            {{ job.title }} <br/>
            {{ job.progress }}% <br/>
          </v-progress-circular>
        </v-overlay>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ActionButton from './ActionButton'
import EditTable from './EditTable'
import DatasetForm from './DatasetForm'
import UploadForm from './UploadForm'
import ListProvider from './ListProvider'

export default {
  name: 'DataEditor',
  components: {
    ActionButton,
    EditTable,
    DatasetForm,
    UploadForm,
    ListProvider
  },
  props: {editor: Boolean},
  data () {
    return {
        validityFilter: 0,
        editMode: 0,
        loading: false,
        dsEdit: false,
        upload: false,
        options: null,
        confirm: {
          dialog: false,
          title: null,
          text: null,
          action: () => {}
        },
        jobCompletedAction: null,
        cellEdit: false,
        /*
        items: [
          {id: 1, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 2, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 3, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 4, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 5, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 6, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 7, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 8, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 9, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 10, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id:11, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 12, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} },
          {id: 13, originalName: 'Ahoj', wsc: {lsid: 0}, method: {}, trait: {}, reference: {} }
        ],
        */
        selectedCell: null,
  }
  },
  computed: {
    dataset: {
      get() {
        return this.$store.state.imports.entity;
      },
      set() {
        this.$store.dispatch(`imports/update`, val)
        .then(() => { 
          this.loading= false;
          // updates the dataset prop
          this.refreshDS();
        })
      }
    },
    isValid() {
      return this.dataset && this.dataset.valid.review;
    },
    ...mapGetters('editor', ['job', 'list', 'total'])
  },
  watch: {
    id(val) {
      if(val) {
        this.refreshDS();
        this.getData();
      }
    },
    job(val, oldVal) {
      if(oldVal && !val && this.jobCompletedAction) {
        this.jobCompletedAction();
      }
    },
    validityFilter(val) {
      this.getData();
    }
  },
  methods: {
    selectCell(e) {
      this.selectedCell = e;
      this.cellEdit = true;
    },
    refreshDS() {
      if(this.id) {
        this.loading = true;
        this.$store.dispatch(`imports/get`,{ id: this.id }).then(() => {this.loading = false; });
      }
    },
    uploadFile(f) {
      //console.dir(f);
      this.jobCompletedAction = this.getData;
      this.$store.dispatch(`editor/upload`,{ file: f });
    },
    updateDataset() {
      this.loading = true;
      this.$store.dispatch(`datasets/update`, this.dataset).then(() => {this.loading = false});
    },
    deleteData() {
      this.confirm.title = 'Delete data';
      this.confirm.text = 'All the data in the dataset will be deleted.';
      this.confirm.showMessage = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/deleteData', { id: this.id}).then(() => { this.loading = false; this.getData(); });
      }
    },
    deleteDataset() {
      this.confirm.title = 'Delete dataset';
      this.confirm.text = 'The whole dataset will be deleted.';
      this.confirm.showMessage = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('datasets/delete', { id: this.id}).then(() => { this.loading = false; this.$router.push(editor ? '/approve' : '/import') });
      }
    },
    approve() {
      this.confirm.title = 'Approve dataset';
      this.confirm.text = 'The dataset will be approved and the data will become available for public.';
      this.confirm.showMessage = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/changeState', { id: this.id, message: null, state: 'approved'}).then(() => {this.loading = false;});
      },
      this.jobCompletedAction = () => { this.$router.push('/approve')  };
    },
    reject() {
      this.confirm.title = 'Reject dataset';
      this.confirm.text = 'The dataset will be rejected. The contributor will be able to fix the data and then resend them for a review.';
      this.confirm.showMessage = true;
      this.confirm.message = "Enter a message for the contributor explaining the rejection.";
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/changeState', { id: this.id, message: this.confirm.message, state: 'rejected'}).then(() => { this.loading = false; this.$router.push('/approve') });
      }
    },
    review() {
      this.confirm.title = 'Submit dataset for a review';
      this.confirm.text = 'The dataset will be submitted for a review to the editors.';
      if(!this.dataset.valid.review) {
        this.confirm.warning += 'Attention! Your dataset is not valid for a review. If possible, fix all the marked problems before submitting.'
      }
      this.confirm.showMessage = true;
      this.confirm.message = "Enter a message for the editor if you want to tell them someting about your data (e.g. reason why the data re not valid).";
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/changeState', { id: this.id, message: this.confirm.message, state: 'reviewed'}).then(() => { this.loading = false; this.$router.push('/import') });
      }
    },
    getData(params) {
      if(this.id) {
        if(!params) {
          params = {};
          
          params.count = true;
          params.options = this.options ? this.options : {
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: []
          }
        } else if(params.options) {
          this.options = params.options;  
        }
        if(this.validityFilter != 0) {
          var c = editor ? 'valid.review' : 'valid.approve';
          params.filter[c] = this.validityFilter == 1 ? true : false;
        }
        this.loading = true;
        this.$store.dispatch(`editor/list`,{ id: this.id, params }).then(() => {this.loading = false; });
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
