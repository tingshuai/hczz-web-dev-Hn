<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>

    <!-- 如果需要滚动条 -->
    <div class="swiper-scrollbar"></div>
  </div>
</template>

<script>
  import api from '@/fetch/api.js';
  export default {
      data () {
          return {

          };
      },
      mounted () {
          new Swiper('.swiper-container', {
              loop: true,
              // 如果需要分页器
              pagination: '.swiper-pagination',
              // 如果需要前进后退按钮
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              // 如果需要滚动条
              scrollbar: '.swiper-scrollbar'
          });
      },
      methods: {

      }
  };
</script>

<style lang="less">

</style>