<template>
  <!--  <div class="container">-->
  <div class="note-detail">
    <div class="note-exist" v-if="!hasError">
      <div class="note-detail__body">
        <div class="note-detail__body-content">
          <div class="note-detail__body-content-text">
            <!--            <md-editor v-model="note.contain" :sanitize="sanitize"></md-editor>-->
            <md-editor v-model="note.contain" :on-save="onSaveClick"></md-editor>
          </div>
        </div>
      </div>
    </div>
    <div class="note-not-exist" v-if="hasError">
      <div class="note-loading" v-if="isNoteLoading">
        <div class="note-loading__text">
          <h1>加载中</h1>
          <h1>Loading...</h1>
        </div>
      </div>
      <div class="note-not-exist-content" v-if="!isNoteLoading && !isNoteExist">
        <div class="note-not-exist-content__text">
          <h1>404</h1>
          <h3>笔记不存在。</h3>
          <h3>Note not exist.</h3>
        </div>
      </div>
      <div class="note-not-exist-content" v-if="!isNoteLoading && !isMyNote">
        <div class="note-not-exist-content__text">
          <h1>403</h1>
          <h3>这个笔记不是您的，无法编辑。请检查笔记ID是否有误。</h3>
          <h3>You have no permission to edit this notebook.</h3>
        </div>
      </div>

      <el-button type="primary" @click="backToIndex">返回</el-button>
    </div>
  </div>
  <!--  </div>-->
</template>

<script>
import {getNoteDetail, getSingleUserInfo} from "@/utils";
import {msgDuration, msgType} from "@/utils/basic/Notification";
import MdEditor from 'md-editor-v3';
// MdEditor默认css
// import 'md-editor-v3/lib/style.css';
import '@/assets/css/mdEditorStyle.css';
import sanitizeHtml from 'sanitize-html';

export default {
  name: "noteEdit",
  components: {
    MdEditor
  },
  data() {
    return {
      hasError: false,
      isMyNote: false,
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
    this.hasError = true;
    this.isNoteLoading = true;
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
      // console.log(this.$route.params.noteId);
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
      // console.log(noteId);
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
                    if (this.creator.id === this.$store.getters.getUserId) {
                      this.isNoteLoading = false;
                      this.hasError = false;
                      this.isNoteExist = true;
                      this.isMyNote = true;
                    } else {
                      this.isNoteLoading = false;
                      this.hasError = true;
                      this.isNoteExist = true;
                      this.isMyNote = false;
                    }
                  });
              document.title = `${note.title} - 知市`;
            }).catch(err => {
              let msg;
              if (err.message === "The string did not match the expected pattern.") {
                msg = "笔记ID不正确，请检查。";
              }
              this.$message({
                type: msgType.ERROR,
                message: msg || err.message
              });
              this.hasError = true;
              this.isNoteExist = false;
            });
      } else {
        this.isNoteLoading = true;
        this.isNoteExist = false;
      }
    },
    /**
     * @TODO: 需要修复净化后不显示富文本
     * @param {string} str 待处理MD文本
     * MD语句净化防注入
     * */
    sanitize(str) {
      return sanitizeHtml(str, {
        allowedTags: [],
        allowedAttributes: {},
      });
    },
    /**
     * 笔记保存事件
     * @param {string} mdValue 笔记MD内容
     * */
    async onSaveClick(mdValue) {
      const note = this.note;
      // note.contain = this.sanitize(note.contain);

      console.log(mdValue);
      this.$notify({
        title: '提示',
        message: '笔记保存成功',
        type: msgType.SUCCESS,
        duration: msgDuration.LONG
      });

      // await this.$http.put(`/note/update/${note.id}`, note)
      //     .then(r => {
      //       return r.json();
      //     })
      //     .then(res => {
      //       this.$message({
      //         type: msgType.SUCCESS,
      //         message: "保存成功"
      //       });
      //       this.$router.push({
      //         path: `/note/${note.id}`
      //       });
      //     })
      //     .catch(err => {
      //       this.$message({
      //         type: msgType.ERROR,
      //         message: err.message
      //       });
      //     });
    },
  }
}
</script>

<style lang="scss" scoped>
#md-editor-v3 {
  height: 85vh;
}

.md-toolbar-item[title*='源码地址'] {
  display: none !important;
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

.note-not-exist {
  text-align: center;
  padding: 20px;
}
</style>
