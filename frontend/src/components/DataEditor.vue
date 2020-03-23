<template>
  <v-card :loading="loading">
    <v-card-title>Data editor</v-card-title>
      <v-toolbar dense color="accent" class="elevation-0 my-3">
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
          <v-btn-toggle group dense mandatory v-model="editModeRaw">  
            <action-button text="Edit only the selected cell" icon="mdi-table-row" toolbar />
            <action-button text="Edit the selected value in the whole column" icon="mdi-table-column" toolbar />
            <action-button text="Use this value as rule for value change" icon="mdi-table-search" toolbar />
            <action-button text="View distinct values in the selected column" icon="mdi-format-list-numbered" toolbar />
            <action-button text="Delete selected row" icon="mdi-table-row-remove" toolbar />
          </v-btn-toggle>
        <v-divider vertical class="mx-3" />
        <v-spacer />
        <v-divider vertical class="mx-3" />
        <action-button text="Download as CSV" icon="mdi-download" toolbar :link="downloadLink" external />
        <action-button v-if="!editor && isValid" color="success" text="Send for review" icon="mdi-send" toolbar @click="review" />
        <action-button v-if="!editor && !isValid" color="warning" text="Send for review (dataset invalid)" icon="mdi-send" toolbar @click="review"/>
        <action-button v-if="editor" color="error" text="Reject" icon="mdi-undo" toolbar @click="reject"/>
        <action-button v-if="editor" color="success" text="Approve" icon="mdi-stamper" toolbar @click="approve"/>
      </v-toolbar>

        <edit-table editor
        :items="list" 
        :loading="loadingData" 
        :total="total"
        :options="options" 
        @selectCell="selectCell"
        @update="getData" 
         >
          <action-button color="primary" text="Upload data" icon="mdi-upload" @click="upload = true"></action-button>
        </edit-table>
      
        <!--
          Dataset editor
          Data modifier
            - list of columns - old value, new value (autocomplete)
            - right part of the screen: two options: 
               - Edit value where record id IS row id
               - Edit all occurences of the value where the value in column x is y (this should be for both the cases - replacing the values in the column
                 or setting up the value based on values in a different column)
          File uploader
          Deletion Confirmation dialogs
          distinct lists
          Log
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
                  <action-button text="Cancel" @click="confirm.dialog = false" icon="mdi-cancel" />
                  <action-button text="Confirm" color="warning" @click="confirm.action" icon="mdi-check" />
              </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="edit.dialog">
            <edit-dialog :type="editMode" :selection="selectedCell" @cancel="edit.dialog = false" @save="edit.action" />
        </v-bottom-sheet>
        <v-bottom-sheet v-model="distinct.dialog">
            <distinct-dialog v-if="selectedCell" :editor="editor" :dataset="id" :prop-name="selectedCell.prop" @cancel="distinct.dialog = false" @create="createEntity" @rule="ruleDistinct" @column="columnDistinct"/>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="log.dialog">
          <v-card>
              <v-card-title>Error Log</v-card-title>
            <v-card-text>
            <v-data-table v-if="errors" :items="errors" headers="[{value: 'id', text: 'ID'},{value: 'Message', text: 'text'}]">
            </v-data-table>
            </v-card-text>
            <v-card-actions>
              <action-button text="Close" @click="log.dialog = false" icon="mdi-cancel" />
            </v-card-actions>
          </v-card> 
        </v-bottom-sheet>
        <!--
          Overlay showing the progress
          -->
        <v-overlay :value="job != null">
          <v-progress-circular v-if="job != null" :size="300" :width="30" :value="job.state.progress" color="warning">
            {{ job.title }} <br/>
            {{ job.state.progress }}% <br/>
          </v-progress-circular>
        </v-overlay>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {mixin as VueTimers} from 'vue-timers'
import IdFromRoute from '../mixins/id-from-route'

import ActionButton from './ActionButton'
import EditTable from './EditTable'
import EditDialog from './EditDialog'
import DistinctDialog from './DistinctDialog'
import DatasetForm from './DatasetForm'
import UploadForm from './UploadForm'
import ListProvider from './ListProvider'

