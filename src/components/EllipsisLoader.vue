<template>
  <div class="ellipsis-container ar-container">
  <div class="ellipsis">
    <div class="ellipsis-dot ichika"><img src="assets/studpierce.svg" alt="" /></div>
    <div class="ellipsis-dot nino" ><img src="assets/hairacc.svg" alt="" /></div>
    <div class="ellipsis-dot miku"><img src="assets/earphone.svg" alt="" /></div>
    <div class="ellipsis-dot yotsuba"><img src="assets/ribbon.svg" alt="" /></div>
    <div class="ellipsis-dot itsuki"><img src="assets/star.svg" alt="" /></div>
  </div>
</div>
</template>

<style>
.ar-container {
  position: relative;
  width: 100%;
  margin: auto;
}

.ar-container::before {
  float: left;
  content: "";
  height: 0;
}

.ar-container::after {
  content: "";
  display: table;
  clear: both;
}

.ellipsis-container {
  padding-top: 20%;
}

.ellipsis {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.ellipsis-dot::before {
  content: "";
  display: block;
  padding-top: 100%;
}

.ellipsis-dot {
  display: flex;
  width: 12%;
  padding: 2%;
  margin: 0 auto;
  border-radius: 50%;
  position: relative;
  transform-origin: center;
}

.ellipsis-dot > img {
  width: 100%;
  height: 100%;
}

.ellipsis-dot.ichika {
  animation: bounce 3s ease-in-out 0s infinite forwards;
  background-color: #FCDD51;
}

.ellipsis-dot.nino {
  animation: bounce 3s ease-in-out 0.2s infinite forwards;
  background-color: #C6ABD4;
}

.ellipsis-dot.miku {
  animation: bounce 3s ease-in-out 0.4s infinite forwards;
  background-color: #95C1E6;
}

.ellipsis-dot.yotsuba {
  animation: bounce 3s ease-in-out 0.6s infinite forwards;
  background-color: #A5CD6C;
}

.ellipsis-dot.itsuki {
  animation: bounce 3s ease-in-out 0.8s infinite forwards;
  background-color: #EE8893;
}

@-webkit-keyframes zoom {
  0% { transform: scale(1); }
  100% { transform: scale(2); }
}

@keyframes zoom {
  0% { transform: scale(1); }
  100% { transform: scale(2); }
}

@-webkit-keyframes bounce {
  0%, 40%, 100% { transform: translate(0, 0) scale(1); }
  20% { transform: translate(0, 0) scale(1.5); }
}

@keyframes bounce {
  0%, 40%, 100% { transform: translate(0, 0) scale(1); }
  20% { transform: translate(0, 0) scale(1.5); }
}
</style>
