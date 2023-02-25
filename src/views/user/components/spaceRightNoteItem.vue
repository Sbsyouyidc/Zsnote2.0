<template>
  <el-card shadow="hover" :body-style="{ padding: '0px' }">
    <div class="notes__item-container">
      <a
        class="notes__item-img"
        href="javascript:void(0)"
        @click="onNoteClick(note.id)"
      >
        <img
          width="235"
          height="235"
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
          alt
        />
      </a>
      <div style="padding: 14px">
        <span>
          <a
            class="notes__item-title"
            href="javascript:void(0)"
            @click="onNoteClick(note.id)"
          >
            {{ note.title }}
          </a>
        </span>
        <div class="notes__item-content">
          <el-tag>{{ note.kind.kindName }}</el-tag>
          {{ note.contain }}
        </div>
        <div class="notes__item-footer">
          <div class="notes__item-functions">
            <!--<time class="time"></time>-->
            <el-button
              type="text"
              class="button notes__item-edit"
              @click="onNoteEditClick(note.id)"
              >编辑</el-button
            >
            <el-popover placement="bottom" :width="100" trigger="click">
              <template #reference>
                <el-button type="text" class="button notes__item-more">
                  <el-icon>
                    <more />
                  </el-icon>
                </el-button>
              </template>
              <div class="notes__item-func flex-row j-c a-c">
                <el-button
                  type="text"
                  class="button notes__item-delete"
                  @click="onNoteShareClick(note.id, note.title)"
                >
                  <el-icon>
                    <Share />
                  </el-icon>
                  分享
                </el-button>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="red"
                  title="确认要删除这个笔记？"
                  @confirm="onNoteDelClick(note.id)"
                >
                  <template #reference>
                    <el-button type="text" class="button notes__item-delete">
                      <el-icon>
                        <Delete />
                      </el-icon>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { deleteNote } from "@/utils";
import { getSingleNotebook } from "@/utils";
const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit." +
  " Eius excepturi magni maxime quas? Animi dolorum eligendi esse est" +
  " hic impedit iure labore laborum laudantium natus nobis non nostrum," +
  " provident quibusdam quod repudiandae tempore ut velit veniam" +
  " voluptatum! Autem consequatur dolorem excepturi, magnam nostrum" +
  " obcaecati porro possimus, quaerat temporibus ut vel!Lorem ipsum" +
  " dolor sit amet, consectetur adipisicing elit. Eius excepturi magni maxime quas?";
import { More, Delete, Share, InfoFilled } from "@element-plus/icons-vue";
import { msgType } from "@/utils/basic/Notification";

export default {
  name: "spaceRightNoteItem",
  components: { More, Delete, Share },
  props: {
    noteProps: {
      type: Object,
      required: true,
      default: () => ({
        id: "",
        title: "",
        contain: "",
        kind: {
          id: "",
          parentId: "",
          kindName: "",
        },
        num: "0",
        open: true,
      }),
    },
  },
  data() {
    return {
      InfoFilled,
      tagColors: ["default", "success", "info", "warning", "danger"],
      note: {
        id: "",
        title: "",
        contain: "",
        kind: {
          id: "",
          parentId: "",
          kindName: "",
        },
        num: "0",
        open: true,
      },
      noteId: [],
    };
  },
  mounted() {
    this.note = this.noteProps;
  },
  methods: {
    /**
     * 为笔记的labels标签背景颜色赋值
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
     * @param {String} id 笔记id
     * */
    onNoteClick(id) {
      const noteLink = this.$router.resolve({
        path: "/notebook/" + id,
      });
      window.open(noteLink.href, "_blank");
    },
    /**
     * @function onNoteDelClick
     * @description 笔记删除按钮点击事件
     * @param {String} id 笔记id
     * */
    onNoteDelClick(id) {
      // this.$emit("noteDel", id)
      deleteNote(id)
        .then((res) => {
          if (res.statusText === "OK") {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: msgType.SUCCESS,
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            throw new Error({
              message: res.statusText,
            });
          }
        })
        .catch((err) => {
          this.$notify({
            title: "删除失败",
            message: `错误：${err.message}`,
            type: msgType.ERROR,
          });
        });
    },
    /**
     * @function onNoteEditClick
     * @description 笔记编辑按钮点击事件
     * @param {String} id 笔记id
     * */
    onNoteEditClick(id) {
      this.initgetnoteid(id).then(() => {
        const noteLink = this.$router.resolve({
          path: `/notebook/${id}/note/${this.noteId[0].id}/edit=:isEdit`,
          query: { EditMode: true },
        });
        window.open(noteLink.href, "_blank");
      });
    },
    /* 获取笔记本内容 */
    async initgetnoteid(id) {
      await getSingleNotebook(id)
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          this.noteId = res;
        });
    },
    /**
     * @function onNoteShareClick
     * @description 笔记分享按钮点击事件
     * @param {String} id 笔记id
     * @param {String} title 笔记标题
     * @supported Chrome 66, Firefox 63, Safari 13.1, Edge 79, Opera 53
     * */
    async onNoteShareClick(id, title = "") {
      const noteLink = this.$router.resolve({
        path: "/notebook/" + id,
      });
      let shareWords;
      if (title !== "") {
        shareWords = `我正在知市笔记阅读《${title}》，快来看看吧！${window.location.origin}/${noteLink.href}`;
      } else {
        shareWords = `我正在知市笔记阅读笔记，快来看看吧！${window.location.origin}/${noteLink.href}`;
      }

      // copy note link to Clipboard
      // 实验性功能，目前暂不能使用
      // Clipboard.copy(shareWords);

      this.$emit("share", shareWords);
    },
  },
};
</script>

<style lang="scss" scoped>
.notes__item-title {
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  color: #000;
}

.notes__item-content {
  margin-top: 5px;
  font-size: 14px;
}

.notes__item-footer {
  .notes__item-functions {
    float: right;
  }
}
</style>
