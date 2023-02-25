<template>
  <div class="home">
    <div class="Book_marks" v-if="showPage">
      <el-row v-loading="loading" element-loading-backgroun="black">
        <el-col
          :span="3"
          v-for="(item, index) in collections"
          :key="index"
          :offset="index > 0 ? 1 : 0"
        >
          <el-card :body-style="{ padding: '0px' }">
            <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
              alt
            />
            <div style="padding: 14px">
              <span>{{ item.title }}</span>
              <div class="bottom flex-row j-end">
                <el-button
                  type="text"
                  class="button"
                  @click="onNoteClick(item.parentId, item.id)"
                >
                  查看
                </el-button>
                <el-popover placement="bottom" :width="100" trigger="click">
                  <template #reference>
                    <el-button type="text" class="button notes__item-more">
                      <el-icon>
                        <more />
                      </el-icon>
                    </el-button>
                  </template>
                  <div class="notes__item-func flex-col j-c">
                    <el-button
                      type="text"
                      class="button notes__item-delete"
                      @click="onNoteShareClick(note.id, note.title)"
                    >
                      <el-icon>
                        <Upload />
                      </el-icon>
                      移动到
                    </el-button>
                    <el-popconfirm
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      :icon="InfoFilled"
                      icon-color="red"
                      title="确认要删除这个笔记？"
                      @confirm="onNoteDelClick(item.id)"
                    >
                      <template #reference>
                        <el-button
                          type="text"
                          class="button notes__item-delete"
                        >
                          <el-icon>
                            <Delete />
                          </el-icon>
                          取消收藏
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </el-popover>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="no_Book_marks" v-else>
      <el-empty description="description" />
    </div>
  </div>
</template>

<script>
import { getNoteDetail } from "@/utils";
import { More, Delete, Upload } from "@element-plus/icons-vue";

export default {
  name: "spaceRightBookmarks",
  components: { More, Delete, Upload },
  data() {
    return {
      collections: [
        {
          collected: true,
          collectors: "",
          contain: "",
          createdDate: "",
          creatorId: "",
          id: "",
          kind: {
            id: "",
            kindName: "",
            parentId: "",
          },
          labels: [
            {
              id: "",
              labelName: "",
            },
          ],
          lastModifiedDate: "",
          liked: true,
          open: true,
          parentId: "",
          readers: 0,
          title: "",
        },
      ],
      collectionsId: [],
      showPage: true,
      loading: true,
    };
  },
  watch: {
    $route(to, from) {
      // console.log(this.$route.params.collectionsId);
      this.initUserChildCollection().then(() => {
        this.isShowPage();
      });
    },
  },
  // 
  methods: {

    async initUserChildCollection() {
      //格式化数据
      this.collections = [];
      this.loading = true;
      this.collectionsId = this.$route.params.collectionsId;
      for (let index = 0; index < this.collectionsId.length; index++) {
        // console.log(this.collectionsId[index]);
        await getNoteDetail(this.collectionsId[index])
          .then((r) => {
            return r.json();
          })
          .then((res) => {
            this.collections.push(res);
          });
      }
      this.loading = false;
    },
    onNoteClick(parentId, id) {
      const noteLink = this.$router.resolve({
        path: `/notebook/${parentId}/note/${id}`,
        query: { isBookmark: true },
      });
      window.open(noteLink.href, "_blank");
    },
    // 判断是否有收藏列表
    isShowPage() {
      this.showPage = this.collections.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  margin-left: 2rem;
  margin-bottom: 2rem;
  span {
    max-height: 40px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.el-tag {
  margin-top: 7px;
  margin-left: 3px;
}
.image {
  width: 100%;
  display: block;
}

.clearfix::after {
  contain: "";
  display: display;
  height: 0;
  clear: both;
}
a {
  text-decoration: none;
}
</style>
