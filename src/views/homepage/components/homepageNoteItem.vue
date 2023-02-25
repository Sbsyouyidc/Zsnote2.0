<template>
  <div class="homepage-note-item__wrap">
    <div class="homepage-note-item__header">
      <div class="homepage-note-item__header-title flex-row j-s-b">
        <a
          class="homepage-note-item__title-link"
          @click="onNoteClick(noteInfo.parentId, noteInfo.id)"
        >
          <span>{{ noteInfo.title || "标题为空" }}</span>
        </a>
        <div class="homepage-note-item__header-labels">
          <span
            v-if="noteInfo.kind.kindName !== ''"
            class="homepage-note-item__header-kind"
          >
            {{ noteInfo.kind.kindName }}
          </span>
          <el-tag
            v-for="(tag, i) in noteInfo.labels"
            :key="i"
            v-show="tag.labelName !== ''"
            class="notes__item-tag"
            size="small"
            :type="getTagColor(i)"
          >
            {{ tag.labelName }}
          </el-tag>
        </div>
      </div>
    </div>
    <div class="homepage-note-item__detail-wrap">
      <div class="homepage-note-item__detail homepage-grid">
        <div class="homepage-note-item__detail-image">
          <el-image :src="noteInfo.image || placeholerImg" lazy>
            <template #placeholder>
              <div class="image-slot">
                <el-image :src="placeholerImg" lazy></el-image>
              </div>
            </template>
          </el-image>
        </div>
        <div class="homepage-note-item__detail-content span-col-2">
          <a
            class="homepage-note-item__detail-link"
            @click="onNoteClick(noteInfo.parentId, noteInfo.id)"
          >
            <span>{{ noteInfo.contain || placeholderText }}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="homepage-note-item__function homepage-grid">
      <el-button-group class="homepage-note-item__function-like">
        <el-button
          type="primary"
          plain
          @click="onLikeClick('like', noteInfo.parentId, noteInfo.id)"
          >👍 {{ noteInfo.likes }}</el-button
        >
        <el-button type="primary" plain @click="onLikeClick('dislike')"
          >👎</el-button
        >
      </el-button-group>
      <div class="homepage-note-item__function-other homepage-grid">
        <el-button
          type="text"
          @click="onCommentClick(noteInfo.id, noteInfo.parentId)"
        >
          <el-icon :size="20">
            <chat-line-square />
          </el-icon>
          评论 {{ noteInfo.comments }}
        </el-button>
        <el-button type="text" @click="onFavoriteClick">
          <el-icon :size="20">
            <management />
          </el-icon>
          收藏
        </el-button>

        <el-button type="text" @click="onShareClick">
          <el-icon :size="20">
            <share />
          </el-icon>
          分享
        </el-button>
      </div>

      <!--      作者信息-->
      <el-link class="homepage-note-item__author-wrap" :underline="false">
        <div class="author">
          <avatar :user="noteInfo.creator" name-align="horizontal"></avatar>
          <!--          <div class="author-avatar">-->
          <!--            <el-image :src="noteInfo.creator.portrait" lazy></el-image>-->
          <!--          </div>-->
          <!--          <div class="author-name">-->
          <!--            <span>{{ noteInfo.creator.name || "作者为空" }}</span>-->
          <!--          </div>-->
        </div>
      </el-link>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="收藏夹列表"
    width="30%"
    :before-close="handleClose"
  >
    <el-table
      :data="Bookmarks"
      ref="singleTable"
      height="250"
      highlight-current-row
      @row-click="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column prop="collectionName" />
      <!-- <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" /> -->
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="(dialogVisible = false), (isCollection = true)"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="this.isCollection"
          @click="Truecollection"
          >确定收藏</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  ChatLineSquare,
  Management,
  Share,
  Picture as IconPicture,
} from "@element-plus/icons-vue";
import {
  showLinkDisabled,
  notelike,
  getMyCollections,
  collectnote,
} from "@/utils";
import defaultAvatar from "@/assets/images/defaultAvatar.jpeg";
import Avatar from "@/views/components/avatar";
const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit." +
  " Eius excepturi magni maxime quas? Animi dolorum eligendi esse est" +
  " hic impedit iure labore laborum laudantium natus nobis non nostrum," +
  " provident quibusdam quod repudiandae tempore ut velit veniam" +
  " voluptatum! Autem consequatur dolorem excepturi, magnam nostrum" +
  " obcaecati porro possimus, quaerat temporibus ut vel!Lorem ipsum" +
  " dolor sit amet, consectetur adipisicing elit. Eius excepturi magni maxime quas?";

