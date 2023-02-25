<template>
  <div class="notes__wrap">
    <div class="notes__empty" v-if="isEmpty">
      <el-empty :description="emptyDesc">
        <el-button type="primary" @click="onNewNotebookClick">新建笔记</el-button>
      </el-empty>
    </div>
    <el-row v-else>
      <el-col
          class="notes__item notes__item-1st"
          :span="4"
          :offset="0">
        <el-card
            class="notes__item-container"
            shadow="hover"
            :body-style="{ padding: '0px' }">
          <a
              class="notes__item-img"
              href="javascript:void(0)"
              @click="onNewNotebookClick">
            <div class="notes__item-add flex-row j-c a-c">
              +
            </div>
          </a>
        </el-card>
      </el-col>
      <!--TODO:此处offset需要更改计算方式-->
      <el-col
          class="notes__item"
          v-for="(notebook, i) in notebooks"
          :key="i"
          :span="4"
          :offset="i > 0 && i % 4 !== 0 ? 0 : 0">
        <!--        :class="i === 0 ? 'notes__item-1st' : ''"-->
        <space-right-note-item :note-props="notebook" @share="showShareDialog"></space-right-note-item>
      </el-col>
    </el-row>
    <el-dialog
        v-model="newNotebookFormVisible"
        title="新建笔记"
        :before-close="onNewNotebookCancel"
        destroy-on-close>
      <el-form ref="ruleForm" :model="newNotebookForm" :rules="rules" label-position="right">
        <el-form-item label="笔记名称" prop="title">
          <el-input v-model="newNotebookForm.title" placeholder="请输入笔记本名称"/>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-collapse>
            <el-collapse-item
                v-for="(item, index) in kindList"
                :key="index"
                :title="item.kindName"
                v-model="item.id"
                :name="item.id"
                prop="radio">
              <el-radio
                  name="radio"
                  v-for="(item2, index2) in item.childrenKinds"
                  :key="index2"
                  v-model="noteKindRadio.id"
                  :label="item2">
                {{ item2.kindName }}
              </el-radio>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
        <el-form-item label="笔记公开" prop="open">
          <el-switch
              v-model="newNotebookForm.open"
              active-text="公开"
              inactive-text="私密"/>
        </el-form-item>
        <el-form-item label="简要描述" prop="contain">
          <el-input
              v-model="newNotebookForm.contain"
              type="textarea"
              :rows="2"
              placeholder="请输入笔记描述"
          />
        </el-form-item>
      </el-form>
      <div class="new-notebook-form__tip">带 <strong style="color: #ff0000;font-size: 1rem">*</strong> 为必填项目</div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="onNewNotebookCancel">取消</el-button>
        <el-button type="primary" @click="onNewNotebookSubmit">
          创建
        </el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog
        v-model="shareLinkVisible"
        width="500px"
        draggable
        title="已为您准备好分享文案，请手动复制粘贴。"
        @close="closeShareDialog">
      <el-input size="large" v-model="shareDialogWords"></el-input>
      <template #footer>
        <el-button @click="closeShareDialog" type="primary">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import {getMyNotebookList, showLinkDisabled} from "@/utils";
import SpaceRightNoteItem from "@/views/user/components/spaceRightNoteItem";
import {funcType, getAllKinds, getMyNotebookList, postNoteUpdate} from "@/utils";
import {msgType} from "@/utils/basic/Notification";

const lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit." +
    " Eius excepturi magni maxime quas? Animi dolorum eligendi esse est" +
    " hic impedit iure labore laborum laudantium natus nobis non nostrum," +
    " provident quibusdam quod repudiandae tempore ut velit veniam" +
    " voluptatum! Autem consequatur dolorem excepturi, magnam nostrum" +
    " obcaecati porro possimus, quaerat temporibus ut vel!Lorem ipsum" +
    " dolor sit amet, consectetur adipisicing elit. Eius excepturi magni maxime quas?"

