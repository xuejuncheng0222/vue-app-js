<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)

const cssColor = ref('red')

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
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
    <div class="scss-f">
      测试SASS
      <div class="scss-c">测试SASS子元素</div>
    </div>
    <div v-if="true" class="scss-c" :c="1">对照SASS</div>
    <div class="use-var">-------------使用SASS变量------------</div>
    <div class="mixin-box">使用mixin</div>
    <div class="extend-test">----嵌入 (@extend)------</div>
    <div class="test" @click="cssColor = getRandomColor()">测试css@if@else</div>
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
