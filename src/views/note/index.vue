<template>
  <div class="notebook__wrap">
    <note-left-menu
      class="notebook-left"
      v-bind:notebook-props="notebook"
    ></note-left-menu>
    <div class="notebook__router notebook-right bg-radius container">
      <el-skeleton
        class="skeleton"
        :loading="skeletonLoading"
        animated
        style="--el-skeleton-circle-size: 100px"
      >
        <template #template>
          <div class="skeleton__title flex-col j-c">
            <el-skeleton-item
              variant="h1"
              style="width: 50%; height: 42px; margin: 16px auto"
            />
            <el-skeleton-item variant="span" style="margin: 16px auto" />
          </div>
          <el-skeleton-item variant="circle" />
          <el-skeleton-item
            variant="image"
            style="width: 240px; height: 240px; margin: 16px auto"
          />
          <div style="padding: 16px">
            <el-skeleton-item variant="h3" style="width: 50%" />
            <div
              class="flex-row j-s-b a-c"
              style="margin-top: 16px; height: 16px"
            >
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
            <el-skeleton-item
              style="margin-top: 16px; height: 16px"
              v-for="item in 12"
            />
          </div>
        </template>
        <template #default>
          <keep-alive>
            <router-view ref="refNotebookView" />
          </keep-alive>
        </template>
      </el-skeleton>
    </div>
    <div class="container" style="margin-top: 20px">
      <note-comments ></note-comments>
    </div>
  </div>
</template>

<script>
import noteLeftMenu from "@/views/note/components/noteLeftMenu";
import { getSingleNotebook } from "@/utils";
import { msgType } from "@/utils/basic/Notification";
import noteComments from "@/views/note/components/noteComments";

export default {
  name: "notebookIndex",
  components: {
    noteLeftMenu,
    noteComments,
  },
  data() {
    return {
      notebook: [],
      skeletonLoading: true,
    };
  },
  mounted() {
    const bookId = this.$route.params.bookId;
    const noteId = this.$route.params.noteId;
    if (bookId) {
      getSingleNotebook(bookId)
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          // console.log(`res: ${JSON.stringify(res)}`);
          this.notebook = res;
          if (!noteId && res.length > 0) {
            this.$router.push(`/notebook/${bookId}/note/${res[0].id}`);
          } else if (res.length === 0) {
            // TODO: 空笔记后面需要添加判断是否本人笔记本，如果是则显示新增笔记按钮。
            this.$notify({
              title: "提示",
              message: "该笔记本下没有笔记",
              type: msgType.WARNING,
            });
          }
          this.skeletonLoading = false;
        });
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.notebook__wrap {
  //width: 85%;
  margin: 0 auto;
}

.skeleton {
  margin: 20px;
  width: auto !important;
}

.notebook-right {
  min-height: 500px;
  margin: 0 auto;
  //width: 80vw;
  //height: 85vh;
  //padding: 20px;
  overflow-x: hidden;
  overflow-y: unset;
}
</style>
