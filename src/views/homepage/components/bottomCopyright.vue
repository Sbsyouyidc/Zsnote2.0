<template>
  <div class="right-panel__copyright flex-col">
    <!--      <span>备案号 <a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备无</a>.</span>-->
    <div>
      Copyright © 2021
      <el-popover
          placement="bottom"
          :width="300"
          :popper-style="popoverStyle"
          trigger="hover"
          :title="bottomLinksTitle">
        <template #reference>
          <a>ZSNote Studio</a>
        </template>
        <div class="bottom-links flex-col j-start">
          <a v-for="(item, key) in bottomLinks" :key="key" :href="item.link" target="_blank">{{ item.name }}</a>
        </div>
      </el-popover>
      all right reserved.
    </div>
  </div>
</template>

<script>
export default {
  name: "bottomCopyright",
  data() {
    return {
      popoverStyle: 'box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, ' +
          'rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;',
      bottomLinksTitle: '知市笔记的相关链接',
      bottomLinks: [
        {
          name: '武昌首义学院',
          link: 'http://www.wsyu.edu.cn/'
        },
        {
          name: 'daniel',
          link: 'https://github.com/DanielSimgame/'
        },
        {
          name: 'keker',
          link: 'https://keker.icu/'
        },
        {
          name: 'zyf',
          link: 'javascript:alert("目前未有链接")'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.right-panel__copyright {
  text-align: center;
  padding: 15px;
  background-color: #f5f5f5;
  color: #aaaaaa;

  a {
    color: #aaaaaa;
  }

  a:hover {
    color: #333333;
  }
}

.bottom-links {
  a {
    font-size: 16px;
    margin: 5px 0;
    text-decoration: underline 0 transparent;
    color: #333333;
  }

  a:hover {
    text-decoration: underline 1px #333333;
    transition: all 0.25s ease-in-out;
  }
}
</style>
