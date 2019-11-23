<template>
  <div id="app">
    <div class="progress-bar" :class="{ show: pageLoading }">
      <progress-bar />
    </div>
    <div id="nav">
      <div class="link" v-for="route in routes" :key="route.name">
        <router-link :to="route.path">
          {{ route.name }}
        </router-link>
      </div>
      <div
        class="indicator"
        :style="{ transform: `translate(${100.0 * currentRouteIndex}%, 0)` }"
      />
    </div>
    <div id="router-view">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <footer class="footer">
      <div class="contact-link-list">
        <a :href="info.github" target="_blank">
          <img src="github-icon.png" alt="github">
        </a>
        <a :href="info.twitter" target="_blank">
          <img src="twitter-icon.png" alt="twitter">
        </a>
        <a :href="info.pixiv" target="_blank">
          <img src="pixiv-icon.png" alt="pixiv">
        </a>
      </div>
      <p>
        Made by
        <a :href="info.url" target="_blank">Miksin</a>,
        {{ info.updatedTime }}
      </p>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProgressBar from './components/ProgressBar'

export default {
  components: {
    ProgressBar
  },
  computed: {
    ...mapState([
      'doc',
      'info',
      'pageLoading'
    ]),
    title () {
      return this.doc.doc.title
    },
    routes () {
      return this.$router.options.routes
    },
    currentRouteIndex () {
      return this.routes.findIndex(r => r.name === this.$route.name)
    }
  },
  methods: {
    loadAllDatasets () {
      this.$store.dispatch('fetchDatasetList', {
        nameList: Object.keys(this.$store.state.datasets)
      })
    }
  },
  mounted () {
    document.title = this.title
  },
  watch: {
    title (val) {
      document.title = val
    }
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

.font-color {
  &.danger {
    color: $danger;
  }
  &.primary {
    color: $primary;
  }
  &.ichika {
    color: $ichika;
  }
  &.nino {
    color: $nino;
  }
  &.miku {
    color: $miku;
  }
  &.yotsuba {
    color: $yotsuba;
  }
  &.itsuki {
    color: $itsuki;
  }
}

#app {
  font-family: 'Noto Sans TC', 'Noto Sans JP', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  $link-num: 3;
  $link-width: percentage(1 / $link-num);

  position: relative;
  margin: 4px auto;
  max-width: $mobile;
  @include flex(row, nowrap);

  .indicator {
    position: absolute;
    width: $link-width;
    bottom: 0;
    height: 2px;
    background: $success;
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: 0.3s;
  }

  .link {
    cursor: pointer;
    width: $link-width;
    flex-grow: 1;
    padding: 0;

    &:hover {
      background-color: $lightgrey;
    }

    a {
      display: block;
      font-weight: bold;
      font-size: 16px;
      line-height: 30px;
      text-decoration: none;
      color: $primary;
      width: 100%;

      &.router-link-exact-active {
        color: $success;
      }
    }
  }
}

#router-view {
  max-width: 1280px;
  margin: auto;
  min-height: calc(100vh - #{$footer-height});
}

.footer {
  @include flex();
  @include flex-align(space-between, center);

  width: 100%;
  min-height: $footer-height;
  background-color: $grey;
  color: $white;
  padding: 0px 12px;

  @media screen and (max-width: $mobile) {
    @include flex(column, nowrap);
    @include flex-align(center, center);
    min-height: $footer-height * 2;
  }

  .contact-link-list {
    @include flex();

    a {
      margin: auto 4px;
    }

    img {
      width: $footer-height * 0.5;
      height: $footer-height * 0.5;
    }
  }
}

.progress-bar {
  opacity: 0;
  left: 0;
  top: 0;
}

.progress-bar.show {
  opacity: 1;
}
</style>
