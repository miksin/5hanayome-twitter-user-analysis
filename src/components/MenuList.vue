<template>
  <div class="wrapper" @click.stop="$emit('close')">
    <div
      class="menu-list"
      :style="{
        'transform': `translate(${showPos.x}px, ${showPos.y}px)`
      }"
      ref="listEl"
    >
      <div
        v-for="item in items"
        :key="item.key"
        class="menu-item"
        :class="{ disabled: item.disabled }"
        @click.stop="$emit('select-item', item.key)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    pos: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0
      })
    }
  },
  data () {
    return {
      listEl: null
    }
  },
  computed: {
    showPos () {
      if (this.listEl) {
        return {
          x: this.pos.x,
          y: this.pos.y - this.listEl.clientHeight - 10
        }
      }
      return this.pos
    }
  },
  mounted () {
    this.listEl = this.$refs.listEl
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  .menu-list {
    width: 100px;
    left: 0;
    top: 0;
    @include flex(column, nowrap);
    @include flex-align();
    background-color: $white;
    box-shadow: 1px 1px 5px 0px rgba($color: $grey, $alpha: 0.3);
  }

  .menu-item {
    cursor: pointer;
    padding: 4px 0;
    width: 100%;
    text-align: center;

    &:hover {
      background-color: $grey;
      color: $white;
    }

    &.disabled {
      cursor: default;
    }
    &.disabled:hover {
      background-color: inherit;
      color: inherit;
    }
  }
}
</style>
