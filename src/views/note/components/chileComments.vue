<template>
  <div class="Home">
    <div
      class="comments-list flex-col"
      v-for="(item, index) in childcomment"
      :key="index"
    >
      <div class="user flex-row">
        <el-avatar :fit="cover" :size="30" :src="item.creator.portrait" />
        <div class="comments-list-info">
          <div class="list-name">
            {{ item.creator.name }} 回复 @{{ this.name }}
          </div>
          <span class="list-context">{{ item.content }}</span>
          <div class="list-data flex-row">
            {{ item.createdDate }}
          </div>
        </div>
      </div>

      <div class="comments flex-row" v-show="item.isreply">
        <textarea
          :ref="`textarea${item.id}`"
          v-model="textarea"
          placeholder="Please input"
        />
        <el-button @click="enter(item, textarea)" type="primary"
          >回复</el-button
        >
      </div>
      <!-- <chile-comments
        :name="item.creator.name"
        :childcomment="item.childrenComments"
        :isFreply="isreply"
        :Fsend="send"
      ></chile-comments> -->
    </div>
  </div>
</template>

<script>
import { Avatar } from "@element-plus/icons-vue";
export default {
  neam: "chileComments",
  components: { Avatar },
  props: {
    childcomment: Object,
    name: String,
    isFreply: Function,
  },
  data() {
    return {
      textarea: "",
      ischilereply: false,
    };
  },
  created() {},
  methods: {
    /*  显示回复 */
    isreply(item, id) {
      this.isFreply(item, id);
    },
    /* 发送 */
    enter(item, textarea) {
      this.$emit("Fsend", item, textarea);
      this.textarea = "";
    },
    // onblur(item) {
    //   this.$parent.onblur(item);
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
.Home {
  width: 100%;
  height: 100%;
}

.comments {
  text-align: center;
  width: 100%;
  textarea {
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
  .el-button {
    margin-left: 5px;
    height: 60px;
  }
}

.comments-list-info {
  padding: 20px;
  font-size: 0.85rem;
  padding: 10px;
  .list-name {
    color: #9499a0;
  }
  .list-context {
    font-size: 1rem;
  }
  .list-data {
    flood-color: #9499a0;
    line-height: 30px;
  }
}
</style>
