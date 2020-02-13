
export default {
    props: { items: Array, total: { type: Number, default: 0 }, loading: Boolean, options: Object },
    data() {
        return {
          needsCount: true,
          optsExtChange: this.options != null,
          opts: this.options,
          optsIntChange: false,
          
        }
    },
    watch: {
      opts: {
        handler (val, oldVal) {
          //console.log(`${this.$options.name}: optsExtChange: ${this.optsExtChange}`);
          if(!this.optsExtChange) {
            //console.log(`${this.$options.name}: internal change of options`);
            //console.dir(val);
            //console.dir(oldVal);
            this.update();
          } else {
            //console.log(`${this.$options.name}: external change of options`);
            //console.dir(val);
            //console.dir(oldVal);
            // there are multiple changes when assigning the shared opts
            setTimeout(() => {this.optsExtChange = false;}, 100);
            
          }
        },
        deep: true,
    },
    options(val) {
      //console.log(`${this.$options.name}: options prop updated`);
      //console.log(this.optsIntChange);
      //console.dir(val);
      // property is updated
      // has to update the internal opts object, but only if
      // this was not the source of the change
      if(!this.optsIntChange) {
        this.optsExtChange = true;
        //this.opts = this.options;
        Object.assign(this.opts, this.options);
        //console.log(`${this.$options.name}: local options updated`);
        // this might be a race condition
       
      } else {
        this.optsIntChange = false;
      }
    },
    },
    mounted() {
        
    },
    methods: {
      update() {
        //console.log(`${this.$options.name}:  update called`);
        this.optsIntChange = true;
        this.$emit('update', {options: this.opts, count: this.needsCount });
        this.needsCount = false;
      }
    }
}