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
      from: {
        type: String,
        default: 'from'
      },
      to: {
        type: String,
        default: 'to'
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
      return [
        ...Object.keys(colorMap).map(key => ({
          [this.axes.from]: key,
          color: colorMap[key]
        })),
        ...this.dataset
      ]
    }
  },
  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4charts.ChordDiagram)

    // colors of main characters
    chart.colors.saturation = 0.45
    chart.colors.step = 3

    chart.data = this.chartData

    chart.dataFields.fromName = this.axes.from
    chart.dataFields.toName = this.axes.to
    chart.dataFields.value = this.axes.value

    chart.nodePadding = 0.5
    chart.minNodeSize = 0.01
    chart.startAngle = 80
    chart.endAngle = chart.startAngle + 360
    chart.sortBy = this.axes.from
    chart.fontSize = 14

    const nodeTemplate = chart.nodes.template
    nodeTemplate.readerTitle = 'Click to show/hide or drag to rearrange'
    nodeTemplate.showSystemTooltip = true
    nodeTemplate.propertyFields.fill = 'color'
    nodeTemplate.tooltipText = `tweets from {name}: {total} {percent}`

    // when rolled over the node, make all the links rolled-over
    nodeTemplate.events.on('over', event => {
      const node = event.target
      node.outgoingDataItems.each(dataItem => {
        if (dataItem.toNode) {
          dataItem.link.isHover = true
          dataItem.toNode.label.isHover = true
        }
      })
      node.incomingDataItems.each(dataItem => {
        if (dataItem.fromNode) {
          dataItem.link.isHover = true
          dataItem.fromNode.label.isHover = true
        }
      })
      node.label.isHover = true
    })

    // when rolled out from the node, make all the links rolled-out
    nodeTemplate.events.on('out', event => {
      const node = event.target
      node.outgoingDataItems.each(dataItem => {
        if (dataItem.toNode) {
          dataItem.link.isHover = false
          dataItem.toNode.label.isHover = false
        }
      })
      node.incomingDataItems.each(dataItem => {
        if (dataItem.fromNode) {
          dataItem.link.isHover = false
          dataItem.fromNode.label.isHover = false
        }
      })
      node.label.isHover = false
    })

    const label = nodeTemplate.label
    label.relativeRotation = 90

    label.fillOpacity = 0.4
    const labelHS = label.states.create('hover')
    labelHS.properties.fillOpacity = 1

    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer
    // this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
    nodeTemplate.adapter.add('fill', (fill, target) => {
      const node = target
      const counters = {}
      let mainChar = false
      node.incomingDataItems.each(dataItem => {
        if (colorMap[dataItem.toName]) {
          mainChar = true
        }

        if (isNaN(counters[dataItem.fromName])) {
          counters[dataItem.fromName] = dataItem.value
        } else {
          counters[dataItem.fromName] += dataItem.value
        }
      })
      if (mainChar) {
        return fill
      }

      let biggest = 0
      let biggestName

      for (const name in counters) {
        if (counters[name] > biggest) {
          biggestName = name
          biggest = counters[name]
        }
      }
      if (colorMap[biggestName]) {
        fill = colorMap[biggestName]
      }

      return fill
    })

    // link template
    const linkTemplate = chart.links.template
    linkTemplate.strokeOpacity = 0
    linkTemplate.fillOpacity = 0.15
    linkTemplate.tooltipText = '{fromName} → {toName}: {value.value} tweets'

    const hoverState = linkTemplate.states.create('hover')
    hoverState.properties.fillOpacity = 0.7
    hoverState.properties.strokeOpacity = 0.7

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
