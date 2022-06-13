<template>
    <v-container fluid>
    <h4>Authors list</h4>
    <v-row v-for="(a,i) in authors" :key="`author${i}`">
        <v-col cols="3">
        <v-text-field required label="Name" :readonly="readonly" v-model="a.name" :rules="[(v) => !!v || 'Name is required']"/>
        </v-col>
        <v-col cols="4">
        <v-text-field label="ORCID" :readonly="readonly" v-model="a.orcid" prefix="https://orcid.org/" placeholder="0000-0000-0000-0000"/>
        </v-col>
        <v-col cols="4">
        <v-text-field label="Affiliation" :readonly="readonly" v-model="a.affiliation" />
        </v-col>
        <v-col cols="1" class="pt-3">
            <action-button icon="mdi-delete" :disabled="readonly" tooltip text="Remove author" @click="remove(i)"/>
        </v-col>
    </v-row>
    <action-button icon="mdi-plus" :disabled="readonly" text="Add author" @click="add" color="primary" />
    </v-container>
</template>
<script>
import ActionButton from './ActionButton.vue';
import AuthorsParser from '../mixins/authors-parser'
export default {
    name: 'DatasetAuthorsEditor',
    components: { ActionButton },
    mixins: [AuthorsParser], 
    props: { value: String, readonly: Boolean },
    data() {
        return {
            authors: [],
            updating: false
        }
    },
    watch: {
        value() {
            this.updateAuthors();
        },
        authors: {
            handler() {
                this.updateValue();
            },
            deep: true
        }
    },
    methods: {
        updateValue() {
            this.updating = true;
            this.$emit('input', this.authors.filter(a => !!a.name).map(a => {
                let affiliation = '';
                let orcid = '';
                let name = a.name;
                if(a.orcid) {
                    orcid = ` [${a.orcid}]`;
                }
                if(a.affiliation) {
                    affiliation = ` (${a.affiliation})`
                }
                return `${name}${orcid}${affiliation}`;
            }).join(', '));
        },
        updateAuthors() {
            // prevent cycle - update value -> emit input -> updateAuthors -> updateValue 
            if(this.updating) {
                this.updating = false;
                return;
            }
            if(!this.value) {
                this.authors = [];
                return;
            }
            this.authors = this.parseAuthors(this.value);
        },
        add() {
            this.authors.push({ name: null, affiliation: null, orcid: null });
        },
        remove(i) {
            this.authors.splice(i,1);
        }
    },
    mounted() {
        this.updateAuthors();
    }
}
</script>