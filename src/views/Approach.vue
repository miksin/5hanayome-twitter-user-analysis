<template>
  <div class="approach">
    <h1>Approach</h1>
    <article v-html="content"></article>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { interpolate } from '../docs/preprocess'

export default {
  computed: {
    ...mapState([
      'doc',
      'info'
    ]),
    ...mapGetters([
      'followerNum'
    ]),
    content () {
      return interpolate(this.doc.doc.approach, {
        followers: this.followerNum,
        updatedTime: this.info.updatedTime
      })
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
.approach {
  margin: 34px auto;

  article {
    padding: 12px;
    text-align: left;
  }
}
</style>