// loremImg 长宽比为16:9
const loremImg = "https://via.placeholder.com/267x150?text=267x150-16:9";

export default {
  name: "homepageNoteItem",
  components: {
    Avatar,
    ChatLineSquare,
    Management,
    Share,
    IconPicture,
  },
  // props: ["noteInfoProps"],
  props: {
    noteInfoProps: {
      type: Object,
      default: () => ({
        id: "",
        parentId: "",
        title: "",
        contain: "",
        labels: [
          {
            labelName: "",
            id: "",
          },
        ],
        kind: {
          id: "",
          parentId: "",
          kindName: "",
        },
        image: "",
        createdDate: "",
        likes: "0",
        comments: "0",
        creator: {
          id: "",
          name: "",
          portrait: "",
          detail: "",
        },
        readers: "0",
      }),
    },
  },
  data() {
    return {
      Bookmarks: [],
      currentRow: Object,
      isCollection: true,
      dialogVisible: false,
      defaultAvatar,
      IconPicture,
      placeholerImg: loremImg,
      placeholderText: lorem,
      // userLike表示用户对点赞按钮的操作
      userLikeFlag: "none",
      noteInfo: {
        id: "",
        parentId: "",
        title: "",
        contain: "",
        labels: [
          {
            labelName: "",
            id: "",
          },
        ],
        kind: {
          id: "",
          parentId: "",
          kindName: "",
        },
        image: "",
        createdDate: "",
        likes: "0",
        comments: "0",
        creator: {
          id: "",
          name: "",
          portrait: defaultAvatar,
          detail: "",
        },
        readers: "0",
      },
      tagColors: ["", "success", "info", "warning", "danger"],
    };
  },
  mounted() {
    this.noteInfo = this.noteInfoProps;
  },
  methods: {
    /**
     * 为笔记的tag标签背景颜色赋值
     * @param {number} index 下标
     * */
    getTagColor(index) {
      if (index >= 5 && index < 10) {
        this.getTagColor(index - 5);
      } else {
        return this.tagColors[index % 5];
      }
      return this.tagColors[index];
    },
    /**
     * 笔记点击在新标签页打开正文
     * @param {string} parentId 笔记本id
     * @param {String} noteId 子笔记的id
     * */
    onNoteClick(parentId, noteId) {
      const noteLink = this.$router.resolve({
        path: `/notebook/${parentId}/note/${noteId}`,
      });
      window.open(noteLink.href, "_blank");
    },
    /**
     * @Author Daniel Morrison
     * @description 点赞按钮按下时的页面事件
     * @param {String} userOperation 用户事件，字符串"like"或"dislike"
     * */
    async onLikeClick(userOperation, parentId, id) {
      console.log(parentId);
      console.log(id);
      if (this.userLikeFlag === "none") {
        //当用户事件记录变量为“无操作”时
        if (userOperation === "like") {
          this.userLikeFlag = userOperation;
          // 向服务器发送点赞请求
        } else if (userOperation === "dislike") {
          this.userLikeFlag = userOperation;
          // 向服务器发送点踩请求
        }
      } else {
        //当用户事件记录变量为“喜欢”或者“不喜欢”时
        switch (userOperation) {
          case "like":
            this.noteInfo.iLikes -= 1;
            this.userLikeFlag = "none";
            // 向服务器发送取消点赞请求
            break;
          case "dislike":
            this.userLikeFlag = userOperation;
            // 向服务器发送取消点踩请求
            break;
          default:
            break;
        }
      }
    },
    /**
     * @Author Daniel Morrison
     * @description 评论按钮按下时的页面事件
     * */
    onCommentClick(id, parentId) {
      const noteLink = this.$router.resolve({
        path: `/notebook/${parentId}/note/${id}`,
        query: { comments: true },
      });
      window.open(noteLink.href, "_blank");
      // showLinkDisabled(`笔记${this.noteInfo.id}的评论`);
    },
    /**
     * @Author Daniel Morrison
     * @description 收藏按钮按下时的页面事件
     * */
    async onFavoriteClick() {
      this.dialogVisible = true;
      await getMyCollections()
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          this.Bookmarks = res;
          // for (let index = 0; index < res.length; index++) {
          //   console.log(Object.entries(res[index].collections));
          //   let collections = new Map(Object.entries(res[index].collections));
          //   // console.log(collections);
          //   // console.log(collections.has("key"));
          // }
          // let a=res.filter(item=>item.collections)
        });
      // showLinkDisabled(`笔记${this.noteInfo.id}的收藏`);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.isCollection = false;
    },
    async Truecollection() {
      console.log(this.noteInfo.id);
      console.log(this.currentRow.id);
      this.isCollection = true;
      this.dialogVisible = !this.dialogVisible;
      await collectnote(this.currentRow.id,this.noteInfo.id)
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          console.log(res);
        });
    },
    /**
     * @Author Daniel Morrison
     * @description 分享按钮按下时的页面事件
     * */
    onShareClick() {
      showLinkDisabled(`笔记${this.noteInfo.id}的分享`);
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.homepage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.homepage-note-item__wrap {
  list-style: none;
  position: relative;
  //height: 180px;
  height: max-content;
  padding: 1vw;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: #fff;

  h3 {
    margin-top: 0;
    margin-bottom: 0;
  }

  h4 {
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 500;
  }
}

.homepage-note-item__detail-wrap {
  margin: 10px 0;
  width: 100%;
}

.homepage-note-item__time {
  margin-right: 50px;
}

.homepage-note-item__header {
  h3 {
    margin-right: 20px;
  }

  .homepage-note-item__header-title {
    font-weight: 900;

    .homepage-note-item__header-labels {
      .el-tag {
        margin: 0 5px;
      }
    }

    .homepage-note-item__header-kind {
      font-weight: 300;
      margin: 0 5px;
    }
  }
}

.homepage-note-item__title-link,
.homepage-note-item__detail-link {
  cursor: pointer;
  color: #000;
  text-decoration: none;
}

.homepage-note-item__detail-image {
  flex: 1;
  width: 267px;
  height: 150px;
}

.homepage-note-item__detail-content {
  flex: 2;
  height: 150px;
  overflow: hidden;

  span {
    display: -webkit-box !important;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
  }
}

.homepage-note-item__function-like {
  visibility: visible;
  // 点赞按钮容器宽度与图片宽度一致
  width: 267px;

  margin: auto 0;

  .el-button {
    font-size: 20px;
  }
}

.homepage-note-item__function-other {
  margin: auto 0;

  .el-button {
    color: #333333;
    font-size: 20px;
  }

  .el-button:hover {
    color: #409eff;
  }
}

.homepage-note-item__author-wrap {
  justify-content: center;
  //justify-content: end;
  align-items: center;

  span {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .author {
    width: 120px;
    height: 46px;
    //display: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .author-avatar {
      margin: auto 10px;
      width: 40px;
      height: 40px;
      position: relative;
      background: #ccc;
      border-radius: 40px;
      overflow: hidden;
    }

    .author-name {
      margin: auto 0;
    }
  }
}
</style>