export default {
  name: "notes",
  components: {SpaceRightNoteItem},
  props: {},
  data() {
    return {
      emptyDesc: "您还没有笔记哦，快去新建一个吧！",
      tagColors: ['default', 'success', 'info', 'warning', 'danger'],
      notebooks: [],
      isMyNote: true,
      newNotebookFormVisible: false,
      shareLinkVisible: false,
      shareDialogWords: "",
      noteKindRadio: {},
      newNotebookForm: {
        contain: "",
        kindId: "",
        open: true,
        title: ""
      },
      kindList: [
        {
          id: "",
          parentId: null,
          kindName: "",
          childrenKinds: [
            {
              id: "",
              parentId: "",
              kindName: "",
              childrenKinds: []
            }
          ]
        }
      ],
      rules: {
        title: [{type: 'string', required: true, trigger: 'blur', message: '错误提示：笔记名称不能为空'}],
        radio: [{type: 'object', required: true, trigger: 'change', message: '错误提示：种类不能为空'}],
        contain: [{type: 'string', required: true, trigger: 'blur', message: '错误提示：笔记描述不能为空'}]
      }
    }
  },
  created() {
    this.getKindList();
  },
  mounted() {
    getMyNotebookList()
        .then(r => {
          return r.json();
        })
        .then(res => {
          this.notebooks = res;
        });
    // 检测store中新建笔记窗口是否显示
    this.$store.watch(state => state.bNewNotebookModal, (newVal) => {
      this.newNotebookFormVisible = newVal;
    });
    if (this.$route.params.newNotebook) {
      this.newNotebookFormVisible = true;
    }
  },
  computed: {
    isEmpty() {
      return this.notebooks.length === 0;
    }
  },
  methods: {
    /**
     * @async
     * @function getKindList
     * @description 获取所有类别列表
     * */
    async getKindList() {
      getAllKinds()
          .then(r => {
            return r.json();
          })
          .then(res => {
            this.kindList = res;
          });
    },
    /**
     * @function onNewNotebookClick
     * @description 新建笔记按钮点击事件
     * */
    onNewNotebookClick() {
      this.$store.commit('setNewNotebookModal', true);
    },
    /**
     * 新建笔记取消按钮点击事件
     * @param {Function} done 回调函数
     * */
    onNewNotebookCancel(done) {
      if (typeof done === 'function') {
        done();
      }
      this.newNotebookFormVisible = false;
      this.$store.commit('setNewNotebookModal', false);
    },
    /**
     * @function onNewNotebookSubmit
     * 新建笔记确定按钮点击事件
     * */
    onNewNotebookSubmit() {
      this.newNotebookFormVisible = false;
      const payloadData = {
        contain: this.newNotebookForm.contain,
        kindId: this.noteKindRadio.id,
        open: true,
        title: this.newNotebookForm.title
      }
      // 验证表单合法性，合法则提交表单
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          try {
            postNoteUpdate(payloadData, funcType.CREATE)
                .then(res => {
                  this.afterSubmit(res);
                })
          } catch (e) {
            this.$notify({
              title: '错误提示',
              message: `错误码：${e.errorCode}，错误信息：${e.errorMsg}`,
              type: msgType.ERROR
            });
            return false;
          }
        } else {
          this.$notify({
            title: '错误提示',
            message: '请检查表单是否填写完整',
            type: msgType.ERROR
          });
          return false;
        }
      });
    },
    /**
     * @function afterSubmit
     * @description 提交表单后，重置表单、推送路由
     * @param {Object} res 提交表单后的返回值
     * */
    afterSubmit(res) {
      // 清空表单
      this.newNotebookForm = {
        contain: "",
        kindId: "",
        open: true,
        title: ""
      };
      // 推送路由
      const newNotebookLink = this.$router.resolve({path: `/notebook/${res[0].id}`}).href;
      window.open(newNotebookLink, '_blank');
    },
    /**
     * @function loadMoreNotes
     * @description 加载更多我的笔记
     * @param {Number} pageSize 每页显示的数量
     * @param {Number} pageNum 当前页码
     * */
    loadMoreNotes(pageSize, pageNum) {
      const randomID = Math.floor(Math.random() * 100000)
      const newNoteObj = {
        id: randomID,
        title: `第${randomID}篇笔记`,
        content: lorem,
        tags: ["笔记", `第${randomID}篇`],
        created_at: this.getToday(),
        modified_at: "2022-01-15"
      }
      this.notebooks.push(newNoteObj);
    },
    /**
     * @function showShareDialog
     * @description 展示分享链接对话框
     * @param {String} shareWords 分享文案
     * */
    showShareDialog(shareWords) {
      this.shareLinkVisible = true;
      this.shareDialogWords = shareWords;
    },
    /**
     * @function closeShareDialog
     * @description 关闭分享链接对话框
     * @param {function} done 无返回值的关闭事件
     * @param {function} callback 回调方法
     * */
    closeShareDialog(done = () => {}, callback = () => {}) {
      if (typeof done === "function") {
        done();
      }
      this.shareLinkVisible = false;
      this.shareDialogWords = "";
      if (typeof callback === "function") {
        callback();
      }
    },
    /**
     * @function getToday
     * @description 取格式化今日日期
     * @return {String} 日期 - 格式YYYY-MM-DD
     * */
    getToday() {
      const date = new Date();
      let curr_date = date.getDate();
      let curr_month = date.getMonth() + 1;
      const curr_year = date.getFullYear();
      String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
      String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
      return `${curr_year}-${curr_month}-${curr_date}`;
    }
  },
}
</script>

<style lang="scss" scoped>
.el-collapse {
  width: 100%;
}

.notes__wrap {
  //width: 85vw;
  //height: 85vh;
  width: 100%;
  //height: 100%;
  //padding: 20px;
  background-color: #fff;
  overflow: hidden;
}

.notes__list {
  margin: 0;
  padding: 0;
}

.notes__item-tag {
  margin: 0 5px;
}

.notes__item-1st {
  margin-right: 4.1666666667%;
  //margin-top: 10px;
  border: none;
}

.notes__item-container {
  a {
    text-decoration: none;
    color: #101010;
    font-size: 5rem;
  }
}

.notes__item-add {
  height: 338px;
}

.notes__item-tags {
  margin: 0.5rem 0;
}

.notes__item {
  margin-right: 3%;
  //margin-right: 4.1666666667%;
  padding: 10px 0;
  border-top: 1px solid #e7e7e7;
  list-style: none;
}

.notes__item-content-text {
  margin: 1rem 0;
}

#new-notebook-form__public > label {
  margin-left: 5px !important;
}
</style>
