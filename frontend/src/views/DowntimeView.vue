<template>
    <div>
      <h2>Учет простоев</h2>
      <DowntimeList />
      <router-link to="/" class="back-link">← На главную</router-link>
    </div>
  </template>
  
  <script>
  import DowntimeList from '@/components/DowntimeList.vue';
  
  export default {
    components: { DowntimeList }
  };
  </script>
  