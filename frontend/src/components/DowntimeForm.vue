<template>
    <!-- В шаблоне замените все v-model="downtime..." на v-model="localDowntime..." -->
    <select v-if="!selectedForklift" v-model.number="localDowntime.forklift_id" required>
      <!-- ... -->
    </select>
    
    <input v-model="localDowntime.start_time" type="datetime-local" required />
    <input v-model="localDowntime.end_time" type="datetime-local" />
    <textarea v-model="localDowntime.description" required></textarea>
  </template>
  
  <script>
  export default {
    props: {
      // ... ваши пропсы без изменений
    },
    data() {
      return {
        saving: false,
        localDowntime: this.initializeDowntime()
      };
    },
    methods: {
      initializeDowntime() {
        return {
          id: this.downtime.id || null,
          forklift_id: this.selectedForklift 
            ? this.selectedForklift.id 
            : this.downtime.forklift_id || '',
          start_time: this.downtime.start_time || this.getLocalDateTime(),
          end_time: this.downtime.end_time || '',
          description: this.downtime.description || ''
        };
      },
      getLocalDateTime() {
        const now = new Date();
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
    },
    watch: {
      selectedForklift(newVal) {
        if (newVal) {
          this.localDowntime.forklift_id = newVal.id;
        }
      },
      downtime: {
        deep: true,
        handler(newVal) {
          this.localDowntime = this.initializeDowntime();
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