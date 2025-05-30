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
            <th>Изменить</th> <!-- новый столбец -->
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
              <button class="action-button edit" @click.stop="editDowntime(forklift)">✏️</button>
              <button class="action-button delete" @click.stop="deleteDowntime(forklift.id)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>
      <DowntimeForm
  v-if="showEditForm"
  :downtime="editedDowntime"
  :forklifts="forklifts"
  :selectedForklift="selectedForklift"
  @close="showEditForm = false"
  @saved="onSaved"   
/>

      
    </div>
  </template>
  
  <script>
  import api from '@/api';
  
  export default {
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
        showEditForm: false,         // показывать/скрывать форму
    editedDowntime: null,
      };
    },
    computed: {
  selectedForklift() {
    return this.forklifts.find(f => f.id === this.selectedForkliftId) || null;
  },
  filteredDowntimes() {
    if (!this.selectedForkliftId) return [];
    return this.downtimes
      .filter(d => d.forklift_id === this.selectedForkliftId)
      .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
  }},
    methods: {
      async fetchDowntimes() {
        try {
          const response = await api.get('/downtimes');
          this.downtimes = response.data;
        } catch (error) {
          console.error('Ошибка при загрузке простоев:', error);
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
  
        const hoursStr = hours > 0 ? `${hours}ч` : '';
        const minutesStr = minutes > 0 ? `${minutes}м` : '';
        return (hoursStr + ' ' + minutesStr).trim() || '0м';
      },
      editDowntime(downtime) {
        this.showEditForm = true;
        console.log('showEditForm = true')
        this.editedDowntime = { ...downtime };  // копия
    
  },
  async onSaved() {
    this.showEditForm = false;
    await this.fetchDowntimes();
  },
      async deleteDowntime(id) {
        if (!confirm('Удалить этот простой?')) return;
  
        try {
          await api.delete(`/downtimes/${id}`);
          this.fetchDowntimes();
        } catch (error) {
          console.error('Ошибка при удалении простоя:', error);
          alert('Не удалось удалить простой');
        }
      },
      async onSaved() {
  this.showEditForm = false;
  await this.fetchDowntimes();  // обновляем данные после сохранения
},

    },
    mounted() {
      this.fetchForklifts();
      this.fetchDowntimes();
    }
  };
  </script>
  
  <style scoped>
  .downtime-container {
    overflow-x: auto;
  }
  
  .styled-table {
    border-collapse: collapse;
    background-color: white;
    font-size: 12px;
  }
  
  .styled-table thead {
    background-color: #f5f5f5;
  }
  
  .styled-table tbody tr:hover {
    background-color: #f0f9ff;
  }
  .styled-table th,
  .styled-table td {
    border: 1px solid #ddd;
    padding: 12px 4px;
    text-align: left;
  }
  .styled-table td:first-child {
    padding-left: 2px !important;
  }
  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    margin-right: 4px;
  }
  .action-btn:hover {
    opacity: 0.8;
  }
  .action-btn.delete {
    color: red;
  }
  </style>
  