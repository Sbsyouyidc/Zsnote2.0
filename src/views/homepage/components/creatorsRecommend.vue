<template>
  <div class="right-panel__creator-recommend bg-radius flex-col">
    <span class="right-panel__recommend-title">创作者推荐</span>
    <div class="recommend-list__wrap grid">
      <avatar
          style="width: 60px"
          v-for="(creator, key) in creators"
          :user="creator"
          :key="key"
          nameAlign="vertical">
      </avatar>
    </div>
  </div>
</template>

<script>
import Avatar from "@/views/components/avatar";
export default {
  name: "creatorsRecommend",
  components: {Avatar},
  props: ['creators'],
}
</script>

<style lang="scss" scoped>
.right-panel__creator-recommend {
  padding: 1rem 1rem;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
  margin-bottom: 1rem;
}

.right-panel__recommend-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  //padding-bottom: 0.5rem;
  //font-size: 1.2rem;
}

.recommend-list__wrap {
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr);
}
</style>
