<template>
    <div class="modal">
      <div class="modal-content">
        <form @submit.prevent="saveDowntime" class="form">

<select v-if="!selectedForklift" v-model.number="localDowntime.forklift_id" required>
  <option disabled value="">Выберите погрузчик</option>
  <option v-for="forklift in forklifts" :key="forklift.id" :value="forklift.id">
    {{ forklift.number }} ({{ forklift.brand }})
  </option>
</select>

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
  <button type="submit" class="btn save">💾 Сохранить</button>
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
      downtime: {
        type: Object,
        default: () => ({
          forklift_id: null,
          start_time: '',
          end_time: '',
          description: '',
        }),
      },
      forklifts: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        localDowntime: { ...this.downtime },
      };
    },
    computed: {
      forkliftNumber() {
        const forklift = this.forklifts.find(f => f.id === this.localDowntime.forklift_id);
        return forklift ? forklift.number : '—';
      }
    },
    watch: {
      downtime: {
        immediate: true,
        handler(newVal) {
          this.localDowntime = { ...newVal };
        }
      }
    },
    methods: {
      async saveDowntime() {
        if (this.localDowntime.id) {
          await api.put(`/downtimes/${this.localDowntime.id}`, this.localDowntime);
        } else {
          await api.post('/downtimes', this.localDowntime);
        }
        this.$emit('saved');
        this.$emit('close');
      },
    },
  };
  </script>
  
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 10px;
    width: 420px;
    max-width: 90%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    margin-bottom: 16px;
    font-size: 18px;
    color: #333;
    text-align: center;
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
  }
  
  .save {
    background-color: #42b983;
    color: white;
  }
  
  .save:hover {
    background-color: #36a173;
  }
  
  .cancel {
    background-color: #e74c3c;
    color: white;
  }
  
  .cancel:hover {
    background-color: #c0392b;
  }
  </style>
  