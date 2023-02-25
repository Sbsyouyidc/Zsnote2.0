<template>
  <!--侧边栏：我的笔记、互动数据-->
  <div class="space-left__menu-wrap flex-col bg-radius">
    <el-menu class="space-left__menu" :default-active="$route.name">
      <router-link to="/space/mynotes">
        <el-menu-item class="space-left__menu-item" index="mynotes">
          我的笔记本
        </el-menu-item>
      </router-link>
      <!-- <router-link to="/space/bookmarks">
        <el-menu-item class="space-left__menu-item" index="Bookmarks">
          我的收藏夹
        </el-menu-item>
      </router-link> -->
      <!--  -->
      <el-sub-menu
        class="space-left__menu-item"
        :index="'statistics' || 'fans'"
      >
        <template #title><span>互动数据</span></template>
        <router-link to="/space/statistics">
          <el-menu-item index="statistics"> 私信列表 </el-menu-item>
        </router-link>
        <router-link to="/space/fans">
          <el-menu-item index="fans"> 评论编辑 </el-menu-item>
        </router-link>
      </el-sub-menu>
      <!-- 收藏夹列表 -->
      <el-sub-menu class="space-left__menu-item" index="bookmarks">
        <template #title><span>收藏夹</span></template>
        <router-link
          v-for="(item, index) in Bookmarks"
          :key="index"
          :to="{
            name: 'bookmarks',
            params: { collectionsId: item.collections },
          }"
        >
          <el-menu-item :index="index">
            {{ item.collectionName }}
            <el-dropdown>
              <el-icon @mouseenter="showitem"> <MoreFilled /> </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-menu-item>
        </router-link>
      </el-sub-menu>
      <!--  -->
      <router-link to="/space/verification">
        <el-menu-item class="space-left__menu-item" index="verification">
          知市认证
        </el-menu-item>
      </router-link>
      <router-link to="/space/security">
        <el-menu-item class="space-left__menu-item" index="security">
          账号安全
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<script>
import { getMyCollections } from "@/utils";
import { CircleClose, Close, MoreFilled } from "@element-plus/icons-vue";
export default {
  name: "spaceLeftMenu",
  components: { CircleClose, MoreFilled },
  data() {
    return {
      Bookmarks: [],
    };
  },
  watch: {
    $route(to, from) {
      this.collcetiom();
    },
  },
  methods: {
    async collcetiom() {
      await getMyCollections()
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          this.Bookmarks = res;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.space-left__menu-wrap {
  width: 20vw;
  height: 85vh;
  padding: 20px;
  //background: #fff;
  //border-right: 1px solid #e5e5e5;
}
.el-menu {
  border: 0;
}
.space-left__menu > a,
ul > a {
  color: #000;
  text-decoration: none;
}
.el-dropdown {
  position: absolute;
  right: 0px;
  transform: rotate(90deg);
}
</style>
