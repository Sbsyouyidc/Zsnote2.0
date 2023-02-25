<template>
  <div class="right-panel__wrap">
    <div class="right-panel__creator bg-radius flex-col" v-if="isLogged">
      <span class="right-panel__creator-title">创作中心</span>
      <div class="right-panel__creator-info-wrap creator-grid">
        <div class="right-panel__creator-info flex-col">
          <span class="right-panel__creator-info-key creator-info-item">今日阅读量</span>
          <span class="right-panel__creator-info-val creator-info-item">{{ creatorInfo.todayRead }}</span>
          <span class="right-panel__creator-info-key creator-info-item">总阅读量</span>
          <span class="right-panel__creator-info-sub-val creator-info-item">{{ creatorInfo.totalRead }}</span>
        </div>
        <div class="right-panel__creator-info flex-col">
          <span class="right-panel__creator-info-key creator-info-item">今日互动量</span>
          <span class="right-panel__creator-info-val creator-info-item">{{ creatorInfo.todayInteract }}</span>
          <span class="right-panel__creator-info-key creator-info-item">总互动量</span>
          <span class="right-panel__creator-info-sub-val creator-info-item">{{ creatorInfo.totalInteract }}</span>
        </div>
        <!--        <div class="right-panel__creator-info"></div>-->
        <!--        <div class="right-panel__creator-info"></div>-->
      </div>
    </div>
    <div class="right-panel__creator no-login bg-radius flex-col a-c j-c" v-else>
      <span class="right-panel__creator-title">登录体验更多精彩</span>
      <div class="">
        <el-button
            type="primary"
            round
            size="large"
            @click="onLoginBtnClick">
          登录
        </el-button>
      </div>
    </div>
    <creators-recommend :creators="this.recommendUsers"></creators-recommend>
    <advertisement></advertisement>
    <bottom-copyright></bottom-copyright>
  </div>
</template>

<script>

import {getRecommendUsers, showLinkDisabled} from "@/utils";
import Advertisement from "@/views/components/advertisement";
import BottomCopyright from "@/views/homepage/components/bottomCopyright";
import CreatorsRecommend from "@/views/homepage/components/creatorsRecommend";

export default {
  name: "homepageRightPanel",
  components: {
    Advertisement,
    BottomCopyright,
    CreatorsRecommend
  },
  data() {
    return {
      showLinkDisabled,
      creatorInfo: {
        todayRead: 130,
        totalRead: 130,
        todayInteract: 130,
        totalInteract: 130,
      },
      recommendUsers: [],
      isLogged: false,
    }
  },
  created() {
    getRecommendUsers()
        .then(res => {
          this.recommendUsers = res;
        });
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.watch(state => state.userInfo.name, (newVal) => {
        if (newVal !== "" || newVal !== null || true) {
          this.isLogged = true;
        }
      })
    })
  },
  methods: {
    onLoginBtnClick() {
      this.$store.dispatch("changeLoginModal", true);
    },
  }
}
</script>

<style lang="scss" scoped>
.no-login {
  height: 100px;
}

.right-panel__creator {
  padding: 1rem 1rem;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
  margin-bottom: 1rem;

  .right-panel__creator-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
    //padding-bottom: 0.5rem;
    //font-size: 1.2rem;
  }

  .right-panel__creator-info-wrap {
    background-color: #f5f5f5;

    .right-panel__creator-info {
      //height: 5rem;
      height: max-content;
      text-align: center;
      padding: 0.5rem 0;

      .right-panel__creator-info-key {
        color: #999;
      }

      .right-panel__creator-info-val {
        font-weight: bold;
        font-size: 1.2rem;
      }

      .right-panel__creator-info-sub-val {
        color: #999;
      }

      .creator-info-item {
        padding: 0.25rem 0;
      }
    }
  }
}

.right-panel__creator-info:first-child {
  border-right: 1px solid #ccc;
}

.creator-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
