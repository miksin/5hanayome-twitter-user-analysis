<template>
  <div
    id="app"
    :class="{
      'font-tw': doc.lang === 'tw',
      'font-jp': doc.lang === 'jp',
    }"
  >
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
      <button class="lang-btn" @click="handleOpenMenu">
        <img src="lang-icon.svg" alt="language">
      </button>
      <p class="copyright">
        Made by
        <a :href="info.url" target="_blank">Miksin</a>,
        {{ info.updatedTime }}
      </p>
      <div class="contact-link-list">
        <p>Contact: </p>
        <a :href="info.github" target="_blank">
          <img src="github-icon.png" alt="github">
        </a>
        <a :href="info.twitter" target="_blank">
          <img src="twitter-icon.png" alt="twitter">
        </a>
      </div>
    </footer>
    <MenuList
      v-show="menu.active"
      :items="docList"
      :pos="menu.pos"
      @select-item="handleSelectLanguage"
      @close="menu.active = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProgressBar from './components/ProgressBar'
import MenuList from './components/MenuList'

export default {
  components: {
    ProgressBar,
    MenuList
  },
  data () {
    return {
      menu: {
        active: false,
        pos: { x: 0, y: 0 }
      }
    }
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
    },
    docList () {
      const { docList } = this.$store.state
      return Object.keys(docList).map(key => ({
        ...docList[key],
        key,
        disabled: this.doc.lang === key
      }))
    }
  },
  methods: {
    loadAllDatasets () {
      this.$store.dispatch('fetchDatasetList', {
        nameList: Object.keys(this.$store.state.datasets)
      })
    },
    handleOpenMenu (e) {
      const pos = {
        x: e.clientX,
        y: e.clientY
      }
      this.menu = {
        active: true,
        pos
      }
    },
    handleSelectLanguage (lang) {
      if (lang !== this.doc.lang) {
        this.$store.commit('setLang', { lang })
      }
      this.menu.active = false
    }
  },
  mounted () {
    if (window.navigator.language) {
      for (let i = 0; i < this.docList.length; i++) {
        const doc = this.docList[i]
        for (let j = 0; j < doc.identifier.length; j++) {
          if (window.navigator.language.indexOf(doc.identifier[j]) !== -1) {
            this.handleSelectLanguage(doc.key)
          }
        }
      }
    }

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
  font-family: 'Avenir', Helvetica, Arial, sans-serif, 'Noto Sans TC', 'Noto Sans JP';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  &.font-tw {
    font-family: 'Noto Sans TC', 'Avenir', Helvetica, Arial, sans-serif;
  }

  &.font-jp {
    font-family: 'Noto Sans JP', 'Avenir', Helvetica, Arial, sans-serif;
  }
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
  @include flex-align(flex-start, center);

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

  .copyright {
    flex-grow: 1;
    text-align: left;
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

  .lang-btn {
    cursor: pointer;
    @include flex();
    @include flex-align();
    width: $footer-height * 0.7;
    height: $footer-height * 0.7;
    background-color: inherit;
    outline: none;
    border-style: none;
    border-radius: 50%;
    margin: auto 8px;

    &:hover {
      box-shadow: 0px 0px 0px 1px rgba($color: $white, $alpha: 1.0);
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
