<template>
  <div id="app">
    <router-view></router-view>  <!-- 渲染当前路由匹配的组件 -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
@import './assets/styles/index.less';

</style>