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
      /*
      //console.dir(item);
      // from input such as 'eventDate.start' gets value item[eventDate][start]
      var i = item;
      var v = null;
      var a = prop.split('.');
      var pos = 0;
      while (pos < a.length) {
        v = i[a[pos]];
        i = i[a[pos]];
        pos += 1;
      }
      return v;
      */
     return this.propsDict[propName].displayValue(item);
    },
    getPropFormattedValue(item, propName) {
      var v = this.getPropValue(item, propName);
      if(v != null && typeof v == 'string') {
        v = v.replace(' ', '\xa0');
      }
      return v;
    },
    isPropValid(item, propName) {
      //console.log(propName);
      return this.propsDict[propName].isValid(item, this.editor);
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
      return this.$store.getters[`editor/distinctEntityHeaders`](entity);
    },
    isEntityValid(entity, item) {
      return this.$store.getters[`editor/isEntityValid`](entity, item, this.editor);
    },
    getEntityEndpoint(entity) {
      return this.$store.getters[`editor/entityEndpoint`](entity);
    }
  }
}
