<template>
  <el-popover
    placement="bottom"
    :width="200"
    trigger="hover"
    :disabled="popoverDisabled"
  >
    <template #reference>
      <a
        class="avatar-item j-c a-c"
        :class="getTagAlign(nameAlign)"
        href="javascript:void(0)"
        @click="toUserSpace(user.id)"
      >
        <img class="user-avatar" :src="user.portrait" alt />
        <span class="user-name" v-show="nameVisible">{{ user.name }}</span>
      </a>
    </template>
    <template #default>
      <div class="user-info__wrap grid">
        <a href="javascript:void(0)" @click="toUserSpace(user.id)">
          <img class="user-avatar" :src="user.portrait" alt />
        </a>
        <div class="user-info__inner span-col-2">
          <div :class="getUsernameAlign(nameAlign)">
            <span>{{ user.name }}</span>
          </div>
          <div class="user-desc">
            {{
              user.detail !== null || ""
                ? user.detail
                : "这个人神秘，什么都没有写。"
            }}
          </div>
        </div>
        <div class="user-info__func span-col-3 flex-row j-s-b">
          <el-button type="primary" @click="onFollowClick">
            <el-icon><circle-plus /></el-icon>
            <span>关注</span>
          </el-button>
          <el-button @click="onMessageClick">
            <el-icon><message /></el-icon>
            <span>私信</span>
          </el-button>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
// import {ElNotification} from "element-plus";
// import {h} from "vue";
import { Message, CirclePlus } from "@element-plus/icons-vue";
import { showLinkDisabled } from "@/utils";

export default {
  name: "avatar",
  components: {
    Message,
    CirclePlus,
  },
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({
        id: "",
        name: "",
        portrait: "",
        detail: "",
      }),
    },
    nameAlign: {
      type: String,
      default: "vertical",
    },
    nameVisible: {
      type: Boolean,
      default: true,
    },
    popoverDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getTagAlign(alignment) {
      if (alignment === "vertical") {
        return "avatar-item__vertical flex-col";
      } else {
        return "avatar-item__horizontal flex-row";
      }
    },
    getUsernameAlign(alignment) {
      if (alignment === "vertical") {
        return "user-name__vertical";
      } else {
        return "user-name__horizontal";
      }
    },
    toUserSpace(ID) {
      showLinkDisabled(`/user/${ID.toString()}`);
      // this.$router.push(`/user/${ID.toString()}`)
    },
    onFollowClick() {
      showLinkDisabled(`关注用户:${this.user.name}`);
    },
    onMessageClick() {
      // showLinkDisabled(`私信用户:${this.user.id}`);
      this.$router.push({
        name: "statistics",
        params: {
          id: this.user.id,
          name: this.user.name,
          portrait: this.user.portrait,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-item {
  width: 100%;
  margin: 10px auto;
  text-align: center;
  //margin: 10px 0;
  text-decoration: none;
  color: #333;
}

.user-avatar {
  margin: auto;
}

.avatar-item__horizontal {
  margin: auto;
}
.avatar-item__vertical {
  margin: 0 auto;
}

.user-name__horizontal {
  margin: auto;
}
.user-name__vertical {
  margin: 5px auto;
}

.user-info__wrap {
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.span-col-2 {
  grid-column: span 2 / auto;
}
.span-col-3 {
  grid-column: span 3 / auto;
}
</style>
