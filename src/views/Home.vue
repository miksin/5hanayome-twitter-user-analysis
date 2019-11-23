<template>
  <div class="home">
    <div class="logo">
      <component :is="randLogo.component"></component>
    </div>
    <h1 v-html="doc.doc.title"></h1>
    <p v-html="doc.doc.introduction"></p>
    <div class="examples">
      <Paper
        :title="doc.doc.chartInfo['distribution-five'].title"
        :loading="fivePartisanDistribution.length < 1"
        :styles="{ flexDirection: 'column', flexGrow: 1 }"
      >
        <PieChart
          :dataset="fivePartisanDistribution"
          :axes="{
            category: 'partisan',
            value: 'count'
          }"
        />
      </Paper>
      <div class="btn-group">
        <h2>Learn More</h2>
        <router-link
          to="/approach"
          v-slot="{ href, route, navigate, isActive, isExactActive }"
        >
          <a class="btn" :href="href" @click="navigate">Approach</a>
        </router-link>
        <router-link
          to="/dashboard"
          v-slot="{ href, route, navigate, isActive, isExactActive }"
        >
          <a class="btn" :href="href" @click="navigate">Dashboard</a>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Paper from '@/components/Paper.vue'
import PieChart from '@/components/PieChart.vue'
import Eatsuki from '@/components/Eatsuki.vue'
import EllipsisLoader from '@/components/EllipsisLoader.vue'

export default {
  name: 'home',
  components: {
    PieChart,
    Paper
  },
  data () {
    return {
      logoList: [
        {
          name: 'Eatsuki',
          component: Eatsuki
        },
        {
          name: 'EllipsisLoader',
          component: EllipsisLoader
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'datasets',
      'doc'
    ]),
    ...mapGetters([
      'fivePartisanDistribution',
      'fivePartisanBehavior',
      'entireBehavior'
    ]),
    randLogo () {
      return this.logoList[Math.floor(Math.random() * this.logoList.length)]
    }
  },
  methods: {
    fetchNecessaryDatasets () {
      const nameList = ['partisanDistribution']
      this.$store.dispatch('fetchDatasetList', { nameList })
    }
  },
  mounted () {
    this.fetchNecessaryDatasets()
  }
}
</script>

<style lang="scss" scoped>
.home {
  margin: 34px auto;
}

.logo {
  margin: 64px auto;
  width: 600px;
  @media screen and (max-width: $mobile) {
    width: 90%;
  }
}

.examples {
  @include flex(row, nowrap);

  @media screen and (max-width: $mobile) {
    @include flex(column, nowrap);
  }
}

.btn-group {
  @include flex(column);
  flex-grow: 1;
  margin: auto 0;
}

.btn {
  @include btn(contained, $primary);
  font-size: 24px;
  width: 250px;
  margin: 12px auto;
  text-decoration: none;

  @media screen and (max-width: $mobile) {
    width: 70%;
  }
}
</style>
