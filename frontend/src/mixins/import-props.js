export default {
  props: { editor: Boolean },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters('editor', ['entityProps', 'entityPropsDict', 'headers'])
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
     return this.entityProps[propName].displayValue(item);
    },
    isPropValid(item, propName) {
      return this.entityProps[propName].isValid(item, this.editor);
    },
    getPropForeignMatch(item, propName) {
      // return the ID of foreign key if available
      return this.entityProps[propName].foreignMatchValue(item);
    },
    getPropName(propName) {
      // return prop name
      return this.entityProps[propName].text;
    }
  }
}
