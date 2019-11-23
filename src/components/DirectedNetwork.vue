<template>
  <div class='chart' ref='chartdiv' />
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
// import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4PluginsForcedDirected from '@amcharts/amcharts4/plugins/forceDirected'
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
  computed: {
    networkData () {
      if (this.dataset.length < 1) return []

      const splitter = '&'
      const nonZeroData = this.dataset.filter(d => d.items.length > 0)
      const network = nonZeroData.map(itemset => {
        const name = itemset.items.join(splitter)
        const value = itemset.count
        const linkWith = nonZeroData
          .filter(d => d.items.every(di => itemset.items.some(ii => ii === di)))
          .map(d => d.items.join(splitter))

        return {
          name,
          value,
          linkWith
        }
      })

      return network
    }
  },
  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4PluginsForcedDirected.ForceDirectedTree)

    const networkSeries = chart.series.push(new am4PluginsForcedDirected.ForceDirectedSeries())
    networkSeries.dataFields.linkWith = 'linkWith'
    networkSeries.dataFields.name = 'name'
    networkSeries.dataFields.id = 'name'
    networkSeries.dataFields.value = 'value'
    networkSeries.dataFields.children = 'children'

    networkSeries.nodes.template.label.text = '{name}'
    networkSeries.fontSize = 14
    networkSeries.linkWithStrength = 0

    const nodeTemplate = networkSeries.nodes.template
    nodeTemplate.tooltipText = '{name}: {value}'
    nodeTemplate.fillOpacity = 1
    nodeTemplate.label.hideOversized = true
    nodeTemplate.label.truncate = true

    const linkTemplate = networkSeries.links.template
    linkTemplate.strokeWidth = 1
    const linkHoverState = linkTemplate.states.create('hover')
    linkHoverState.properties.strokeOpacity = 1
    linkHoverState.properties.strokeWidth = 4

    nodeTemplate.events.on('over', function (event) {
      const dataItem = event.target.dataItem
      dataItem.childLinks.each(function (link) {
        link.isHover = true
      })
    })

    nodeTemplate.events.on('out', function (event) {
      const dataItem = event.target.dataItem
      dataItem.childLinks.each(function (link) {
        link.isHover = false
      })
    })

    chart.data = this.networkData

    this.chart = chart
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  watch: {
    networkData (val) {
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
