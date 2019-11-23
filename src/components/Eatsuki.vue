<template>
  <div style="--aspect-ratio:3/1;" class="eatsuki-container">
    <div class="food-orbit">
      <div class="food"><img src="assets/burger.svg" alt=""></div>
      <div class="food"><img src="assets/cola.svg" alt=""></div>
      <div class="food"><img src="assets/subway.svg" alt=""></div>
      <div class="food"><img src="assets/drink.svg" alt=""></div>
    </div>
    <div style="width: 33%" class="eatsuki-top">
      <div style="--aspect-ratio:1;" class="eatsuki-body-box">
        <div class="eatsuki-body body-top">
          <div></div>
        </div>
        <div class="eatsuki-body body-bot">
          <div></div>
        </div>
        <div class="eatsuki-star">
          <img style="width: 100%" src="assets/star.svg" alt="" />
        </div>
        <div class="eatsuki-ahoge">
          <img style="width: 100%" src="assets/ahoge.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
[style*="--aspect-ratio"] > :first-child {
  width: 100%;
}
[style*="--aspect-ratio"] > img {
  height: auto;
}
@supports (--custom:property) {
  [style*="--aspect-ratio"] {
    position: relative;
    width: 100%;
  }
  [style*="--aspect-ratio"]::before {
    content: "";
    display: block;
    padding-bottom: calc(100% / (var(--aspect-ratio)));
  }
  [style*="--aspect-ratio"] > :first-child {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
}

.eatsuki-container {
  margin-top: 10%;
}

.eatsuki-top {
  left: 0;
  top: 0;
  position: absolute;
}

.eatsuki-body-box {
  left: 0;
  top: 0;
}

.eatsuki-body {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.eatsuki-body.body-top {
  border-radius: 50% 50% 0 0;
  animation: eat-top 0.5s linear 0s infinite alternate;
}

.eatsuki-body.body-bot {
  border-radius: 0 0 50% 50%;
  animation: eat-bot 0.5s linear 0s infinite alternate;
}

.eatsuki-body > div {
  left: 0;
  position: absolute;
  width: 100%;
  height: 50%;
  background-color: $itsuki;
}

.eatsuki-body.body-top > div {
  top: 0;
}

.eatsuki-body.body-bot > div {
  top: 50%;
}

.eatsuki-star {
  position: absolute;
  left: 20%;
  top: 20%;
  width: 20%;
  height: 20%;
}

.eatsuki-ahoge {
  position: absolute;
  left: 40%;
  top: -35%;
  width: 50%;
  height: 50%;
  transform: translate(0) rotate(-45deg);
  animation: ahoge-shake 0.5s linear 0s infinite alternate;
}

@keyframes eat-top {
  0% { transform: rotate(-1deg); }
  100% { transform: rotate(-45deg); }
}

@keyframes eat-bot {
  0% { transform: rotate(1deg); }
  100% { transform: rotate(45deg); }
}

@keyframes ahoge-shake {
  0% { transform: translate(0) rotate(-45deg); }
  100% { transform: translate(0,10%) rotate(-45deg); }
}

.food-orbit {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.food {
  position: absolute;
  left: 0;
  top: 20%;
  width: 20%;
  transform: translate(500%,0);
}

.food > img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.food:nth-child(1) {
  animation: food-submit 1s linear 0s infinite forwards;
}

.food:nth-child(2) {
  animation: food-submit 1s linear 0.25s infinite forwards;
}

.food:nth-child(3) {
  animation: food-submit 1s linear 0.5s infinite forwards;
}

.food:nth-child(4) {
  animation: food-submit 1s linear 0.75s infinite forwards;
}

@-webkit-keyframes food-submit {
  0% { transform: translate(500%,0); }
  100% { transform: translate(0,0); }
}

@keyframes food-submit {
  0% { transform: translate(500%,0); }
  100% { transform: translate(0,0); }
}
</style>
