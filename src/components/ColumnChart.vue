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
    category () {
      return this.axes?.category
    },
    value () {
      return this.axes?.value
    }
  },
  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    chart.scrollbarX = new am4core.Scrollbar()

    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    categoryAxis.dataFields.category = this.category
    categoryAxis.renderer.grid.template.location = 0
    categoryAxis.renderer.minGridDistance = 30
    categoryAxis.renderer.labels.template.horizontalCenter = 'right'
    categoryAxis.renderer.labels.template.verticalCenter = 'middle'
    categoryAxis.renderer.labels.template.rotation = 270
    categoryAxis.tooltip.disabled = false
    categoryAxis.renderer.minHeight = 110
    categoryAxis.title.text = this.category

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.renderer.minWidth = 50
    valueAxis.min = 0
    valueAxis.title.text = this.value

    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries())
    series.sequencedInterpolation = true
    series.dataFields.valueY = this.value
    series.dataFields.categoryX = this.category
    series.tooltipText = `${this.category}: {categoryX}\n${this.value}: {valueY}`
    series.columns.template.strokeWidth = 0

    series.tooltip.pointerOrientation = 'vertical'

    series.columns.template.column.cornerRadiusTopLeft = 10
    series.columns.template.column.cornerRadiusTopRight = 10
    series.columns.template.column.fillOpacity = 0.8

    // on hover, make corner radiuses bigger
    const hoverState = series.columns.template.column.states.create('hover')
    hoverState.properties.cornerRadiusTopLeft = 0
    hoverState.properties.cornerRadiusTopRight = 0
    hoverState.properties.fillOpacity = 1

    series.columns.template.adapter.add('fill', function (fill, target) {
      if (Object.prototype.hasOwnProperty.call(colorMap, target.dataItem.categories.categoryX)) {
        return am4core.color(colorMap[target.dataItem.categories.categoryX])
      }
      return chart.colors.getIndex(target.dataItem.index)
    })

    // Cursor
    chart.cursor = new am4charts.XYCursor()

    chart.data = this.dataset

    this.chart = chart
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  watch: {
    dataset (val) {
      if (this.chart) {
        this.chart.data = val
      }
    },
    category (val) {
      this.chart.xAxes[0].dataFields.category = val
    },
    value (val) {
      this.chart.series[0].dataFields.valueY = val
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
