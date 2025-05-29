<template>
    <div class="forklift-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Код записи</th>  <!-- заменил № на Код записи -->
            <th>Бренд</th>
            <th>Номер</th>
            <th>Грузоподъемность (т)</th>
            <th>Статус</th>
            <th>Время и дата изменения</th>  <!-- новый -->
            <th>Пользователь</th>             <!-- новый -->
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="forklift in forklifts" 
            :key="forklift.id"
            :class="{ selected: forklift.id === selectedForkliftId }"
            @click="$emit('select-forklift', forklift.id)"
          >
            <td>{{ forklift.id }}</td>
            <td>{{ forklift.brand }}</td>
            <td>{{ forklift.number }}</td>
            <td>{{ forklift.capacity }}</td>
            <td :class="{ active: forklift.is_active, inactive: !forklift.is_active }">
              {{ forklift.is_active ? 'Активен' : 'Не активен' }}
            </td>
            <td>{{ formatDate(forklift.updated_at) }}</td> <!-- форматируем дату -->
            <td>{{ forklift.user_name }}</td>
            <td>
              <button class="action-button edit" @click.stop="editForklift(forklift)">✏️</button>
              <button class="action-button delete" @click.stop="deleteForklift(forklift.id)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <ForkliftForm 
        v-if="showForm" 
        :forklift="selectedForklift"
        @close="showForm = false"
        @saved="fetchForklifts"
      />
    </div>
  </template>
  
  <script>
  import api from '@/api';
  import ForkliftForm from './ForkliftForm.vue';
  
  export default {
    components: { ForkliftForm },
    props: {
      searchQuery: {
        type: String,
        default: ''
      },
      selectedForkliftId: {
        type: [Number, String],
        default: null
      }
    },
    data() {
      return {
        forklifts: [],
        showForm: false,
        selectedForklift: null,
      };
    },
    watch: {
      searchQuery() {
        this.fetchForklifts();
      }
    },
    methods: {
      async fetchForklifts() {
        const response = await api.get('/forklifts', {
          params: { number: this.searchQuery }
        });
        this.forklifts = response.data;
        this.$emit('update-forklifts', this.forklifts);
      },
      editForklift(forklift) {
        this.selectedForklift = { ...forklift };
        this.showForm = true;
      },
      async deleteForklift(id) {
        if (confirm('Удалить погрузчик?')) {
          await api.delete(`/forklifts/${id}`);
          this.fetchForklifts();
        }
      },
      formatDate(dateString) {
        if (!dateString) return '';
        const options = {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        };
        return new Date(dateString).toLocaleString('ru-RU', options);
      }
    },
    mounted() {
      this.fetchForklifts();
    },
  };
  </script>

  
  
  <style scoped>
  .forklift-container {
    overflow-x: auto;
  }
  
  .styled-table {
    border-collapse: collapse;
    font-size: 10px;
    background-color: white;
  }
  
  .styled-table thead {
    background-color: #f5f5f5;
  }
  
  .styled-table th,
  .styled-table td {
    padding: 1px 5px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .styled-table tbody tr:hover {
    background-color: #f0f9ff;
  }
  
  .action-button {
    margin-right: 8px;
    border: none;
    background: none;
    font-size: 16px;
    cursor: pointer;
  }
  
  .action-button.edit {
    color: #4caf50;
  }
  
  .action-button.delete {
    color: #f44336;
  }
  
  .active {
    color: #4caf50;
    font-weight: bold;
  }
  
  .inactive {
    color: #f44336;
    font-weight: bold;
  }
  .selected {
  background-color: #d0e8ff;
}
  </style>
  