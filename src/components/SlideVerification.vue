<template>
  <div>
    <!-- 滑块组件 -->
    <div class="captcha">
      <!-- 图片以上提示信息刷新 -->
      <div class="captcha-title">
        <div class="title-left">{{ state.titleMsg }}</div>
        <div>
          <el-icon @click="refreshCaptcha"><Refresh /></el-icon>
          <el-icon class="close-icon" @click="onClickClose"><Close /></el-icon>
        </div>
      </div>
      <!-- 大图和小图 -->
      <div v-loading="state.loading" class="captcha-image">
        <img
          :src="state.bgImg"
          :width="state.bgW"
          :height="state.bgH"
          @mousedown="onPreventDefault($event)"
        />
        <img
          class="image-slice"
          :src="state.sliceImg"
          :style="{
            top: state.sliceY + 'px',
            left: sliceX + 'px',
            zIndex: 9999,
          }"
          @touchstart="onTouchStart($event)"
          @mousedown="onMouseDown($event)"
        />
      </div>
      <!-- 滑块 -->
      <div class="captcha-drag">
        <!-- 滑块划过div 用来展示成功还是失败的背景色 -->
        <div
          class="drag-bg"
          :style="{ width: msgBgW + 'px', backgroundColor: state.msgBgColor }"
        ></div>
        <!-- 滑块条 -->
        <div
          class="drag-text font-text"
          :style="{ color: state.msgColor }"
          @mousedown="onPreventDefault($event)"
        >
          {{ state.msg }}
        </div>
        <!-- 滑块 -->
        <div
          class="drag-div"
          :class="state.dragIcon"
          :style="{ width: state.dragW + 'px', left: state.dragLeft + 'px' }"
          @touchstart="onTouchStart($event)"
          @mousedown="onMouseDown($event)"
        ></div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="captcha-modal" @click="onClickModal"></div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { bigImg, smallImg } from './slideImg'

const emit = defineEmits(['slideVerification', 'close'])

const props = defineProps(['login']) // (token: string, sliceX: number) => Promise<unknown>

const state = reactive({
  token: '',
  loading: false,
  titleMsg: '',
  maxW: 220, // 最大滑动的距离
  bgW: 260,
  bgH: 160,
  bgImg: '',
  sliceW: 64,
  sliceY: 0,
  sliceImg: '',
  dragW: 40,
  dragLeft: 0, // 滑块滑动的左边 div 的宽度
  dragIcon: 'drag-icon',
  msg: '拖动滑块完成上方拼图',
  msgColor: '#2c3e50',
  msgBgColor: '#67c23a',
  isMoving: false,
  canMove: true, // 控制鼠标抬起之后不能移动
  beginClientX: 0, // 鼠标或者触摸开始的 X 坐标
  failNum: 0,
})

// 动态获取滑块左侧 div 的宽度
const msgBgW = computed(() => state.dragLeft)

// 进行计算是进行图片移动距离的转换
const sliceX = computed(() => (state.dragLeft / 220) * 205)

/**获取验证图片 TODO 换成调接口 */
const registerCaptcha = async () => {
  state.failNum = 0
  state.loading = true
  state.sliceImg = smallImg
  state.bgImg = bigImg
  state.token = '1234' // 换成后端返回的 token 图片标识
  state.sliceY = 13 // 后端返回的裁剪图片的Y坐标
  state.loading = false
}

/**重置验证码 */
const restoreCaptcha = () => {
  state.dragLeft = 0
  state.isMoving = false
  state.canMove = true
  state.beginClientX = 0
  // 滑块初始化
  defaultStyle()
}

/**刷新验证码 */
const refreshCaptcha = () => {
  // 重置验证码
  restoreCaptcha()
  // 重新请求图片
  registerCaptcha()
}

/**点击滑块外关闭滑块 */
const onClickModal = () => {
  if (state.canMove) {
    onClickClose()
  }
}

/**关闭验证弹窗 */
const onClickClose = () => {
  emit('close')
}

/**阻止默认行为 */
const onPreventDefault = (e) => {
  e.preventDefault()
}

/**检测鼠标按下，开始监听事件 */
const onMouseDown = (e) => {
  if (state.canMove) {
    addEventListener('mouse')
    e.preventDefault()
    state.isMoving = true
    state.beginClientX = e.clientX
  }
}

/**开始触摸屏幕 */
const onTouchStart = (e) => {
  if (state.canMove) {
    addEventListener('touch')
    e.preventDefault()
    state.isMoving = true
    state.beginClientX = e.changedTouches[0].clientX
  }
}

/**设置监听 */
const addEventListener = (type) => {
  const html = document.documentElement
  if (type === 'mouse') {
    html.addEventListener('mousemove', onMouseMove)
    html.addEventListener('mouseup', onMouseUp)
  } else {
    html.addEventListener('touchmove', onTouchMove)
    html.addEventListener('touchend', onTouchEnd)
  }
}

/**鼠标移动事件 */
const onMouseMove = (e) => {
  if (state.isMoving) {
    const width = e.clientX - state.beginClientX
    // 滑动距离的判断
    if (width > 0 && width < state.maxW) {
      state.dragLeft = width
    } else if (width >= state.maxW) {
      state.dragLeft = state.maxW
    }
  }
}

/**触摸移动监听 */
const onTouchMove = (e) => {
  if (state.isMoving) {
    const width = e.changedTouches[0].clientX - state.beginClientX
    if (width > 0 && width < state.maxW) {
      state.dragLeft = width
    } else if (width >= state.maxW) {
      state.dragLeft = state.maxW
    }
  }
}

