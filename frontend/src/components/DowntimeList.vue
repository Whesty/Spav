<template>
    <div class="downtime-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Погрузчик</th>
            <th>Начало простоя</th>
            <th>Конец простоя</th>
            <th>Длительность</th>
            <th>Причина</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="downtime in filteredDowntimes" :key="downtime.id">
            <td>{{ getForkliftNumber(downtime.forklift_id) }}</td>
            <td>{{ formatDate(downtime.start_time) }}</td>
            <td>{{ downtime.end_time ? formatDate(downtime.end_time) : '—' }}</td>
            <td>{{ calculateDuration(downtime) }}</td>
            <td>{{ downtime.description }}</td>
            <td>
              <button @click="editDowntime(downtime)" class="action-btn edit">✏️</button>
              <button @click="deleteDowntime(downtime.id)" class="action-btn delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <DowntimeForm
        v-if="showEditForm"
        :downtime="editedDowntime"
        :forklifts="forklifts"
        @close="closeEditForm"
        @saved="handleSaved"
      />
    </div>
  </template>
  
  <script>
  import api from '@/api';
  import DowntimeForm from './DowntimeForm.vue';
  
  export default {
    components: {
      DowntimeForm
    },
    props: {
      selectedForkliftId: {
        type: [Number, String],
        default: null,
      },
    },
    data() {
      return {
        downtimes: [],
        forklifts: [],
        showEditForm: false,
        editedDowntime: null
      };
    },
    computed: {
      selectedForklift() {
        return this.forklifts.find(f => f.id === this.selectedForkliftId) || null;
      },
      filteredDowntimes() {
        if (!this.selectedForkliftId) return this.downtimes;
        return this.downtimes
          .filter(d => d.forklift_id === this.selectedForkliftId)
          .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
      }
    },
    methods: {
      async fetchDowntimes() {
        try {
          const response = await api.get('/downtimes');
          this.downtimes = response.data;
        } catch (error) {
          console.error('Ошибка при загрузке простоев:', error);
          alert('Не удалось загрузить данные о простоях');
        }
      },
      async fetchForklifts() {
        try {
          const response = await api.get('/forklifts');
          this.forklifts = response.data;
        } catch (error) {
          console.error('Ошибка при загрузке погрузчиков:', error);
        }
      },
      getForkliftNumber(id) {
        const forklift = this.forklifts.find(f => f.id === id);
        return forklift ? forklift.number : '—';
      },
      formatDate(date) {
        if (!date) return '—';
        const d = new Date(date);
        return isNaN(d.getTime()) ? '—' : d.toLocaleString();
      },
      calculateDuration(downtime) {
        if (!downtime.end_time) return 'В процессе';
  
        const start = new Date(downtime.start_time);
        const end = new Date(downtime.end_time);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return '—';
  
        const diffMs = end - start;
        if (diffMs < 0) return 'Неверные даты';
  
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
        return `${hours > 0 ? `${hours}ч ` : ''}${minutes}м`.trim();
      },
      editDowntime(downtime) {
        this.editedDowntime = { ...downtime };
        this.showEditForm = true;
      },
      closeEditForm() {
        this.showEditForm = false;
        this.editedDowntime = null;
      },
      async handleSaved() {
        await this.fetchDowntimes();
        this.closeEditForm();
      },
      async deleteDowntime(id) {
        if (!confirm('Удалить этот простой?')) return;
  
        try {
          await api.delete(`/downtimes/${id}`);
          await this.fetchDowntimes();
        } catch (error) {
          console.error('Ошибка при удалении простоя:', error);
          alert('Не удалось удалить простой');
        }
      }
    },
    async mounted() {
      await this.fetchForklifts();
      await this.fetchDowntimes();
    }
  };
  </script>
  
  <style scoped>
  .downtime-container {
    margin: 20px 0;
    overflow-x: auto;
  }
  
  .styled-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    box-shadow: 0 2px 3px rgba(0,0,0,0.1);
  }
  
  .styled-table th,
  .styled-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .styled-table th {
    background-color: #f8f9fa;
    font-weight: 600;
  }
  
  .styled-table tr:hover {
    background-color: #f5f5f5;
  }
  
  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 5px;
    margin: 0 3px;
    transition: transform 0.2s;
  }
  
  .action-btn:hover {
    transform: scale(1.2);
  }
  
  .action-btn.edit {
    color: #42b983;
  }
  
  .action-btn.delete {
    color: #e74c3c;
  }
  
  .no-data {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  </style>