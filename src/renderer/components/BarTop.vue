<script setup lang="ts">
// 自定义窗口栏
import { onMounted, ref, onUnmounted } from "vue";
import { ipcRenderer } from "electron";
defineProps<{ title?: string }>();
let isMaximized = ref(false);
const closeWindow = () => {
  ipcRenderer.invoke("closeWindow");
};
const maxmizeMainWin = () => {
  // 向主程序通知最大化窗口
  ipcRenderer.invoke("maxmizeWindow");
};
const minimizeMainWindow = () => {
  ipcRenderer.invoke("minimizeWindow");
};
const unmaximizeMainWindow = () => {
  ipcRenderer.invoke("unmaximizeWindow");
};
const winMaximizeEvent = () => {
  console.log('max');
  isMaximized.value = true;
};
const winUnmaximizeEvent = () => {
  console.log('unmax');
  isMaximized.value = false;
};
onMounted(() => {
  ipcRenderer.on("windowMaximized", winMaximizeEvent);
  ipcRenderer.on("windowUnmaximized", winUnmaximizeEvent);
});
onUnmounted(() => {
  ipcRenderer.off("windowMaximized", winMaximizeEvent);
  ipcRenderer.off("windowUnmaximized", winUnmaximizeEvent);
});
</script>
<template>
  <div class="topBar">
    <div class="winTitle">{{ title }}</div>
    <div class="winTool">
      <div @click="minimizeMainWindow">
        <i class="icon icon-minimize" />
      </div>
      <div v-if="isMaximized" @click="unmaximizeMainWindow">
        <i class="icon icon-restore" />
      </div>
      <div v-else @click="maxmizeMainWin">
        <i class="icon icon-maximize" />
      </div>
      <div @click="closeWindow">
        <i class="icon icon-close" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.topBar {
  display: flex;
  height: 25px;
  line-height: 25px;
  -webkit-app-region: drag;
  width: 100%;
}

.winTitle {
  flex: 1;
  padding-left: 12px;
  font-size: 14px;
  color: #888;
}

.winTool {
  height: 100%;
  display: flex;
  -webkit-app-region: no-drag;
}

.winTool div {
  height: 100%;
  width: 34px;
  text-align: center;
  color: #999;
  cursor: pointer;
  line-height: 25px;
}

.winTool .icon {
  font-size: 10px;
  color: #666666;
  font-weight: bold;
}

.winTool div:hover {
  background: #efefef;
}

.winTool div:last-child:hover {
  background: #ff7875;
}

.winTool div:last-child:hover i {
  color: #fff !important;
}
</style>