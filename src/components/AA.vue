<script setup>
import { ref } from 'vue'
import { register } from '@/api/login/login.js'
import SlideVerification from './SlideVerification.vue'

defineProps({
  msg: String,
})

const cssColor = ref('red')

register()

function getRandomColor() {
  console.log(1)
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
</script>

<template>
  <div :style="{ backgroundColor: cssColor }">
    <h1>{{ msg }}</h1>

    <div class="test" @click="cssColor = getRandomColor()">测试css@if@else</div>
    <SlideVerification />
  </div>
</template>

<style scoped lang="scss">
.extend-m {
  color: red;
  font-size: 30px;
  font-weight: bold;
}

.extend-test {
  @extend .extend-m;
}

.read-the-docs {
  color: #888;
}

.scss-f {
  .scss-c {
    color: red;
  }
}

.use-var {
  color: $xue-color;
}

.mixin-box {
  height: 100px;
  width: 100px;
  background-color: $xue-color;
  @include border-radius(50%);
}
</style>
