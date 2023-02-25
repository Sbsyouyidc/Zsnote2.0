<template>
  <div class="Home">
    <h4>评论编辑</h4>
    <div class="fans flex-row j-s-a">
      <div class="fans-messages flex-col">
        <el-radio-group v-model="isalldelet" size="small">
          <el-radio-button :label="true">批量删除</el-radio-button>
          <el-radio-button :label="false"
            >选择删除</el-radio-button
          ></el-radio-group
        >
        <el-scrollbar>
          <div
            class="comments-list-info"
            v-for="(item, index) in list"
            :key="index"
          >
            <el-checkbox
              v-model="item.checked"
              v-if="isalldelet"
              size="large"
            />
            <div class="list-name">
              {{ item.creator.name }}
            </div>
            <span class="list-context">{{ item.content }}</span>
            <div class="list-data flex-row">
              {{ item.createdDate }}
              <a
                href="javascript:void(0)"
                class="reply flex-row"
                @click="Delete(item.id, index)"
                >删除</a
              >
            </div>
          </div>
        </el-scrollbar>

        <!-- <el-divider />
        <div class="fans-messages-operation flex-col">
          <textarea v-model="textarea" placeholder="Please input" />
          <el-button class="operation-send" @click="send">发送</el-button>
        </div> -->
      </div>
      <div class="fans-list flex-col j-stard">
        <el-menu>
          <el-menu-item
            class="fans-info flex-row"
            v-for="(item, index) in notes"
            :index="index"
            :key="index"
            v-model="aindex"
            @click="choose(item, index)"
          >
            <el-icon :size="20"><Notebook /></el-icon>
            <div class="fans-info-naem">{{ item.title }}</div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMyNotebookList,
  getSingleNotebook,
  getallComments,
  deleteComment,
} from "@/utils";
import { Delete, Notebook } from "@element-plus/icons-vue";
export default {
  components: { Notebook },
  name: "spaceRightFans",
  data() {
    return {
      notebooks: [],
      notes: [],
      list: new Map(),
      index: Number,
      isalldelet: false,
    };
  },
  async created() {
    await getMyNotebookList()
      .then((r) => {
        return r.json();
      })
      .then((res) => {
        this.notebooks = res;
      });
    for (const iterator of this.notebooks) {
      await getSingleNotebook(iterator.id)
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          console.log(res);
          if (res.length === 0) return;
          this.notes.push(res);
        });
      this.notes = this.notes.flat();
    }
  },
  methods: {
    async choose(item, index) {
      this.index = index;
      this.getComments(item.id);
    },
    async getComments(id) {
      await getallComments(id)
        .then((r) => {
          console.log();
          return r.json();
        })
        .then((res) => {
          this.list = res;
        });
    },
    async Delete(cid) {
      await deleteComment(cid)
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          console.log(res);
          // if () {

          // }
          this.getComments(this.notes[this.index].id);
        });
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
  width: 100%;
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
