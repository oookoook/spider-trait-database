<template>
    <v-dialog v-model="open">
        <v-card>
            <v-card-title>Replace reference</v-card-title>
            <v-card-text>
            <v-alert type="warning">This operation cannot be taken back. All records related to this reference will be updated and will use the reference you select below.</v-alert>
            Replace <i>{{item.fullCitation}}</i> with:
            <autocomplete-provider 
                list="references" 
                endpoint="references"
                value-field="id" 
                text-field="fullCitation" 
                :show-all="false"
                :search-from-start="true" 
                v-slot="i">
                <data-filter
                    v-model="replacement"  
                    :items="i.items" 
                    :loading="i.loading"
                    label="Replacement reference"
                    icon="mdi-bookmark-outline" 
                    @autocomplete="i.autocomplete"
                    @init="i.init">
      </data-filter>
      </autocomplete-provider>
            <v-text-field prepend-icon="mdi-check" v-model="confirmation" label="Type in yes if you really want to proceed" />
            <v-alert v-if="item.id == replacement" type="error">You have selected the same reference.</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-btn :loading="progress" text :disabled="disabled" color="warning" @click="replace"><v-icon left>mdi-check</v-icon>Replace &amp; Delete</v-btn>
                <v-btn text @click="open = false"><v-icon left>mdi-cancel</v-icon>Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import AutocompleteProvider from "./AutocompleteProvider"
import DataFilter from "./DataFilter"

export default {
    name: 'ReplaceReferenceDialog',
    components: { AutocompleteProvider, DataFilter },
    props: {
        value: Boolean,
        item: Object
    },
    data() {
        return {
            confirmation: null,
            replacement: null,
            progress: false
        }
    },
    computed: {
        open: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        },
        disabled() {
            return this.confirmation != 'yes' || this.replacement === this.item.id;
        }
    },
    methods: {
        async replace() {
            
            //this.$store.dispatch('notify', {text: `Replacing ${this.item.id} with ${this.replacement}!`});
            this.progress = true;
            this.$store.dispatch('editor/referenceReplace', {id: this.item.id, replacement: this.replacement});
            this.progress = false;
            this.open = false;
            this.$emit('completed', this.replacement);
        }
    }
}
</script>