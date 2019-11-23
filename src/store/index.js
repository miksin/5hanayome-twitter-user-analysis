import Vue from 'vue'
import Vuex from 'vuex'
import { info } from '../utils/constant'
import twDoc from '../docs/tw'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    datasets: {
      partisanDistribution: [],
      behaviorByPartisan: [],
      adjacentBehaviors: [],
      frequentItemsets: [],
      locations: [],
      mentionedUsers: []
    },
    info,
    pageLoading: false,
    doc: {
      lang: 'tw',
      doc: twDoc
    }
  },
  getters: {
    followerNum (state) {
      return state.datasets.partisanDistribution
        .map(d => d.count)
        .reduce((a, b) => a + b, 0)
    },
    fivePartisanDistribution (state) {
      return state.datasets.partisanDistribution.filter(d => {
        const partisan = parseInt(d.partisan)
        return partisan >= 1 && partisan <= 5
      })
    },
    portionInFivePartisan (state, getters) {
      return partisan => {
        const sum = getters.fivePartisanDistribution
          .map(d => d.count)
          .reduce((a, b) => a + b, 0)
        const target = getters.fivePartisanDistribution
          .find(d => d.partisan === partisan)?.count
        return target ? parseFloat(target) / sum * 100 : 0.0
      }
    },
    rankInFivePartisan (state, getters) {
      const nameList = ['1st', '2nd', '3rd', '4th', '5th']

      return partisan => {
        const orderedList = getters.fivePartisanDistribution
          .slice().sort((a, b) => b.count - a.count)
        const index = orderedList.findIndex(d => d.partisan === partisan)
        return nameList[index] ?? ''
      }
    },
    fivePartisanBehavior (state) {
      return state.datasets.behaviorByPartisan.filter(d => {
        const partisan = parseInt(d.partisan)
        return partisan >= 1 && partisan <= 5
      })
    },
    onePartisanBehavior (state) {
      return partisan => {
        return state.datasets.behaviorByPartisan.filter(d => d.partisan === partisan)
      }
    },
    partisanAvgBehavior (state, getters) {
      if (state.datasets.behaviorByPartisan.length < 1) return []
      const result = []
      for (let t = 1; t <= 5; t++) {
        let sum = 0.0
        for (let p = 1; p <= 5; p++) {
          const record = state.datasets.behaviorByPartisan
            .find(d => d.partisan === `${p}` && d.target === `${t}`)
          const weight = getters.portionInFivePartisan(`${p}`) / 100.0
          sum += record.sum * weight
        }

        result.push({
          partisan: 'avg',
          target: `${t}`,
          sum: sum.toFixed(2)
        })
      }
      return result
    },
    entireBehavior (state) {
      const count = {}
      state.datasets.behaviorByPartisan.forEach(d => {
        if (!Object.prototype.hasOwnProperty.call(count, d.target)) {
          count[d.target] = 0
        }
        count[d.target] += d.sum
      })
      return Object.keys(count).map(key => ({
        target: key,
        sum: count[key]
      }))
    },
    patternCount (state) {
      return state.datasets.frequentItemsets
        .filter(d => d.items.length > 0)
        .map(d => ({
          pattern: d.items.join('+'),
          userCount: d.count
        }))
        .sort((a, b) => b.userCount - a.userCount)
    },
    onePartisanPatternCount (state, getters) {
      return key =>
        getters.patternCount.filter(d => d.pattern.indexOf(key) !== -1)
    },
    mergedLocation (state) {
      const counts = {}
      state.datasets.locations.forEach(d => {
        const words = d.loc.split(/[,\s、，]/).filter(s => s.length > 0)
        words.forEach(w => {
          if (!Object.prototype.hasOwnProperty.call(counts, w)) {
            counts[w] = 0
          }
          counts[w] += d.count
        })
      })

      return Object.keys(counts).map(key => ({
        loc: key,
        count: counts[key]
      }))
    }
  },
  mutations: {
    setDataset (state, { name, dataset }) {
      state.datasets[name] = dataset
    },
    setLoading (state, { status = true }) {
      state.pageLoading = status
    }
  },
  actions: {
    async fetchDataset ({ state, commit }, { name }) {
      const base = process.env.BASE_URL
      try {
        const dataset = await fetch(`${base}/data/${name}.json`)
          .then(r => r.json())

        commit('setDataset', { name, dataset })
      } catch (error) {
      }
    },
    async fetchDatasetList ({ state, dispatch }, {
      nameList,
      isSerial = true,
      onlyNecessary = true
    }) {
      const processList = onlyNecessary
        ? nameList.filter(name => state.datasets[name].length < 1)
        : nameList.slice()

      for (let i = 0; i < processList.length; i++) {
        try {
          if (isSerial) {
            await dispatch('fetchDataset', { name: processList[i] })
          } else {
            dispatch('fetchDataset', { name: processList[i] })
          }
        } catch {}
      }
    }
  },
  modules: {
  }
})
