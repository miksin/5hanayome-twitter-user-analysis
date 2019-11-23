<template>
  <div class="dashboard">
    <div class="focus-switcher">
      <div
        v-for="f in focusList"
        :key="f.key"
        :class="{ active: focus === f.key }"
        @click="handleSwitchFocus(f.key)"
      >
        <p>
          {{ f.name }}
        </p>
      </div>
    </div>
    <div
      v-for="f in focusList"
      :key="f.key"
      v-show="focus === f.key"
      class="chart-list"
    >
      <Paper
        v-for="chart in chartList(f.key)"
        :key="chart.key"
        :title="chart.title"
        :description="chart.description"
        :loading="chart.data.length < 1"
      >
        <component
          :is="chart.component"
          :dataset="chart.data"
          :axes="chart.axes"
          :styles="chart.styles || {}"
        />
      </Paper>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Paper from '@/components/Paper.vue'
import PieChart from '@/components/PieChart.vue'
import ColumnChart from '@/components/ColumnChart.vue'
import RadarChart from '@/components/RadarChart.vue'
import ChordChart from '@/components/ChordChart.vue'
import WordCloud from '@/components/WordCloud.vue'
import GroupedBarChart from '@/components/GroupedBarChart.vue'
import { characterNameMap } from '../utils/constant'
import { interpolate } from '../docs/preprocess'

export default {
  data () {
    return {
      focus: null
    }
  },
  computed: {
    ...mapState([
      'datasets',
      'doc'
    ]),
    ...mapGetters([
      'fivePartisanDistribution',
      'portionInFivePartisan',
      'rankInFivePartisan',
      'fivePartisanBehavior',
      'onePartisanBehavior',
      'entireBehavior',
      'partisanAvgBehavior',
      'patternCount',
      'onePartisanPatternCount',
      'mergedLocation'
    ]),
    focusList () {
      return [
        {
          key: null,
          name: '整體'
        },
        {
          key: '1',
          name: characterNameMap['1']
        },
        {
          key: '2',
          name: characterNameMap['2']
        },
        {
          key: '3',
          name: characterNameMap['3']
        },
        {
          key: '4',
          name: characterNameMap['4']
        },
        {
          key: '5',
          name: characterNameMap['5']
        }
      ]
    },
    chartList () {
      const { chartInfo } = this.doc.doc

      return key => {
        if (key === null) {
          const chartList = [
            {
              key: 'distribution-five',
              data: this.fivePartisanDistribution,
              axes: {
                category: 'partisan',
                value: 'count'
              },
              component: PieChart
            },
            {
              key: 'distribution-all',
              data: this.datasets.partisanDistribution,
              axes: {
                category: 'partisan',
                value: 'count'
              },
              component: PieChart
            },
            {
              key: 'behavior-entire',
              data: this.entireBehavior,
              axes: {
                category: 'target',
                value: 'sum'
              },
              component: ColumnChart
            },
            {
              key: 'behavior-five',
              data: this.fivePartisanBehavior,
              axes: {
                category: 'target',
                value: 'sum',
                series: 'partisan'
              },
              styles: {
                height: window.innerWidth < 768 ? `${window.innerWidth}px` : '500px',
                position: 'relative'
              },
              component: RadarChart
            },
            {
              key: 'behavior-five-chord',
              data: this.fivePartisanBehavior,
              axes: {
                from: 'partisan',
                to: 'target',
                value: 'sum'
              },
              component: ChordChart
            },
            {
              key: 'mentioned-users',
              data: this.datasets.mentionedUsers,
              axes: {
                category: 'target',
                value: 'count'
              },
              component: ColumnChart
            },
            {
              key: 'locations',
              data: this.mergedLocation,
              axes: {
                word: 'loc',
                value: 'count'
              },
              component: WordCloud
            },
            {
              key: 'user-pattern',
              data: this.patternCount,
              axes: {
                category: 'pattern',
                value: 'userCount'
              },
              component: ColumnChart
            }
          ]

          return chartList.map(chart => ({
            ...chart,
            title: chartInfo[chart.key].title,
            description: chartInfo[chart.key].description
          }))
        }

        const patternCount = this.onePartisanPatternCount(key)
        const portion = this.portionInFivePartisan(key).toFixed(2)
        const rank = this.rankInFivePartisan(key)
        const behavior = this.onePartisanBehavior(key)
        const avgBehavior = this.partisanAvgBehavior
        const name = characterNameMap[key]

        return [
          {
            key: 'user-pattern-partisan',
            title: interpolate(chartInfo['user-pattern-partisan'].title, { name }),
            data: patternCount,
            description: interpolate(chartInfo['user-pattern-partisan'].description, {
              name,
              pattern: patternCount.length > 0 ? patternCount[0].pattern : ''
            }),
            axes: {
              category: 'pattern',
              value: 'userCount'
            },
            component: ColumnChart
          },
          {
            key: 'distribution-five-partisan',
            title: interpolate(chartInfo['distribution-five-partisan'].title, { name }),
            description: interpolate(chartInfo['distribution-five-partisan'].description, {
              portion,
              rank
            }),
            data: this.fivePartisanDistribution,
            axes: {
              category: 'partisan',
              value: 'count'
            },
            component: PieChart
          },
          {
            key: 'behavior-compare-partisan',
            title: interpolate(chartInfo['behavior-compare-partisan'].title, { name }),
            description: interpolate(chartInfo['behavior-compare-partisan'].description, { name }),
            data: [...behavior, ...avgBehavior],
            axes: {
              category: 'target',
              value: 'sum',
              group: 'partisan'
            },
            component: GroupedBarChart
          }
        ]
      }
    }
  },
  components: {
    PieChart,
    ColumnChart,
    RadarChart,
    ChordChart,
    WordCloud,
    Paper
  },
  methods: {
    loadAllDatasets () {
      this.$store.dispatch('fetchDatasetList', {
        nameList: Object.keys(this.$store.state.datasets)
      })
    },
    handleSwitchFocus (key) {
      if (this.focus === key) return

      this.$store.commit('setLoading', { status: true })
      setTimeout(() => {
        this.$store.commit('setLoading', { status: false })
      }, 500)
      this.focus = key
    }
  },
  mounted () {
    this.loadAllDatasets()
  }
}
</script>

<style lang="scss" scoped>
.chart-list {
  width: 100%;
  @include flex(column, nowrap);

  // @media screen and (max-width: $mobile) {
  //   @include flex(column, nowrap);
  // }
}

.dashboard {
  @include flex(column, nowrap);
  @include flex-align();
}

.focus-switcher {
  @include flex(row, wrap);
  @include flex-align();
  margin: 24px auto;

  div {
    @include flex();
    @include flex-align();
    background-color: $lightgrey;
    color: $grey;
    width: 100px;
    height: 100px;
    margin: 4px;
    cursor: pointer;
    border-width: 2px;
    border-style: solid;
    border-color: transparent;

    &:hover {
      border-color: $danger;
    }

    &.active {
      background-color: $danger;
      color: $white;
      cursor: default;
    }
  }
}
</style>
