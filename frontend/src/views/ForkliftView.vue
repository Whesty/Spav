<template>
    <div>
      <h2>Управление погрузчиками</h2>
      <ForkliftList />
      <router-link to="/" class="back-link">← На главную</router-link>
    </div>
  </template>
  
  <script>
  import ForkliftList from '@/components/ForkliftList.vue';
  
  export default {
    components: { ForkliftList }
  };
  </script>
  