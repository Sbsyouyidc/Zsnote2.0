<template>
  <div class="layout flex-col">
    <el-affix>
      <el-header>
        <zs-header></zs-header>
      </el-header>
    </el-affix>
    <el-main>
      <div class="flex-1">
        <router-view #default="{Component}">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </div>
    </el-main>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import zsHeader from "@/views/components/zsHeader.vue";
import {pageInit} from "@/utils";

export default defineComponent({
  name: "layout",
  components: {zsHeader},
  mounted() {
    pageInit();
  },
  setup() {

  }
})
</script>

<style lang="scss" scoped>
@import url("../assets/scss/comm.scss");

.layout {
  height: 100%;

  .el-header {
    background-color: var(--main-secondary-color);
  }

  .el-main {
    overflow: unset;
  }

  .el-header {
    border-bottom: 1px solid #f1f1f1;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
