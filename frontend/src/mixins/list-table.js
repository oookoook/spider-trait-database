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
    props: { items: Array, total: { type: Number, default: 0 }, loading: Boolean, autocompleteLoading: Boolean, autocompleteItems: Array },
    data() {
        return {
            search: null,
            internalOptsChange: false,
            needsCount: true,
            options: {},
        }
    },
    computed: {
      ...mapGetters(['isEditor'])
    },
    watch: {
        options: {
            handler () {
              console.log('opts changed');
              console.dir(this.options);
              if(this.internalOptsChange == 0) {
                console.log('opts changed updating');
                this.update();
              } else {
                this.internalOptsChange -= 1;
                console.log('opts changed internally');
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
    mounted() {
        
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
    }
}