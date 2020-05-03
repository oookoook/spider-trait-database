import EntityLinkCell from '../components/EntityLinkCell'
import ListFilter from '../components/ListFilter'
import { mapGetters } from 'vuex'

export default {
    components: {
        EntityLinkCell,
        ListFilter
      },
    props: { items: Array, total: { type: Number, default: 0 }, loading: Boolean, autocompleteLoading: Boolean, autocompleteItems: Array },
    data() {
        return {
            search: null,
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
              this.update();
            },
            deep: true,
        },
        search(val, oldVal) {
          // resetting the itemsPerPage so not all the results are loaded
          this.options.itemsPerPage = 10;
          
          this.needsCount = true;
          this.update();
    
          /*
          // field was cleared
          if(val == null && oldVal != null) {
            console.log('Search cleared');
            
          }
          // a new value for search
          if(val && !oldVal && !val.free) {
            console.log('New search');
            this.needsCount = true;
            this.update();
          }
          */
        },
    },
    mounted() {
        
    },
    methods: {
        update() {
            //console.log('update called')
            
            var search = null;
            var searchField = null;
            var searchLike = true;
      
            if(this.search) {
              search = this.search.search;
              searchField = this.search.searchField;
              searchLike = this.search.searchLike;
            }
            
      
            this.$emit('update', {options: this.options, count : this.needsCount, search, searchField, searchLike });
            this.needsCount = false;
          },
          autocomplete(p) {
            this.$emit('autocomplete', p);
          }
    }
}