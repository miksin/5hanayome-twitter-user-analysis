<template>
  <div class="container" :style="styles">
    <div class="content" :style="{ flexGrow: grow }">
      <slot v-if="!loading"></slot>
      <div
        class="cover"
        :class="{ hide: !loading && display }"
      >
        <loader />
      </div>
    </div>
    <div class="info">
      <h1 class="title" v-html="title">
      </h1>
      <h2 class="description" v-html="description">
      </h2>
    </div>
  </div>
</template>

<script>
import Loader from './Loader.vue'

export default {
  components: {
    Loader
  },
  props: {
    grow: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      display: false
    }
  },
  mounted () {
    const delay = 500
    setTimeout(() => {
      this.display = true
    }, delay)
  }
}
</script>

<style lang="scss" scoped>
.container {
  @include flex();
  @include flex-align();

  min-height: 500px;
  padding: 10px;
  margin: 8px 8px;
  box-shadow: 0px 5px 15px -1px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media screen and (max-width: $mobile) {
    @include flex(column);
    padding: 4px;
    margin: 8px 0px;
  }
}

.title {
  color: $grey;
  font-size: 24px;
}

.description {
  color: $grey;
  font-size: 20px;
}

.content {
  margin: auto;
  position: relative;
  width: 100%;
}

.info {
  flex-grow: 1;
  min-width: 300px;
}

.cover {
  @include flex();
  @include flex-align();

  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition-property: opacity;
  transition-delay: 0.5s;
  opacity: 1;
  background-color: $white;
}

.cover.hide {
  opacity: 0;
  pointer-events: none;
}
</style>
