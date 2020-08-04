import EntityLinkCell from '../components/EntityLinkCell'
import ListFilter from '../components/ListFilter'
import ActionButton from '../components/ActionButton'
import { mapGetters } from 'vuex'

export default {
    components: {
        EntityLinkCell,
        ListFilter,
        ActionButton
      },
    props: { items: Array, total: { type: Number, default: 0 }, loading: Boolean, autocompleteLoading: Boolean, autocompleteItems: Array, savedOptions: Object },
    data() {
        console.log('Data assigning');
        console.dir(this.savedOptions);
        return {
            footerProps: { 'items-per-page-options': [ 10, 15, 50, 100, -1 ] },
            search: null,
            internalOptsChange: false,
            needsCount: true,
            options: this.savedOptions,
        }
    },
    computed: {
      ...mapGetters(['isEditor'])
    },
    watch: {
        options: {
            handler (val, oldVal) {
              console.log(`${this.$options.name } opts changed`);
              console.dir(oldVal);
              console.dir(this.options);
              if(this.internalOptsChange == 0) {
                console.log(`${this.$options.name } opts changed updating`);
                //this.needsCount = true;
                this.update();
              } else {
                this.internalOptsChange -= 1;
                console.log(`${this.$options.name } opts changed internally`);
              }
            },
            deep: true,
        },
        search(val, oldVal) {
          console.log('SEARCH!');
          // resetting the itemsPerPage so not all the results are loaded
          this.internalOptsChange = 2;
          
          // two option changes are ignored
          this.options.itemsPerPage = 10;
          this.options.page = 1;
          
          this.needsCount = true;
          //console.dir(this.options);
          this.update();
    
        },
    },
    methods: {
        update() {
            console.log('update called')
            
            var search = null;
            var searchField = null;
            var searchLike = true;
      
            if(this.search) {
              search = this.search.search;
              searchField = this.search.searchField;
              searchLike = this.search.searchLike;
              console.dir(this.search);
              console.log(this.needsCount);
            }
            
      
            this.$emit('update', {options: this.options, count : this.needsCount, search, searchField, searchLike });
            this.needsCount = false;
          },
          autocomplete(p) {
            this.$emit('autocomplete', p);
          }
    },
    /*
    beforeDestroy() {
      console.log('List table destroyed');
    },
    mounted() {
      console.log('List table mounted');
    }
    */
}