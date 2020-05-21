<template>
  <v-card :loading="loading">
    <v-card-title>Data editor</v-card-title>
      <v-toolbar dense color="accent" class="elevation-0 my-3">
        <action-button text="Dataset detail" icon="mdi-card-text-outline" toolbar @click="dsEdit = true" />
        <action-button color="success" text="Upload data" icon="mdi-upload" toolbar @click="upload = true" />
        <action-button text="Download as CSV" icon="mdi-download" toolbar :link="downloadLink" />
        <action-button text="Delete all the data" icon="mdi-table-remove" toolbar @click="deleteData"/>
        <action-button text="Delete the dataset" icon="mdi-delete-forever-outline" toolbar @click="deleteDataset" />
        <v-divider vertical class="mx-3" />
        <v-btn-toggle group dense mandatory v-model="validityFilter">
          <action-button text="Show all rows" icon="mdi-table" toolbar/>
          <action-button color="success" text="Show valid rows" icon="mdi-check-outline" toolbar />
          <action-button  color="error" text="Show invalid rows" icon="mdi-close-outline" toolbar />
        </v-btn-toggle>
        <v-divider vertical class="mx-3" />
          <v-btn-toggle group dense v-model="shorten">
          <action-button text="Shorten long values" icon="mdi-arrow-collapse-horizontal" toolbar />
          </v-btn-toggle>
        <v-divider vertical class="mx-3" />
          <v-btn-toggle group dense mandatory v-model="editModeRaw">  
            <action-button text="Edit only the selected cell" icon="mdi-table-row" toolbar />
            <action-button text="Edit the selected value in the whole column" icon="mdi-table-column" toolbar />
            <action-button text="Use this value as rule for value change" icon="mdi-table-search" toolbar />
            <action-button text="View distinct values in the selected column" icon="mdi-format-list-numbered" toolbar />
            <action-button text="View duplicates" icon="mdi-content-duplicate" toolbar />
            <action-button text="Delete selected row" icon="mdi-table-row-remove" toolbar />
            <action-button text="Delete all rows containing selected value" icon="mdi-table-column-remove" toolbar />
          </v-btn-toggle>
        <v-divider vertical class="mx-3" />
        <v-spacer />
        <v-divider vertical class="mx-3" />
        <action-button text="Open error log" icon="mdi-clipboard-alert-outline" toolbar @click="log.dialog = true;" />
        <action-button text="Refresh the table" icon="mdi-refresh" toolbar @click="refreshDS(); getData();" />
        <action-button text="Revalidate the whole dataset" icon="mdi-check-all" toolbar @click="validate" />
        <v-divider vertical class="mx-3" />
        <action-button v-if="!editor && isValid" color="success" text="Send for review" icon="mdi-send" toolbar @click="review" />
        <action-button v-if="!editor && !isValid" color="warning" text="Send for review (dataset invalid)" icon="mdi-send" toolbar @click="review"/>
        <action-button v-if="editor" color="error" text="Reject" icon="mdi-undo" toolbar @click="reject"/>
        <info-icon v-if="editor && !isValid" color="warning" icon="mdi-cancel" text="Dataset is not valid" toolbar />
        <action-button v-if="editor && isValid" color="success" text="Approve" icon="mdi-stamper" toolbar @click="approve"/>
      </v-toolbar>

        <edit-table :editor="editor"
        :items="list" 
        :loading="loadingData" 
        :total="total"
        :options="options"
        :shorten="shorten === 0" 
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
            <dataset-form @hide="dsEdit = false" :loading="loading" v-model="dataset"></dataset-form>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="upload">
            <upload-form @upload="uploadFile" @hide="upload = false"/>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="confirm.dialog">
            <v-card>
              <v-card-title>{{ confirm.title || 'Confirm action' }}</v-card-title>
              <v-card-text><p><span>{{ confirm.text }}</span> Are you sure?</p>
              <v-alert v-if="confirm.warning" type="warning">
                {{confirm.warning}}
              </v-alert>
              <v-textarea v-if="confirm.message.show" v-model="confirm.message.text" :placeholder="confirm.message.placeholder" />
              </v-card-text>
              <v-card-actions>
                  <action-button text="Cancel" @click="confirm.dialog = false" icon="mdi-close" />
                  <action-button text="Confirm" color="warning" :loading="loading" @click="confirm.action" icon="mdi-check" />
              </v-card-actions>
            </v-card>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="edit.dialog">
            <edit-dialog :editor="editor"  :loading="loading" :type="editMode" :selection="selectedCell" @cancel="edit.dialog = false" @save="edit.action" />
        </v-bottom-sheet>
        <v-bottom-sheet v-model="distinct.dialog" scrollable>
            <distinct-dialog v-if="selectedCell" :editor="editor" :dataset="id" :prop-name="selectedCell.prop" @cancel="distinct.dialog = false" @create="createEntity" @rule="ruleDistinct" @column="columnDistinct"/>
        </v-bottom-sheet>
        <v-bottom-sheet v-model="duplicate.dialog" scrollable>
            <duplicate-dialog v-if="selectedCell" :item="selectedCell.item" :loading="loading" @remove="deleteDuplicate" />
        </v-bottom-sheet>
        <v-bottom-sheet scrollable v-model="log.dialog">
          <v-card>
              <v-card-title>Error Log</v-card-title>
            <v-card-text style="height: 400px">
            <v-data-table :items="errorsLocal" :headers="[{value: 'id', text: 'ID'},{value: 'text', text: 'Message'}]">
              <template v-slot:no-data>
                No errors in the log
              </template>
            </v-data-table>
            </v-card-text>
            <v-card-actions>
              <action-button text="Clear log" @click="errorsLocal = []; " icon="mdi-playlist-remove" />
              <action-button text="Close" @click="log.dialog=false; errorsLocal = []; " icon="mdi-close" />
            </v-card-actions>
          </v-card> 
        </v-bottom-sheet>
        <!--
          Overlay showing the progress
          -->
        <v-overlay :value="job != null">
          <v-progress-circular v-if="job != null" :size="300" :width="30" :value="job.state.progress" color="secondary">
            {{ job.title }} <br/>
            {{ job.state.progress }}% <br/>
          </v-progress-circular>
        </v-overlay>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {mixin as VueTimers} from 'vue-timers'

