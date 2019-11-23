<template>
  <div class='chart' ref='chartdiv' />
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4pluginsWordCloud from '@amcharts/amcharts4/plugins/wordCloud'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

am4core.useTheme(am4themesAnimated)

export default {
  props: {
    dataset: Array,
    axes: {
      word: {
        type: String,
        default: 'word'
      },
      value: {
        type: String,
        default: 'value'
      }
    }
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    chartData () {
      return this.dataset
    }
  },
  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4pluginsWordCloud.WordCloud)
    const series = chart.series.push(new am4pluginsWordCloud.WordCloudSeries())
    series.data = this.chartData

    series.dataFields.word = this.axes.word
    series.dataFields.value = this.axes.value

    series.colors = new am4core.ColorSet()
    series.colors.passOptions = {}

    series.labels.template.tooltipText = '{word}\n{value}'

    this.chart = chart
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  watch: {
    chartData (val) {
      if (this.chart) {
        this.chart.data = val
      }
    }
  }
}
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 500px;
}
</style>
