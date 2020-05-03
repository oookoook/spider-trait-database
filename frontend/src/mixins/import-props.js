import { mapGetters } from 'vuex'

export default {
  props: { editor: Boolean },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters('editor', ['entityProps', 'propsDict', 'headers'])
  },
  watch: {},
  mounted() {},
  methods: {
    getPropValue(item, propName) {
     return this.propsDict[propName].displayValue(item, this.editor);
    },
    getPropFormattedValue(item, propName, shorten) {
      //console.log(propName);
      var v = this.getPropValue(item, propName);
      if(v != null && typeof v == 'string') {
       //console.log(`replacing spaces in ${v}`);
        v = v.replace(/\s/g, '\xa0');
        
        if(shorten && v.length > 35) {
          v = v.substring(0, 32) + '...';
        }
        
      } else if(v != null && typeof v == 'boolean') {
        v = v ? 'Yes' : 'No';
      }
      return v;
    },
    isPropValid(item, propName) {
      //console.log(propName);
      return this.propsDict[propName].isValid(item, this.editor);
    },
    isPropReadOnly(propName) {
      return this.propsDict[propName].readOnly === true;
    },
    getPropForeignMatch(item, propName) {
      // return the ID of foreign key if available
      return this.propsDict[propName].foreignMatchValue(item);
    },
    getPropName(propName) {
      if(!propName) {
        return '';
      }
      //console.log(`propName: ${propName}`);
      // return prop name
      return this.propsDict[propName].text;
    },
    getEntityHeaders(entity) {
      return this.$store.getters[`editor/entityHeaders`](entity);
    },
    isEntityValid(entity, item) {
      return this.$store.getters[`editor/isEntityValid`](entity, item, this.editor);
    },
    getEntityEndpoint(entity) {
      return this.$store.getters[`editor/entityEndpoint`](entity);
    },
    getEntityMatch(entity) {
      return this.$store.getters[`editor/entityMatch`](entity);
    },
    getDistinctEntityProps(entity) {
      return this.$store.getters[`editor/distinctEntityProps`](entity);
    }
  }
}
