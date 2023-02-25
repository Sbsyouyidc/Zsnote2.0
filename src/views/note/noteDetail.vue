<template>
  <!--  <div class="container">-->
  <div class="note-detail">
    <div class="note-exist" v-if="isNoteExist">
      <!-- 笔记头部 -->
      <div class="note-detail__header">
        <div class="note-detail__header-title flex-col j-c a-c">
          <h1>{{ note.title }}</h1>
          <div class="note-detail__header-info flex-row j-s-b">
            <span><a>作者：{{ creator.name }}</a></span>
            <span>发布日期：{{ note.createdDate }}</span>
            <span>阅读量：{{ note.readers }}</span>
          </div>
          <!--            <h2>note id: {{ this.$route.query.id }}</h2>-->
        </div>
        <!--      <div class="note-detail__header-actions">-->
        <!--        <button class="btn btn-primary" @click="editNote">Edit</button>-->
        <!--        <button class="btn btn-danger" @click="deleteNote">Delete</button>-->
        <!--      </div>-->
      </div>
      <!-- 笔记主干 -->
      <div class="note-detail__body">
        <div class="note-detail__body-content">
          <div class="note-detail__body-content-text">
            <md-editor v-model="note.contain" previewOnly></md-editor>
          </div>
        </div>
      </div>
      <!-- 笔记功能区 -->
      <div class="note-detail__footer">
        <div class="note-detail__footer-actions">
          <el-button-group class="note-detail__likes">
            <el-button type="primary" @click="onLikeClick('like')" plain disabled>👍</el-button>
            <el-button type="primary" @click="onLikeClick('dislike')" plain disabled>👎</el-button>
          </el-button-group>
          <!--            <button class="btn btn-primary" @click="editNote">Edit</button>-->
          <!--            <button class="btn btn-danger" @click="deleteNote">Delete</button>-->
        </div>
      </div>
    </div>
    <div class="note-not-exist" v-else>
      <div class="note-loading" v-if="isNoteLoading">
        <div class="note-loading__text">
          <h1>加载中</h1>
          <h1>Loading...</h1>
        </div>
      </div>
      <div class="note-not-exist-content" v-if="!isNoteLoading">
        <div class="note-not-exist-content__text">
          <h1>404</h1>
          <h3>笔记不存在。</h3>
          <h3>Note not exist.</h3>
        </div>
      </div>

      <el-button type="primary" @click="backToIndex">返回</el-button>
    </div>
  </div>
  <!--  </div>-->
</template>

<script>
import {getNoteDetail, getSingleUserInfo} from "@/utils";
import {msgType} from "@/utils/basic/Notification";
import MdEditor from 'md-editor-v3';
// MdEditor默认css
// import 'md-editor-v3/lib/style.css';
import '@/assets/css/mdEditorStyle.css';

export default {
  name: "noteDetail",
  components: {
    MdEditor
  },
  data() {
    return {
      isNoteExist: true,
      isNoteLoading: true,
      creator: {
        detail: "",
        id: "",
        name: "",
        portrait: ""
      },
      note: {
        id: "",
        parentId: "",
        title: "",
        contain: "",
        labels: [
          {
            labelName: "",
            id: ""
          }
        ],
        collected: false,
        kind: {
          id: "",
          parentId: "",
          kindName: ""
        },
        open: true,
        readers: 0,
        liked: false,
        collectors: '0',
        creatorId: "",
        createdDate: "",
        lastModifiedDate: null,
      },
    };
  },
  mounted() {
    this.initNoteDetail();
  },
  watch: {
    // 监听相同路由下参数变化的时候，从而实现异步刷新
    // to表示的是你要去的那个组件，from 表示的是你从哪个组件过来的，它们是两个对象，你可以把它打印出来，它们也有一个param 属性
    '$route'(to, from) {
      //相应参数变化后的操作
      //重新获取数据
      this.initNoteDetail();
      //重新获取到的参数，可以在这里使用该参数完成axios请求等操作
      console.log(this.$route.params.noteId);
    },
  },
  methods: {
    /**
     * 笔记加载或者404时的返回首页按钮事件
     * */
    backToIndex() {
      this.$router.push({
        path: "/index"
      });
    },
    /**
     * 笔记内容初始化
     * */
    async initNoteDetail() {
      const noteId = this.$route.params.noteId;
      console.log(noteId);
      if (noteId) {
        await getNoteDetail(noteId)
            .then(r => {
              return r.json();
            })
            .then(note => {
              this.note = note;
              getSingleUserInfo(note.creatorId)
                  .then(r => {
                    return r.json();
                  })
                  .then(res => {
                    this.creator = res;
                  });
              document.title = `${note.title} - 知市`;
              this.isNoteExist = true;
              this.isNoteLoading = false;
            }).catch(err => {
              let msg;
              if (err.message === "The string did not match the expected pattern.") {
                msg = "笔记ID不正确，请检查。";
              }
              this.$message({
                type: msgType.ERROR,
                message: msg || err.message
              });
              this.isNoteExist = false;
            });
      } else {
        this.isNoteLoading = true;
        this.isNoteExist = false;
      }
    },
    /**
     * 点赞或者取消点赞
     * @param {string} type 点赞类型，like或者dislike
     * */
    onLikeClick(type) {
      // TODO: 点赞按钮事件实现
      const noteId = this.$route.params.noteId;
    },
  }
}
</script>

<style lang="scss" scoped>
.note-detail {
  margin: 20px;
  width: 97%;
}

#md-preview > figure {
  margin: 10px 0 !important;
  display: block !important;
}

.note-detail__header {
  padding: 0 0 0.3rem 0;
  border-bottom: 1px solid #e5e5e5;
}

.note-detail__header-title {
  width: 100%;
  text-align: center;

  .note-detail__header-info {
    width: 100%;

    span {
      font-size: 0.8rem;
      color: #999;
    }
  }
}

.note-detail__footer {
  padding: 1rem 0 0 0;
  border-top: 1px solid #e5e5e5;
}

.note-detail__likes {
  visibility: hidden;
}

.note-not-exist {
  text-align: center;
  padding: 20px;
}
</style>