/**鼠标抬起监听 */
const onMouseUp = () => {
  removeEventListener('mouse')
  state.canMove = false
  state.isMoving = false
  // 检测结束，调取登录接口
  checkCaptcha()
}

/**触屏结束监听 */
const onTouchEnd = () => {
  removeEventListener('touch')
  state.canMove = false
  state.isMoving = false
  // 检测结束，调取登录接口
  checkCaptcha()
}

/**移除监听 */
const removeEventListener = (type) => {
  const html = document.documentElement
  if (type === 'mouse') {
    html.removeEventListener('mousemove', onMouseMove)
    html.removeEventListener('mouseup', onMouseUp)
  } else {
    html.removeEventListener('touchmove', onTouchMove)
    html.removeEventListener('touchend', onTouchEnd)
  }
}

/**校验接口 */
const checkCaptcha = async () => {
  // 如果没有小插图则给出提示
  if (!state.sliceImg || !state.sliceY) {
    errorStyle('注册失败，请刷新验证码')
    return
  }
  try {
    const respData = await props.login(state.token, sliceX.value)
    if (respData.success) {
      successStyle()
    } else if (respData.code == '321') {
      errorStyle('验证失败，请刷新验证码')
      // 动画结束后刷新验证码
      animateCSS('.captcha', 'shake', refreshCaptcha)
    } else {
      onClickClose()
    }
  } catch (err) {
    console.info(err)
  }
}

/**初始化默认数据恢复 */
const defaultStyle = () => {
  state.dragIcon = 'drag-icon'
  state.msgBgColor = '#67c23a'
  state.msgColor = '#2c3e50'
  state.msg = '拖动滑块完成上方拼图'
  state.titleMsg = ''
}

/**调成功之后的样式 */
const successStyle = () => {
  state.dragIcon = 'drag-success-icon'
  state.msgBgColor = '#67c23a'
  state.msgColor = '#fff'
  state.msg = ''
}

/**失败之后的样式 */
const errorStyle = (errorMsg) => {
  state.dragIcon = 'drag-error-icon'
  state.msgBgColor = '#f56c6c'
  state.msgColor = '#fff'
  state.msg = ''

  state.titleMsg = errorMsg
}

/**css 动画，结束后回调函数 */
const animateCSS = (element, animationName, callback) => {
  const node = document.querySelector(element)
  if (node) {
    node.classList.add('animated', animationName)
    const handleAnimationEnd = () => {
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)
      callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }
}

// 加载组件获取验证图片
registerCaptcha()
</script>

<style scoped>
/* 遮罩层 */
.captcha-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background: #000;
}
/* 验证码 */
.captcha {
  animation-duration: 0.8s;
  position: absolute;
  top: calc(50% - 120px); /**根据位置自己配置 */
  left: calc(50% - 140px); /**根据位置自己配置 */
  z-index: 10000; /**适当调整 */
  padding: 10px 10px 12px 10px;
  border-radius: 2px;
  border: 1px solid #e4e7eb;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  overflow: hidden;
}
/* 验证提示文字 */
.captcha-title {
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #7f7f7f;
  font-size: 16px;
  padding: 0 2px;
}

.title-left {
  height: 100%;
}

.close-icon {
  margin-left: 5px;
}

/* 验证图片 */
.captcha-image {
  width: 260px;
  height: 160px;
  position: relative;
  margin: 8px 0 0 0;
}
/* 小图片滑块 */
.image-slice {
  position: absolute;
  display: block;
  cursor: pointer;
}

/* 滑动轴 */
.captcha-drag {
  margin: 10px 0 0 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
  background-color: #e8e8e8;
  text-align: center;
  border-radius: 2px;
}
/**下方滑块背景 */
.drag-bg {
  height: 40px;
  border-radius: 2px;
}

.drag-text {
  position: absolute;
  top: 0;
  width: 100%;
  text-align: center;
  user-select: none;
}

.font-text {
  font-size: 12px;
}

.drag-div {
  height: 40px;
  border: 1px solid #ccc;
  position: absolute;
  top: 0;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.drag-icon {
  background: #fff
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==')
    no-repeat center;
}

.drag-success-icon {
  background: #fff
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==')
    no-repeat center;
}

.drag-error-icon {
  background: #fff
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABNUlEQVQ4T6VTwU3DQBCcxf6gy4MSoAKgAtIBoQLgF8mWEjpxJJ+UZ+jA6SB0YFcAJeSBxcdm0J18jn22okTcb29v53ZmdwTe+ZnPr+sgWAgwhcidTZM5gV1Q16vL9fqrWyLd4DuOEwEWPmg3JplMtH5zdy1AGcc5gNtjxW2OzJXW9ya2AKf87AMTWE3SdCmG828YfroHBD6E3EPksVdEbilyJcCDu7+oqhsZ+T1TafpURtEGIs+NiO9K65cyirIusOlCRrmTG6X1qwUB0BQfANt2mRsAjgrXgJhcrxvv8TEA2/YpAMPxkY6zocCWjtPk0EUxFJHcKq1nnohOk6GII2PcCbAHMPPoZgTMGKe9Mf57kRzaWasMFCpNrdHON1OzwgMzuQtr5zBcNlyduQpr56pKfDv/AUZmrmbsIMGcAAAAAElFTkSuQmCC')
    no-repeat center;
}
</style>
