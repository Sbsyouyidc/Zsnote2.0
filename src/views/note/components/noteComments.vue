<template>
  <div class="Home">
    <h2 ref="comment">评论</h2>
    <div class="comments-my flex-row">
      <textarea v-model="mytext" placeholder="Please input" />
      <el-button @click="remark" type="primary" :disabled="this.mytext == ''"
        >评论</el-button
      >
    </div>
    <h2>评论列表</h2>
    <div
      class="comments-list flex-col underline"
      v-for="(item, index) in list"
      :key="index"
    >
      <!-- 用户信息展示 -->
      <div class="user flex-row">
        <el-avatar :fit="cover" :size="50" :src="item.creator.portrait" />
        <div class="comments-list-info">
          <div class="list-name">{{ item.creator.name }}</div>
          <span class="list-context">{{ item.content }}</span>
          <div class="list-data flex-row">
            {{ item.createdDate }}
            <a
              href="javascript:void(0)"
              class="reply flex-row"
              @click="isreply(item, item.id)"
              >回复</a
            >
          </div>
        </div>
      </div>
      <!-- 回复评论展示 -->
      <div class="comments flex-row" v-if="item.isreply">
        <textarea
          v-model="textarea"
          placeholder="Please input"
          @blur="onblur(item)"
          :ref="`textarea${item.id}`"
        />
        <el-button
          @mousedown="send(item, textarea)"
          type="primary"
          :disabled="this.textarea == ''"
          >回复</el-button
        >
      </div>
      <!-- 查看更多 -->
      <!-- <div class="user-more" :ref="`mroe${index}`" v-show="ismore">
        <a @click="chekc_comment(index)" href="javascript:void(0)">查看更多</a>
      </div> -->
      <!-- 嵌套回复展示 -->
      <chile-comments
        :name="item.creator.name"
        :childcomment="item.childrenComments"
        :isFreply="isreply"
        @Fsend="send"
      ></chile-comments>
    </div>
  </div>
</template>

<script>
import { getallComments, postallComments } from "@/utils";
import { Avatar } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import chileComments from "./chileComments.vue";
export default {
  name: "noteComments",
  components: { Avatar, chileComments },
  data() {
    return {
      // ismore: true,
      textarea: "",
      mytext: "",
      comments: true,
      list: [],
      noteId: Number,
    };
  },
  watch: {
    $route(to, from) {
      this.getComments();
    },
  },
  created() {
    this.comments = this.$route.query.comments
      ? (this.comments = true)
      : (this.comments = false);
    this.getComments().then(() => {
      this.$nextTick(() => {
        console.log(this.$refs.comment);
        if (this.comments == true) {
          this.$refs.comment.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    });
  },
  mounted() {},
  methods: {
    /* 获取评论列表 */
    async getComments() {
      this.noteId = this.$route.params.noteId;
      await getallComments(this.noteId)
        .then((r) => {
          console.log();
          return r.json();
        })
        .then((res) => {
          this.list = res;
          console.log(this.list);
        });
    },
    /* 评论 */
    async remark() {
      let lis = {
        content: this.mytext,
        noteId: this.noteId,
        parentId: null,
        replyCommentId: null,
        replyUserId: null,
      };
      if (lis.content == "") {
        ElMessage("内容为空");
      } else {
        await postallComments(lis).then(() => {
          this.mytext = "";
          this.getComments();
        });
      }
    },
    /*  显示回复 */
    isreply(item, id) {
      item.isreply = true;
      this.$nextTick(() => {
        if (this.$refs[`textarea${id}`]) this.$refs[`textarea${id}`].focus();
      });
    },
    /* 发送 */
    async send(item, textarea) {
      let lis = {
        content: textarea,
        noteId: this.noteId,
        parentId: item.id,
        replyCommentId: null,
        replyUserId: null,
      };
      await postallComments(lis).then(() => {
        this.getComments();
        ElMessage("已发送内容");
        this.textarea = "";
        item.isreply = false;
      });
    },
    /* 焦点取消,关闭回复框 */
    onblur(item) {
      item.isreply = false;
    },
    //查看更多
    // chekc_comment(index) {
    //   console.log(this.$refs);
    //   console.log(index);
    //   this.ismore = !this.ismore;
    //   this.$nextTick(() => {
    //     this.$refs[`mroe${index}`].style.block = "bolck";
    //   });
    // },
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
</style>
