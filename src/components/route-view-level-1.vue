<template>
  <div class="route-view-level-1">
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'route-view-level-1',
}); // export default
</script>

<style lang="css">
.route-view-level-1 {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
