<template>
    <div class="modal">
      <div class="modal-content">
        <h3>{{ localDowntime.id ? 'Редактирование простоя' : 'Новый простой' }}</h3>
        <form @submit.prevent="saveDowntime" class="form">
          <select v-if="!selectedForklift" v-model.number="localDowntime.forklift_id" required>
            <option disabled value="">Выберите погрузчик</option>
            <option v-for="forklift in forklifts" :key="forklift.id" :value="forklift.id">
              {{ forklift.number }} ({{ forklift.brand }})
            </option>
          </select>
  
          <div v-else class="selected-forklift">
            Выбран погрузчик: <strong>{{ selectedForklift.number }} ({{ selectedForklift.brand }})</strong>
          </div>
  
          <div class="datetime-row">
            <div class="datetime-block">
              <label>Начало</label>
              <input v-model="localDowntime.start_time" type="datetime-local" required />
            </div>
  
            <div class="datetime-block">
              <label>Окончание</label>
              <input v-model="localDowntime.end_time" type="datetime-local" />
            </div>
          </div>
  
          <label>Описание инцидента:</label>
          <textarea v-model="localDowntime.description" required></textarea>
  
          <div class="buttons">
            <button type="submit" class="btn save" :disabled="saving">
              {{ saving ? 'Сохранение...' : '💾 Сохранить' }}
            </button>
            <button type="button" @click="$emit('close')" class="btn cancel">✖ Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/api';
  
  export default {
    props: {
      forklifts: {
        type: Array,
        required: true,
      },
      selectedForklift: {
        type: Object,
        default: null,
      },
      downtime: {
        type: Object,
        default: () => ({
          id: null,
          forklift_id: '',
          start_time: '',
          end_time: '',
          description: ''
        })
      }
    },
    data() {
        console.log(this.downtime);
      return {
        saving: false,
        localDowntime: {
          ...this.downtime,
          forklift_id: this.selectedForklift ? this.selectedForklift.id : this.downtime.forklift_id || '',
          start_time: this.getDateTime(this.downtime.start_time) || this.getLocalDateTime(),
          end_time: this.getDateTime(this.downtime.end_time) || ''
        }
      };
    },
    watch: {
      selectedForklift(newVal) {
        if (newVal) {
          this.localDowntime.forklift_id = newVal.id;
        }
      },
      downtime(newVal) {
        this.localDowntime = {
          ...newVal,
          forklift_id: this.selectedForklift ? this.selectedForklift.id : newVal.forklift_id || ''
        };
      }
    },
    methods: {
      getLocalDateTime() {
        const now = new Date();
        const tzOffset = now.getTimezoneOffset() * 60000;
        return new Date(now - tzOffset).toISOString().slice(0, 16);
      },
      getDateTime(time) {
        const now = new Date(time);
        const tzOffset = now.getTimezoneOffset() * 60000;
        return new Date(now - tzOffset).toISOString().slice(0, 16);
      },
      async saveDowntime() {
        if (this.saving) return;
        this.saving = true;
  
        const payload = { ...this.localDowntime };
        if (!payload.end_time) {
          delete payload.end_time;
        }
  
        try {
          if (payload.id) {
            await api.put(`/downtimes/${payload.id}`, payload);
          } else {
            await api.post('/downtimes', payload);
          }
          this.$emit('saved');
          this.$emit('close');
        } catch (error) {
          alert('Ошибка при сохранении простоя. Попробуйте ещё раз.');
          console.error(error);
        } finally {
          this.saving = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 10px;
    width: 500px;
    max-width: 95%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    margin-bottom: 16px;
    font-size: 18px;
    color: #333;
    text-align: center;
  }
  
  .selected-forklift {
    margin-bottom: 15px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
  }
  
  label {
    display: block;
    margin-top: 12px;
    font-weight: 600;
    color: #555;
  }
  
  input, select, textarea {
    width: 100%;
    margin-top: 6px;
    padding: 8px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .datetime-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 12px;
  }
  
  .datetime-block {
    flex: 1;
  }
  
  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .btn {
    padding: 8px 16px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .save {
    background-color: #42b983;
    color: white;
  }
  
  .save:hover:not(:disabled) {
    background-color: #36a173;
  }
  
  .save:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .cancel {
    background-color: #e74c3c;
    color: white;
  }
  
  .cancel:hover {
    background-color: #c0392b;
  }
  </style> 