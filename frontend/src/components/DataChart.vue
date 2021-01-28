<script>
import { mapState, mapGetters } from 'vuex'

import { Bar, mixins } from 'vue-chartjs'

export default {
  name: 'DataChart',
  mixins: [Bar],
  components: {
  },
  props: { filter: Object, trait: Number, loading: Boolean, isVisible: Boolean },
  data () {
    return {
      options: {
        responsive:true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Frequency'
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
      },
      traitDataType: null,
      traitDetail: null,
      renderWaiting: null
    }
  },
  computed: {
    ...mapState('data', ['stats'])
  },
  watch: {
    filter: {
      handler() {
        console.log('chart filter changed, updating list provider...');
        this.getStats();
      },
      deep:true
    },
    stats() {
      this.prepareData();
    },
    isVisible() {
      if(this.isVisible && this.renderWaiting) {
        console.log('Running delayed render');
        this.renderChart(this.renderWaiting, this.options);
        this.renderWaiting = null;
      }
    }
  },
  methods: {
    async getStats() {
      // get trait info
      if(!this.trait) {
        return;
      }
        this.$emit('update:loading', true);
        var trait = await this.$store.dispatch(`traits/get`,{id: this.trait });
        this.traitDetail = trait;
        var type = null;
        this.traitDataType = trait.dataType.name.toLowerCase();
        switch (this.traitDataType) {
          case 'percentage':
            type = 'hist-percent';
            break;
          case 'categorical':
          case 'character':
          case 'binary':
            type = 'hist-category';
            break;
          case 'integer':
            type = 'hist-int';
            break;
          case 'real number':
            type = 'hist-real';
            break;
        }
        this.$store.dispatch('data/stats', { filter: this.filter, type});
    },
    prepareData() {
      // switch based on the type, create bins or assign to bins
        var r = this.stats;
        var bins = [];
        var binsData = [];
        switch (this.traitDataType) {
          case 'binary':
            bins = ['no', 'yes'];
            binData.push(0);
            binData.push(0);
            r.items.forEach((i) => { binData[i.bin] = i.count });
            break;
          case 'percentage':
            bins = ['<0.1', '<0.2', '<0.3', '<0.4', '<0.5', '<0.6', '<0.7', '<0.8', '<0.9', '>=0.9'];
            bins.forEach((i) => binsData.push(0));
            r.items.forEach((i) => { binData[i.bin] = i.count });
            break;
          case 'categorical':
            bins = (this.traitDetail.standard || 'error').split(';');
            bins.forEach((i) => binsData.push(0));
            r.items.forEach((i) => binsData[bins.findIndex((e) => e == i.bin)] = i.count);
            break;
          case 'character':
            r.items.forEach((i) => { bins.push(i.bin); binsData.push(i.count) });
            break;
          case 'integer':
          case 'real number':
          if(r.items.length == 0) {
            bins.push('No data');
            binsData.push(0);
          } else {
            var start = r.min;
            var end = r.min;
            var isLast = false;
            do {
              start = end;
              end = Math.min(start + r.binSize, r.max);
              isLast = Math.abs(end - r.max) < 0.00001;
              bins.push(`[${start.toFixed(3)},${(end).toFixed(3)}${isLast ? ']' : ')'}`);
              var bin = r.items.find(e => {
                //console.log(`bin ${e.bin} start ${start}`);
                return Math.abs(e.bin - start) < 0.00001
              });
              console.log(`Selected bin: ${bin}`);
              binsData.push(bin ? bin.count : 0);
            } while(!isLast);
          }
          break;    
      }
      console.dir(binsData);
      var d = {
        labels: bins,
        datasets: [{label: this.traitDetail.name, backgroundColor: this.$vuetify.theme.themes.light.primary, data: binsData}]
      }
      console.dir(d);
      console.log('rendering chart...');
      this.$emit('update:loading', false);
      if(!this.isVisible) {
        console.log('Chart is not visible, delaying render');
        this.renderWaiting = d;  
      } else {
        this.renderChart(d, this.options);
      }
    }
  },
  created () {

  },
  mounted () {
    this.getStats();
  }
}
</script>
<style scoped>

</style>
