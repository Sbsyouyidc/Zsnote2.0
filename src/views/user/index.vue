<template>
  <div class="space__wrap flex-row">
    <space-left-menu class="space-left"></space-left-menu>
    <div class="space__router space-right bg-radius" @routerChange="routerPush">
      <router-view ref="refUserView" v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
import Notes from "@/views/user/spaceRightNotebooks";
import SpaceLeftMenu from "@/views/user/components/spaceLeftMenu";
export default {
  name: "userInfo",
  components: { SpaceLeftMenu, Notes },
  mounted() {
    // this.routerPush('/space/mynotes');
  },
  methods: {
    /**
     * 封装 路由推送
     * */
    routerPush(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
.space-left {
  margin-right: 15px;
}
.space-right {
  width: 80vw;
  height: 85vh;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
