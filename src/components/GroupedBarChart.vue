<template>
  <div>
    <Bar
      ref="chart"
      :style="{
        position: 'relative',
        width: '100%',
        height: '100%'
      }"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { Bar } from 'vue-chartjs'
import { colorMap, rgbaColorMap } from '../utils/constant'

export default {
  components: {
    Bar
  },
  props: {
    dataset: {
      type: Array,
      default: () => []
    },
    axes: {
      category: {
        type: String,
        default: 'category'
      },
      value: {
        type: String,
        default: 'value'
      },
      group: {
        type: String,
        default: 'group'
      }
    },
    options: {
      type: Object,
      default: () => ({
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      })
    }
  },
  computed: {
    groups () {
      return _.uniq(this.dataset.map(d => d[this.axes.group]))
    },
    categories () {
      return _.uniq(this.dataset.map(d => d[this.axes.category]))
    },
    chartData () {
      const backgroundColors = rgbaColorMap(0.5)

      return {
        labels: this.categories,
        datasets: this.groups.map(group => ({
          label: group,
          backgroundColor: backgroundColors[group],
          borderColor: colorMap[group],
          borderWidth: 1,
          data: this.categories.map(c => this.dataset.find(d =>
            d[this.axes.category] === c && d[this.axes.group] === group)[this.axes.value])
        }))
      }
    }
  },
  mounted () {
    this.$refs.chart.renderChart(this.chartData, this.options)
  },
  watch: {
    chartData (val) {
      this.$refs.chart.renderChart(val, this.options)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