import ActionButton from './ActionButton'
import InfoIcon from './InfoIcon'
import EditTable from './EditTable'
import EditDialog from './EditDialog'
import DistinctDialog from './DistinctDialog'
import DuplicateDialog from './DuplicateDialog'
import DatasetForm from './DatasetForm'
import UploadForm from './UploadForm'
import ListProvider from './ListProvider'

export default {
  name: 'DataEditor',
  mixins: [VueTimers],
  components: {
    ActionButton,
    InfoIcon,
    EditTable,
    EditDialog,
    DistinctDialog,
    DatasetForm,
    UploadForm,
    ListProvider,
    DuplicateDialog
  },
  props: {isEditor: Boolean, id: Number},
  data () {
    return {
        validityFilter: 0,
        editModeRaw: 0,
        shorten: true,
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
          warning: null,
          message: {
            show: false,
            text: null,
            placeholder: null
          },
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
        },
        duplicate: {
          dialog: false
        },
        errorsLocal: []
  }
  },
  computed: {
    editor() {
      if(!this.dataset) {
        return false;
      }
      return this.isEditor && this.dataset.state == 'reviewed';
    },
    dataset: {
      get() {
        return this.$store.state.imports.entity;
      },
      set(val) {
        console.dir(val);
        console.dir(this.dataset);
        // name did not changed - remove it form the object so no new unique id is added
        if(val.name == this.dataset.name) {
          delete(val.name);
        }
        this.$store.dispatch(`datasets/update`, val)
        .then(() => { 
          this.loading= false;
          this.dsEdit = false;
          // updates the dataset prop
          this.refreshDS();
        })
      }
    },
    isValid() {
      return this.dataset && this.total > 0 && ((!this.editor && this.dataset.valid.review) || (this.editor && this.dataset.valid.approve));
    },
    
    editMode: {
      get() {
      switch(this.editModeRaw) {
        case 0 : return 'cell';
        case 1: return 'column';
        case 2: return 'rule';
        case 3: return 'distinct';
        case 4: return 'duplicate';
        case 5: return 'delete';
        case 6: return 'deleteMultiple';
      }
      },
      set(val) {
        switch(val) {
        case 'cell' : this.editModeRaw = 0; break;
        case 'column': this.editModeRaw = 1; break;
        case 'rule': this.editModeRaw = 2; break;
        case 'distinct': this.editModeRaw = 3; break;
        case 'duplicate': this.editModeRaw = 4; break;
        case 'delete': this.editModeRaw = 5; break;
        case 'deleteMultiple': this.editModeRaw = 6; break;
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
        } else {
          this.refreshDS();
          this.getData();
        }
      } else if(val && val.id) {
        // this is an external job
        // internal jobs are refreshed automatically
        this.$timer.start('refreshJob');
      }
    },
    validityFilter(val) {
      this.getData();
    },
    errors(val) {
      if(val && Array.isArray(val) && val.length > 0) {
        //console.dir(val);
        //console.dir(this.errorsLocal);
        this.log.dialog = true;
        val.forEach(e => this.errorsLocal.unshift(e));
        this.$store.dispatch('clearErrors');
      }
    }
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
        case 'duplicate': this.showDuplicate(); break;
        case 'delete': this.deleteRow(); break;
        case 'deleteMultiple': this.deleteColumn(); break;
      }
    },
    validate() {
      //this.jobCompletedAction = () => { this.getData(); this.refreshDS(); };
      this.loading = true;
      this.$store.dispatch(`editor/validate`,{ id: this.id, all: true });
    },
    refreshDS() {
      if(this.id) {
        this.loading = true;
        this.$store.dispatch(`imports/get`,{ id: this.id }).then(() => {this.loading = false; });
      }
    },
    uploadFile(f) {
      //console.dir(f);
      this.jobCompletedAction = () => { this.getData(); this.refreshDS(); };
      this.upload = false;
      this.$store.dispatch(`editor/upload`,{ dataset: this.id, file: f });
    },
    /* Handled by the watcher
    updateDataset() {
      this.loading = true;
      this.$store.dispatch(`datasets/update`, this.dataset).then(() => {this.loading = false; this.refreshDS();});
    },
    */
    deleteData() {
      this.confirm.title = 'Delete data';
      this.confirm.text = 'All the data in the dataset will be deleted.';
      this.confirm.message.show = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/deleteData', { id: this.id}).then(() => { this.loading = false; this.confirm.dialog = false; this.refreshDS(); this.getData(); });
      }
      this.confirm.dialog = true;
    },
    deleteDataset() {
      this.confirm.title = 'Delete dataset';
      this.confirm.text = 'The whole dataset will be deleted.';
      this.confirm.message.show = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('datasets/delete', { id: this.id}).then(() => { this.loading = false; this.$router.push(this.editor ? '/approve' : '/import') });
      }
      this.confirm.dialog = true;
    },
    deleteDuplicate() {
      this.duplicate.dialog = false;
      this.deleteRow();
    },
    deleteRow() {
      this.confirm.title = 'Delete row';
      this.confirm.text = 'The selected row will be deleted.';
      this.confirm.message.show = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/deleteRow', { dataset: this.id, id: this.selectedCell.id}).then(() => { this.loading = false; this.confirm.dialog = false; this.refreshDS(); this.getData(); });
      }
      this.confirm.dialog = true;
    },
    deleteColumn() {
      this.confirm.title = 'Delete rows';
      var prop = this.$store.getters[`editor/propsDict`][this.selectedCell.prop];
      var value = prop.displayValue(this.selectedCell.item);
      var column = this.selectedCell.prop;
      this.confirm.text = `All rows with the value "${value == null ? '[empty]' : value}" in the column ${prop.text} will be deleted.`;
      this.confirm.message.show = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/deleteColumn', { dataset: this.id, column, value }).then(() => { this.loading = false; this.confirm.dialog = false; this.refreshDS(); this.getData(); });
      }
      this.confirm.dialog = true;
    },
    approve() {
      this.confirm.title = 'Approve dataset';
      this.confirm.text = 'The dataset will be approved and the data will become available for public.';
      this.confirm.message.show = false;
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/changeState', { id: this.id, message: null, state: 'approved'}).then(() => { this.confirm.dialog=false; this.loading = false;});
      },
      this.jobCompletedAction = () => { this.$router.push('/approve')  };
      this.confirm.dialog = true;
    },
    reject() {
      this.confirm.title = 'Reject dataset';
      this.confirm.text = 'The dataset will be rejected. The contributor will be able to fix the data and then resend them for a review.';
      this.confirm.message.show = true;
      this.confirm.message.placeholder = "Enter a message for the contributor explaining the rejection.";
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/changeState', { id: this.id, message: this.confirm.message.text, state: 'rejected'}).then(() => { this.loading = false; this.$router.push('/approve') });
      }
      this.confirm.dialog = true;
    },
    review() {
      this.confirm.title = 'Submit dataset for a review';
      this.confirm.text = 'The dataset will be submitted for a review to the editors.';
      if(!this.dataset.valid.review) {
        this.confirm.warning = 'Attention! Your dataset is not valid for a review. If possible, fix all the marked problems before submitting.'
      }
      this.confirm.message.show = true;
      this.confirm.message.placeholder = "Enter a message for the editor if you want to tell them someting about your data (e.g. reason why the data re not valid).";
      this.confirm.action = () => {
        this.loading = true;
        this.$store.dispatch('editor/changeState', { id: this.id, message: this.confirm.message.text, state: 'reviewed'}).then(() => { this.loading = false; this.confirm.warning = null; this.$router.push('/import') });
      }
      this.confirm.dialog = true;
    },
    /*
    download() {
      this.$store.dispatch(`editor/download`,{ dataset: this.id });
    },
    */
    editCell() {
      if(this.selectedCell.readOnly) {
        this.$store.dispatch('notify', {text: 'This is an read-only value.', error: true});
        return;
      }
      this.edit.action = (e) => {
        this.loading = true;
        this.$store.dispatch('editor/editRow', { dataset: this.id, id: this.selectedCell.id, changes: e}).then(() => { this.loading = false; this.edit.dialog=false; this.refreshDS(); this.getData(); });
      };
      this.edit.dialog = true;
    },
    editColumn() {
      if(this.editMode == 'column' && this.selectedCell.readOnly) {
        this.$store.dispatch('notify', {text: 'This is an read-only value.', error: true});
        return;
      }
      this.edit.action = (e) => {
        this.loading = true;
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
    showDuplicate() {
      this.duplicate.dialog = true;
    },
    createEntity(evt) {
      if(evt.entity.value) {
        this.loading = true;
        this.$store.dispatch(`${evt.endpoint}/create`, evt.entity.value)
        .then((data) => {
          if(data.error) {
            return Promise.resolve();
          }
          // after creation do a column change with the entity vals and the returned abbrevs
          var payload = evt.columns;
          payload.dataset = this.dataset.id;
          var o = {};
          o[evt.entity.name] = data.entity;
          payload.multipleColumns = true;
          payload.newValue = evt.entity.match.displayValue(o);
          return this.$store.dispatch(`editor/editColumn`, payload );
          })
          .then((data) => { this.loading = false; this.refreshDS(); this.getData(); });
      } else if(evt.entity.values) {
        this.distinct.dialog = false;
        this.confirm.title = 'Batch entity creation';
        this.confirm.text = `You are about to create ${evt.entity.values.length} entities.`;
        this.confirm.message.show = false;
        this.confirm.action = () => {
          this.confirm.dialog = false;
          this.loading = true;
          this.jobCompletedAction = () => { 
            //this.showLog(); 
            this.jobCompletedAction = () => { this.refreshDS(); this.getData(); };
            this.$store.dispatch(`editor/validate`, {id: this.dataset.id});
          }
          evt.columns.dataset = this.dataset.id;
          this.$store.dispatch(`editor/createMultiple`, evt);
        
          // after creation is completed run ad-hoc validation 
          
      }
      this.confirm.dialog = true;  
      }
    },
    /*
    showLog() {
      if(this.errors && this.errors.length > 0) {
        this.log.dialog = true;
      }
    },
    */
    columnDistinct(evt) {
      this.replaceDistinct('column', evt);
    },
    ruleDistinct(evt) {
      this.replaceDistinct('rule', evt);
    },
    replaceDistinct(mode, evt) {
      // rule or column
      this.editMode = mode;
      /*
      if(evt.prop && evt.prop != this.selectedCell.prop) {
        this.selectedCell.prop = evt.prop;
      }
      var o = {};
      this.propsDict[this.selectedCell.prop].save(o, evt.value);
      this.selectedCell.item = o;
      */
      this.selectedCell = evt;
      this.distinct.dialog = false;
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
          params.searchField = this.editor ? 'valid.approve' : 'valid.review';
          //console.log(this.validityFilter);
          params.search = this.validityFilter == 1 ? true : false;
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
    if(this.job && this.job.id) {
      this.$timer.start('refreshJob');
    } else if(this.job && !this.job.id) {
      // abandoned local job
      this.$store.dispatch('resetJob');
      this.refreshJob();
    }
  },
  timers: {
    refreshJob: { time: 3000, repeat: true }
  },
}
</script>
<style scoped>

</style>
