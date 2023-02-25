<template>
  <div class="left-panel__wrap bg-radius" style="overflow: auto">
    <div class="left-panel__header flex-row j-s-b">
      <h3>
        {{
          homepageNoteList === '热门推荐'
              ? '今日热门推荐'
              : '我的关注动态'
        }}
      </h3>
      <div class="left-panel__func flex-row">
        <div class="left-panel__func-switch">
          <el-radio-group v-model="homepageNoteList">
            <el-radio-button label="热门推荐"></el-radio-button>
            <el-radio-button label="关注动态"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="left-panel__func-filter">
          <el-button @click="tagFilterVisibility = true">标签管理</el-button>
          <el-drawer
              v-model="tagFilterVisibility"
              title=""
              :with-header="false"
              direction="rtl"
              :before-close="drawerHandleClose">
            <div class="filter-panel__wrap flex-col">
              <div class="filter-panel__title">
                <h3>标签过滤</h3>
              </div>
              <div class="filter-panel__cont">
                <div class="filter-panel__cont-title">
                  减少推荐
                </div>
                <div class="filter-panel__cont-item">
                  <el-input></el-input>
                </div>
              </div>
            </div>
          </el-drawer>
        </div>
      </div>
    </div>
    <ul
        class="left-panel__scroll-list"
        v-infinite-scroll="loadNotes"
        infinite-scroll-immediate="false">
      <li
          v-for="noteItem in (homepageNoteList==='热门推荐'? hotNoteList : followNoteList)"
          :key="noteItem.id">
        <homepage-note-item
            :noteInfoProps="noteItem"
        ></homepage-note-item>
      </li>
    </ul>
    <div class="left-panel__hint">
      <h3 @click="loadNotes">下拉加载更多...</h3>
    </div>
  </div>
</template>

<script>
import HomepageNoteItem from "@/views/homepage/components/homepageNoteItem";
import {ElMessage, ElMessageBox} from "element-plus";
import {getCommendNotes} from "@/utils";
import {msgDuration, msgTextAlign, msgType} from "@/utils/basic/Notification";

const HOT_LIST = '热门推荐';
const FOLLOW_LIST = '关注动态';

export default {
  name: "homepageLeftPanel",
  components: {HomepageNoteItem},
  data() {
    return {
      tagFilterVisibility: false,
      homepageNoteList: HOT_LIST,
      bufferList: [],
      hotNoteList: [],
      followNoteList: [],
      hotPageNum: 0,
      followPageNum: 0,
      pageSize: 10,
    }
  },
  watch: {
    homepageNoteList: 'noteListChanged',
  },
  created() {
    this.loadNotes();
  },
  methods: {
    /**
     * @description 笔记列表切换类别，判断如果切换到关注列表且为首次切换则执行对应内容
     * */
    noteListChanged(val) {
      if (val === FOLLOW_LIST && this.followPageNum === 0) {
        this.loadNotes();
      }
    },
    /**
     * @description 加载更多笔记。
     * */
    async loadNotes() {
      // 要加载的指定页码判断
      let whichPageNum
          = this.homepageNoteList === HOT_LIST
          ? this.hotPageNum
          : this.followPageNum;

      // 请求服务器推荐笔记，默认一次加载10篇
      const res = getCommendNotes(whichPageNum, this.pageSize);
      if (whichPageNum === 0) {
        // 第一页先放进缓存
        await res.then(r => {
          this.homepageNoteList === HOT_LIST
              ? this.hotNoteList = r
              : this.followNoteList = r;
        });
      } else {
        this.homepageNoteList === HOT_LIST
            ? this.hotNoteList.push.apply(this.hotNoteList, res)
            : this.followNoteList.push.apply(this.hotNoteList, res);
      }
      // 下次加载的页码
      this.homepageNoteList === HOT_LIST
          ? this.hotPageNum++
          : this.followPageNum++;
      // getCommendNotes(whichPageNum, this.pageSize)
      //     .then(res => {
      //       // 根据笔记列表类别进行赋值
      //       if (whichPageNum === 0) {
      //         this.homepageNoteList === HOT_LIST
      //             ? this.hotNoteList = res
      //             : this.followNoteList = res;
      //       } else {
      //         this.homepageNoteList === HOT_LIST
      //             ? this.hotNoteList.push.apply(this.hotNoteList, res)
      //             : this.followNoteList.push.apply(this.hotNoteList, res);
      //       }
      //       // 下次加载的页码
      //       this.homepageNoteList === HOT_LIST
      //           ? this.hotPageNum++
      //           : this.followPageNum++;
      //     });
    },
    /**
     * @description 标签管理抽屉关闭前事件
     * @param {Function} done 无返回值的关闭事件
     * */
    drawerHandleClose(done = () => {
      void (0)
    }) {
      ElMessageBox.confirm('是否保存标签过滤选项？', {
        confirmButtonText: '保存',
        cancelButtonText: '不保存'
      })
          .then(() => {
            done()
            ElMessage({message: '保存', type: 'info'})
          })
          .catch((action) => {
            done()
            ElMessage({
              type: 'info',
              message:
                  action === 'cancel'
                      ? '标签过滤未保存'
                      : '标签过滤已保存',
            })
          })
    }
  }
}
</script>

<style lang="scss" scoped>
.left-panel__wrap {
  width: 100%;
}

.left-panel__header {
  height: 50px;
  text-align: left;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;

  h3 {
    margin: 10px 0;
  }

  .left-panel__func {
    margin: auto 0;

    .left-panel__func-switch {
      margin: 0 10px;
    }
  }
}

.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
  box-shadow: none;
}

.left-panel__hint {
  text-align: center;
  /*padding: 5px 0;*/
  h3 {
    margin: 10px 0;
  }
}

.left-panel__scroll-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

</style>
