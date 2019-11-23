<template functional>
  <div class="wrapper">
    <div class="tube"></div>
    <div class="item"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
$item-ratio: 1 / 2;

@mixin extend($width: 100%) {
  position: absolute;
  width: $width;
  height: 100%;
}

.wrapper {
  width: 100%;
  height: 5px;
  left: 0;
  top: 0;
  margin: 0;
  position: relative;
  overflow: hidden;
}

.tube {
  @include extend();
  background-color: $danger;
  opacity: 0.3;
}

.item {
  @include extend(percentage($item-ratio));
  background-color: $danger;
  opacity: 1.0;
  animation-name: movement;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes movement {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(percentage(2 + 1 / $item-ratio));
  }
}
</style>
