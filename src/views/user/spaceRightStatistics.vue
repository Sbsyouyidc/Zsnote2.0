<template>
  <div class="Home">
    <div class="fans flex-row j-s-a">
      <div class="fans-messages flex-col">
        <keep-alive><router-view></router-view></keep-alive>
        <el-scrollbar> </el-scrollbar>
        <el-divider />
        <div class="fans-messages-operation flex-col">
          <textarea v-model="textarea" placeholder="Please input" />
          <el-button class="operation-send" @click="send">发送</el-button>
        </div>
      </div>
      <el-card class="fans-list flex-col"
        ><el-menu>
          <router-link
            :key="index"
            :to="{
              path: `/space/statistics/${this.userlist.id}`,
            }"
            ><el-menu-item class="fans-info flex-row">
              <el-avatar :fit="cover" :size="20" :src="userlist.portrait" />
              <div class="fans-info-naem">{{ userlist.name }}</div>
            </el-menu-item></router-link
          >
        </el-menu>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getallComments, getSingleUserInfo } from "@/utils";
import { Delete, Notebook } from "@element-plus/icons-vue";
export default {
  name: "spaceRightStatistics",
  components: { Notebook },
  data() {
    return {
      userlist: [],
      re: [],
    };
  },
  created() {
    this.init();
  },

  watch: {
    $route(to, from) {
      this.init();
    },
  },


  methods: {
    async init() {
      this.userlist.push(this.$route.params);
      console.log(this.userlist);
      // await getallComments(this.userlist.id)
      //   .then((r) => {
      //     return r.json();
      //   })
      //   .then((res) => {
      //     console.log(res);
      //     this.re = res;
      
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #9499a0;
  font-size: 0.5rem;
}
.span {
  display: inline-block;
}
.Home {
  padding: 20px;
  width: 100%;
  height: 100%;
}
.el-button {
  margin-left: 5px;
  height: 60px;
}
.mments-list {
  width: 100%;
}
textarea {
  vertical-align: middle;
  padding: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  width: 1000px;
  height: 38px;
  resize: none;
  outline: none;
  border: 1px solid rgb(161, 161, 161);
  border-radius: 5px;
  font-family: 微软黑体;
}
.comments {
  width: 100%;
  margin-left: 50px;
}
.comments-list-info {
  font-size: 1rem;
  padding: 10px;
  .list-name {
    color: #9499a0;
  }
  .list-data {
    flood-color: #9499a0;
    line-height: 30px;
  }
}
.underline {
  border-bottom: 1px solid #e3e5e7;
  padding: 5px;
}
.chile-comments {
  display: none;
}
.comments-my {
  margin-left: 20px;
}
.el-card {
  width: 250px;
  height: 550px;
}
.el-scrollbar {
  padding: 10px;
  height: 100%;
}
.fans-info {
  line-height: 20px;
  margin-bottom: 20px;
  // border-radius: 14px;
  padding: 5px;
}
.fans-messages {
  padding: 5px;
  height: 700px;
  width: 1000px;
  border-radius: 15px;
  box-shadow: 1px 1px 10px 1px #e4e7ed;
  .fans-messages-operation {
    background-color: transparent;
    width: 100%;
    overflow: hidden;
    .operation-send {
      align-self: flex-end;
    }
    textarea {
      width: 100%;
      margin-bottom: 10px;
      height: 80px;
      resize: none;
      outline: none;
      border: solid #ffffff;
      border-radius: 5px;
      font-size: 20px;
      font-family: 微软黑体;
    }
  }
}
</style>
