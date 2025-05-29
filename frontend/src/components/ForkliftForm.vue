<template>
    <div class="modal">
      <div class="modal-content">
        <h3>{{ localForklift.id ? 'Редактировать' : 'Добавить' }} погрузчик</h3>
        <form @submit.prevent="saveForklift" class="form">
          <label>Бренд:</label>
          <input type="text" v-model="localForklift.brand" required />
  
          <label>Номер:</label>
          <input type="text" v-model="localForklift.number" required />
  
          <label>Грузоподъемность (т):</label>
          <input
            type="number"
            v-model.number="localForklift.capacity"
            step="0.001"
            required
          />
          <label>Пользователь:</label>
<input type="text" v-model="localForklift.user_name" required />

  
          <label class="checkbox-label">
            <input v-model="localForklift.is_active" type="checkbox" />
            Активен
          </label>
  
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
      forklift: {
        type: Object,
        default: () => ({
          brand: '',
          number: '',
          capacity: 0,
          is_active: true,
          user_name: '',
        }),
      },
    },
    data() {
      return {
        localForklift: { ...this.forklift },
      };
    },
    watch: {
      forklift(newVal) {
        this.localForklift = { ...newVal };
      },
    },
    methods: {
      async saveForklift() {
        if (this.localForklift.id) {
          await api.put(`/forklifts/${this.localForklift.id}`, this.localForklift);
        } else {
          await api.post('/forklifts', this.localForklift);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

h3 {
  margin-bottom: 16px;
  font-size: 20px;
  color: #333;
}

.form label {
  display: block;
  margin: 12px 0 6px;
  font-weight: 600;
  color: #555;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  outline: none;
  transition: border 0.2s;
}

input[type="text"]:focus,
input[type="number"]:focus {
  border-color: #42b983;
}

.checkbox-label {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #444;
}

.buttons {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  