export default {
  name: 'DataEditor',
  mixins: [VueTimers, IdFromRoute],
  components: {
    ActionButton,
    EditTable,
    EditDialog,
    DistinctDialog,
    DatasetForm,
    UploadForm,
    ListProvider
  },
  props: {editor: Boolean},
  data () {
    return {
        validityFilter: 0,
        editModeRaw: 0,
        //editMode: 'cell',
        loading: false,
        loadingData: false,
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
        edit: {
          dialog: false,
          action: () => {}
        },
        log: {
          dialog: false
        },
        selectedCell: null,
        distinct: {
          dialog: false
        }
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
      return this.dataset && this.total > 0 && this.dataset.valid.review;
    },
    
    editMode: {
      get() {
      switch(this.editModeRaw) {
        case 0 : return 'cell';
        case 1: return 'column';
        case 2: return 'rule';
        case 3: return 'distinct';
        case 4: return 'delete';
      }
      },
      set(val) {
        switch(val) {
        case 'cell' : this.editModeRaw = 0; break;
        case 'column': this.editModeRaw = 1; break;
        case 'rule': this.editModeRaw = 2; break;
        case 'distinct': this.editModeRaw = 3; break;
        case 'delete': this.editModeRaw = 4; break;
      }
      }
    },
    downloadLink() {
      if(this.dataset) {
        return this.$store.getters['editor/downloadLink'](this.dataset.id);
      } else {
        return '';
      }
    },
    ...mapState('editor', ['list', 'total']),
    ...mapGetters(['job', 'errors'])
  },
  watch: {
    id(val) {
      if(val) {
        this.refreshDS();
        this.getData();
      }
    },
    job(val, oldVal) {
      if(oldVal && !val) {
        this.$timer.stop('refreshJob');
        if(this.jobCompletedAction) {
          this.jobCompletedAction();
        }
      } else {
        this.$timer.start('refreshJob');
      }
    },
    validityFilter(val) {
      this.getData();
    },
    /*
    editMode() {
      if(this.selectedCell) {
        selectCell()
      }
    }
    */
  },
  methods: {
    selectCell(e) {
      this.selectedCell = e;
      //console.log(this.editMode);
      this.showEdit();
    },
    showEdit() {
      switch(this.editMode) {
        case 'cell': this.editCell(); break;
        case 'column': 
        case 'rule': this.editColumn(); break;
        case 'distinct': this.showDistinct(); break;
        case 'delete': this.deleteRow(); break;
      }
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
      this.upload = false;
      this.$store.dispatch(`editor/upload`,{ dataset: this.id, file: f });
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
        this.$store.dispatch('editor/deleteData', { id: this.id}).then(() => { this.loading = false; this.confirm.dialog = false; this.refreshDS(); this.getData(); });
      }
      this.confirm.dialog = true;
    },
    deleteDataset() {
      this.confirm.title = 'Delete dataset';
      this.confirm.text = 'The whole dataset will be deleted.';
      this.confirm.showMessage = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('datasets/delete', { id: this.id}).then(() => { this.loading = false; this.$router.push(editor ? '/approve' : '/import') });
      }
      this.confirm.dialog = true;
    },
    deleteRow() {
      this.confirm.title = 'Delete row';
      this.confirm.text = 'The selected row will be deleted.';
      this.confirm.showMessage = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/deleteRow', { dataset: this.id, id: this.selectedCell.id}).then(() => { this.loading = false; this.refreshDS(); this.getData(); });
      }
      this.confirm.dialog = true;
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
      this.confirm.dialog = true;
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
      this.confirm.dialog = true;
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
      this.confirm.dialog = true;
    },
    /*
    download() {
      this.$store.dispatch(`editor/download`,{ dataset: this.id });
    },
    */
    editCell() {
      this.edit.action = (e) => {
        this.$store.dispatch('editor/editRow', { dataset: this.id, id: this.selectedCell.id, changes: e}).then(() => { this.loading = false; this.edit.dialog=false; this.refreshDS(); this.getData(); });
      };
      this.edit.dialog = true;
    },
    editColumn() {
      this.edit.action = (e) => {
        e.dataset = this.id;
        e.id = this.selectedCell.id;
        this.$store.dispatch('editor/editColumn', e).then(() => { this.loading = false; this.edit.dialog=false; });
      };
      this.jobCompletedAction = () => { this.refreshDS(); this.getData(); };
      this.edit.dialog = true;
    },
    showDistinct() {
      this.distinct.dialog = true;
    },
    createEntity(evt) {
      if(evt.entity) {
        this.loading = true;
        this.$store.dispatch(`${evt.endpoint}/create`, evt.entity).then(() => { this.loading = false; });
      } else {
        this.jobCompletedAction = () => { this.showLog(); };
        this.$store.dispatch(`editor/createMultiple`, evt);
      }
    },
    showLog() {
      if(this.errors && this.errors.length > 0) {
        this.log.dialog = true;
      }
    },
    columnDistinct(evt) {
      this.replaceDistinct('column', evt);
    },
    ruleDistinct(evt) {
      this.replaceDistinct('rule', evt);
    },
    replaceDistinct(mode, evt) {
      // rule or column
      this.editMode = mode;
      if(evt.prop && evt.prop != this.selectedCell.prop) {
        this.selectedCell.prop = evt.prop;
      }
      var o = {};
      this.entityPropDict[this.selectedCell.prop].save(o, evt.value);
      this.selectedCell.item = o;
      this.editColumn();
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
        this.loadingData = true;
        params.id = this.id;
        //console.dir(params);
        this.$store.dispatch(`editor/list`, params).then(() => {this.loadingData= false; });
      }
    },
    refreshJob() {
      this.$store.dispatch(`refreshJob`);  
    }
  },
  created () {

  },
  mounted () {
    if(this.job) {
      this.$timer.start('refreshJob');
    }
  },
  timers: {
    refreshJob: { time: 3000, repeat: true }
  },
}
</script>
<style scoped>

</style>
