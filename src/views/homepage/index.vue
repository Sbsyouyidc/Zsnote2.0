<template>
  <div class="container grid">
    <homepage-left-panel class="span-col-2"></homepage-left-panel>
    <homepage-right-panel></homepage-right-panel>
  </div>
</template>

<script>
import { getScriptList } from "@/utils/index"
import homepageLeftPanel from "@/views/homepage/components/homepageLeftPanel";
import HomepageRightPanel from "@/views/homepage/components/homepageRightPanel";
export default {
  name: "Home",
  components: {
    HomepageRightPanel,
    homepageLeftPanel
  },
  data() {
    return {
      articleList: [
        {
          articleName: "文章名称",
          articleDesc: "文章简述",
          like: 10,
          dislike: 10,
          comments: 15,
        }, {
          articleName: "文章名称",
          articleDesc: "文章简述",
          like: 10,
          dislike: 10,
          comments: 15,
        },
      ]
    }
  },
  created() {
    // getScriptList().then(res=> {
    //   console.log(res);
    // })
  }
};
</script>

<style lang="scss" scoped>
//.container {
//  margin-top: 15px;
//  margin-bottom: 15px;
//}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.span-col-2 {
  grid-column: span 2 / auto;
}


</style>
