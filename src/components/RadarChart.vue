<script>
import _ from 'lodash'
import { Radar } from 'vue-chartjs'
import { colorMap, rgbaColorMap } from '../utils/constant'

export default {
  extends: Radar,
  props: {
    dataset: Array,
    axes: {
      category: String,
      value: String,
      series: String
    }
  },
  computed: {
    categories () {
      return _.uniq(this.dataset.map(d => d[this.axes.category]))
    },
    series () {
      return _.uniq(this.dataset.map(d => d[this.axes.series]))
    },
    chartData () {
      const categories = this.categories
      const backgroundColors = rgbaColorMap(0.2)
      return {
        labels: categories,
        datasets: this.series.map(s => {
          const dataPoints = categories
            .map(c => this.dataset.find(d => d[this.axes.category] === c && d[this.axes.series] === s)[this.axes.value])

          return {
            backgroundColor: backgroundColors[s],
            borderColor: colorMap[s],
            borderWidth: 2,
            data: dataPoints,
            label: s
          }
        })
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false
    })
  },
  watch: {
    chartData (val) {
      this.renderChart(val, {
        responsive: true,
        maintainAspectRatio: false
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
