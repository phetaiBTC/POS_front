<template>
  <div>
    <a-carousel autoplay class="rounded-2xl overflow-hidden">
      <div>
        <img src="/images/img1.jpg" alt="" class="h-[250px] w-full bg-cover">
      </div>
      <div>
        <img src="/images/img2.jpg" alt="" class="h-[250px] w-full bg-cover">
      </div>
      <div>
        <img src="/images/img3.jpg" alt="" class="h-[250px] w-full bg-cover">
      </div>
    </a-carousel>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
:deep(.slick-slide) {
  text-align: center;
  height: 250px;
  line-height: 250px;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-slide h3) {
  color: #fff;
}
</style>
