<template>
  <div class="chart" ref="chartdiv" />
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { colorMap } from '@/utils/constant'

am4core.useTheme(am4themesAnimated)

export default {
  props: {
    dataset: Array,
    axes: {
      category: String,
      value: String
    }
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    chartData () {
      return this.dataset.map(d => {
        if (Object.prototype.hasOwnProperty.call(colorMap, d.partisan)) {
          return {
            ...d,
            color: am4core.color(colorMap[d.partisan])
          }
        }
        return d
      })
    }
  },
  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart)

    const pieSeries = chart.series.push(new am4charts.PieSeries())
    pieSeries.dataFields.category = this.axes.category
    pieSeries.dataFields.value = this.axes.value

    pieSeries.slices.template.propertyFields.fill = 'color'
    pieSeries.slices.template.stroke = am4core.color('#fff')
    pieSeries.slices.template.strokeWidth = 2
    pieSeries.slices.template.strokeOpacity = 1
    pieSeries.slices.template.cursorOverStyle = [
      {
        property: 'cursor',
        value: 'pointer'
      }
    ]

    pieSeries.alignLabels = false
    pieSeries.labels.template.bent = true
    pieSeries.labels.template.radius = 3
    pieSeries.labels.template.padding(0, 0, 0, 0)

    const shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter())
    shadow.opacity = 0

    const hoverState = pieSeries.slices.template.states.getKey('hover')

    const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter())
    hoverShadow.opacity = 0.7
    hoverShadow.blur = 5

    chart.legend = new am4charts.Legend()

    chart.data = this.chartData
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
