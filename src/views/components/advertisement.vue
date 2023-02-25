<template>
  <el-collapse-transition>
    <div class="ad__wrap bg-radius" v-if="adEnable" v-show="adToggle">
      <div class="ad__content">
        <el-link href="" :underline="false" @click="showLinkDisabled('/adLink')">
          <el-image :src="adImg === '' ? adImgPlaceholder : adImg" lazy></el-image>
        </el-link>
      </div>
      <div class="ad__bottom flex-row j-s-b" onselectstart="return false">
        <div class="ad__info">
          <span class="ad__info-title">广告</span>
          <span class="ad__info-desc">点击跳转第三方页面</span>
        </div>
        <div class="ad__close">
          <el-button type="text" class="right-panel__ad-close" @click="adToggle = false">
            关闭
            <el-icon>
              <Close/>
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </el-collapse-transition>
</template>

<script>
import adPlaceholder from "@/assets/images/adPlaceholder.png";
// import adPlaceholder from "@/assets/images/defaultAvatar.jpeg";
import {showLinkDisabled} from "@/utils";
import {Close} from "@element-plus/icons-vue";

export default {
  name: "advertisement",
  components: {Close},
  data() {
    return {
      showLinkDisabled,
      adImg: "",
      adImgPlaceholder: adPlaceholder,
      adEnable: false,
      adToggle: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.ad__wrap {
  height: max-content;
  padding-bottom: 0.5rem;
  //height: 600px;
  margin-bottom: 1rem;
  overflow: hidden;

  .ad__content {
    height: fit-content;

    .el-link {
      cursor: pointer;
    }
  }

  .ad__bottom {
    padding: 0 1rem;
    height: 20px;

    .ad__info-title {
      padding: 0 2px;
      margin: 0 1rem 0 0;
      color: #aaaaaa;
      font-size: 0.75rem;
      border: 1px solid #aaaaaa;
      border-radius: 5px;
    }

    .el-button {
      padding: 0;
      height: 20px;
      min-height: 20px;
    }
  }
}
</style>
