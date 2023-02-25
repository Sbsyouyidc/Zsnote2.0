<template>
  <!--侧边栏：单笔记本的笔记列表-->
  <div class="space-left__menu-wrap">
    <transition name="el-fade-in-linear">
      <div class="space-left__catalogue-control">
        <span class="space-left__control-label" v-show="menuVisible"
          >显示边栏</span
        >
        <el-switch
          v-model="menuVisible"
          active-text="✔"
          inactive-text="x"
          inline-prompt
        />
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="flex-col bg-radius" v-show="menuVisible">
        <el-menu
          class="space-left__menu"
          :default-active="$route.params.bookId"
        >
          <router-link
            :to="{ path: `/notebook/${note.parentId}/note/${note.id}/${edit}` }"
            v-for="(note, i) in notebookProps"
            :key="i"
          >
            <el-menu-item
              class="space-left__menu-item"
              :index="note.id"
              @click="this.index = i"
            >
              {{ note.title }}
            </el-menu-item>
          </router-link>
        </el-menu>
        <div
          class="space-left__function-wrap flex-col j-c a-c"
          v-if="isMyNotebook"
        >
          <el-radio-group size="small" v-model="isEditMode">
            <el-radio-button label="false">阅读模式</el-radio-button>
            <el-radio-button label="true">编辑模式</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "noteLeftMenu",
  props: ["notebookProps"],
  data() {
    return {
      menuVisible: true,
      isEditMode: false,
      isMyNotebook: false,
      edit: "",
      index: null,
    };
  },
  created() {
    // console.log('this.$route.params.noteId', this.$route.params.noteId);
    // console.log('this.$route.params', this.$route.params);
    // console.log('this.$route.query', this.$route.query);
    if (this.$route.query.isBookmark === "true") {
      this.menuVisible = false;
    }
    if (this.$route.query.EditMode ===  "true") {
      this.isEditMode = true;
    }
  },
  watch: {
    isEditMode: function (val) {
      if (val) {
        this.edit = "edit=:isEdit";
        console.log(this.index);
        this.trigger();
      } else {
        this.edit = "";
        this.trigger();
      }
    },

    notebookProps: function (newVal) {
      this.$nextTick(() => {
        if (newVal[0].creator.id !== undefined) {
          this.showEditBtn(newVal[0].creator.id);
        } else {
          this.isMyNotebook = false;
        }
      });
    },
  },
  methods: {
    /**
     * @param {String} creatorId 笔记的作者id
     * 决定是否显示编辑模式按钮
     * */
    showEditBtn(creatorId) {
      if (creatorId === this.$store.getters.getUserId) {
        this.isMyNotebook = true;
      }
    },
    //点击触发
    trigger() {
      this.$nextTick(() => {
        let lis = document.querySelectorAll(".space-left__menu-item");
        lis[this.index].click();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.space-left__menu {
  a {
    text-decoration: none;
  }
}

.space-left__menu-wrap {
  //width: 300px;
  width: 10vw;
  height: 50vh;
  position: fixed;
  left: 25px;
  top: 80px; // header 60px + padding 20px
  background-color: #ffffff;
  margin-right: 15px;
}

.space-left__catalogue-control {
  .space-left__control-label {
    font-size: 0.75rem;
    color: #333333;
  }

  .el-switch {
    margin-left: 10px;
  }
}

.space-left__function-wrap {
  margin: 5px 0 10px;
}
</style>
