<template>
  <div class="chart" ref="chartdiv" />
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

am4core.useTheme(am4themesAnimated)

export default {
  props: {
    dataset: Array
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4charts.SankeyDiagram)
    chart.hiddenState.properties.opacity = 0
    chart.data = this.dataset

    const hoverState = chart.links.template.states.create('hover')
    hoverState.properties.fillOpacity = 0.6

    chart.dataFields.fromName = 'from'
    chart.dataFields.toName = 'to'
    chart.dataFields.value = 'value'

    chart.links.template.propertyFields.id = 'id'
    chart.links.template.colorMode = 'solid'
    chart.links.template.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground')
    chart.links.template.fillOpacity = 0.1
    chart.links.template.tooltipText = ''

    // highlight all links with the same id beginning
    chart.links.template.events.on('over', event => {
      const link = event.target
      const id = link.id.split('-')[0]

      chart.links.each(link => {
        if (link.id.indexOf(id) !== -1) {
          link.isHover = true
        }
      })
    })

    chart.links.template.events.on('out', event => {
      chart.links.each(link => {
        link.isHover = false
      })
    })

    // for right-most label to fit
    chart.paddingRight = 30

    // make nodes draggable
    const nodeTemplate = chart.nodes.template
    nodeTemplate.inert = true
    nodeTemplate.readerTitle = 'Drag me!'
    nodeTemplate.showSystemTooltip = true
    nodeTemplate.width = 20

    // make nodes draggable
    nodeTemplate.readerTitle = 'Click to show/hide or drag to rearrange'
    nodeTemplate.showSystemTooltip = true
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

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
    }
  }
}
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 700px;
}
</style>
