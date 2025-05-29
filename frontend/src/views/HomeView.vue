<template>
  <div class="home">
    <h1>Справочник Погрузчиков</h1>

    <!-- Поиск погрузчиков -->
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        placeholder="Поиск по номеру..." 
        @keyup.enter="onSearchInput"
      />
      <button class="search-button" @click="onSearchInput">Поиск</button>
      <span v-if="searchQuery" class="reset-filter" @click="resetSearch">
        ❌ Сбросить фильтр
      </span>
    </div>

    <button class="add-button" @click="showForkliftForm = true">Добавить</button>

    <div class="sections-container">
      <div class="section">
        <ForkliftList 
          ref="forkliftList" 
          :search-query="searchQuery" 
          :selected-forklift-id="selectedForkliftId"
          @select-forklift="onForkliftSelected"
          @update-forklifts="forklifts = $event"  
        />
        <ForkliftForm 
          v-if="showForkliftForm" 
          @close="showForkliftForm = false"
          @saved="refreshForklifts"
        />
      </div>

      <div class="section">
        <div class="section-header">
          <h2>Простои</h2>
          <button class="add-button" @click="showDowntimeForm = true">Добавить</button>
        </div>
        <DowntimeList 
          ref="downtimeList" 
          :selected-forklift-id="selectedForkliftId"
        />
        <DowntimeForm 
          v-if="showDowntimeForm" 
          :forklifts="forklifts"          
          :selected-forklift="selectedForklift"  
          @close="showDowntimeForm = false"
          @saved="refreshDowntimes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ForkliftList from '@/components/ForkliftList.vue';
import ForkliftForm from '@/components/ForkliftForm.vue';
import DowntimeList from '@/components/DowntimeList.vue';
import DowntimeForm from '@/components/DowntimeForm.vue';

export default {
  name: 'HomeView',
  components: {
    ForkliftList,
    ForkliftForm,
    DowntimeList,
    DowntimeForm
  },
  data() {
    return {
      showForkliftForm: false,
      showDowntimeForm: false,
      searchQuery: '',
      selectedForkliftId: null,
      forklifts: [],  // Добавлено для хранения списка погрузчиков
    };
  },
  computed: {
    selectedForklift() {
      return this.forklifts.find(f => f.id === this.selectedForkliftId) || null;
    }
  },
  methods: {
    onSearchInput() {
      if (this.$refs.forkliftList) {
        this.$refs.forkliftList.fetchForklifts(this.searchQuery);
      }
    },
    refreshForklifts() {
      if (this.$refs.forkliftList) {
        this.$refs.forkliftList.fetchForklifts(this.searchQuery);
      }
    },
    refreshDowntimes() {
      if (this.$refs.downtimeList) {
        this.$refs.downtimeList.fetchDowntimes();
      }
    },
    onForkliftSelected(id) {
      this.selectedForkliftId = id;
      this.refreshDowntimes();
    },
    resetSearch() {
      this.searchQuery = '';
      if (this.$refs.forkliftList) {
        this.$refs.forkliftList.fetchForklifts();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.forkliftList && this.$refs.forkliftList.forklifts.length) {
        this.selectedForkliftId = this.$refs.forkliftList.forklifts[0].id;
      }
    });
  }
};
</script>


<style scoped>
.home {
  max-width: 2500px;
  margin: 0 auto;
  padding: 20px;
}
.search-container {
  width: 300px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-container input {
  width: 300px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
}

.search-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #3aa876;
}

.reset-filter {
  color: #e74c3c;
  cursor: pointer;
  font-size: 12px;
  user-select: none;
  white-space: nowrap; /* предотвращает перенос текста */
}

.reset-filter:hover {
  text-decoration: underline;
}


.search-container {
  margin-bottom: 10px;
}

.sections-wrapper {
  width: 100vw;
  overflow-x: auto; /* общий горизонтальный скролл */
}

.sections-container {
  display: flex;
  gap: 5px;
  padding: 10px;
  min-width: 1200px; /* минимальная ширина для размещения обеих секций */
  box-sizing: border-box;
}

.section {
  flex: 1 1 0;
  min-width: 500px; /* чуть больше, чтобы таблицы не сжимались слишком */
  box-sizing: border-box;
  /* Убираем overflow: hidden чтобы не обрезать форму/таблицу */
}




.forklift-form {
  width: 70%;
  max-width: 100%;
  box-sizing: border-box;
}
.add-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #3aa876;
}
</style>
