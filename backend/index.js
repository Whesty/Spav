const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
require('dotenv').config();


app.use(cors());
app.use(bodyParser.json());

// ====================== FORKLIFTS CRUD ====================== //

// Получить все погрузчики (с поиском по номеру)
app.get('/forklifts', async (req, res) => {
  try {
    const { number } = req.query;
    const query = number
      ? `SELECT * FROM public.forklifts WHERE LOWER(number) LIKE LOWER('%${number}%')`
      : 'SELECT * FROM public.forklifts';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить погрузчик по ID
app.get('/forklifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM public.forklifts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Погрузчик не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить новый погрузчик
app.post('/forklifts', async (req, res) => {
    try {
      const { brand, number, capacity, is_active, user_name } = req.body;
      const result = await pool.query(
        'INSERT INTO public.forklifts (brand, number, capacity, is_active, user_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [brand, number, capacity, is_active ?? true, user_name]
      );
      console.log('New forklift added:', result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });
  

// Обновить погрузчик
app.put('/forklifts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { brand, number, capacity, is_active, user_name } = req.body;
      const result = await pool.query(
        'UPDATE public.forklifts SET brand = $1, number = $2, capacity = $3, is_active = $4, user_name = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
        [brand, number, capacity, is_active, user_name, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Погрузчик не найден' });
      }
      res.json(result.rows[0]);
      
      console.log('forklift upded:', result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });
  

// Удалить погрузчик
app.delete('/forklifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM public.forklifts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Погрузчик не найден' });
    }
    res.json({ message: 'Погрузчик удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ====================== DOWNTIMES CRUD ====================== //

// Получить все простои
app.get('/downtimes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, f.number as forklift_number 
      FROM public.downtimes d
      LEFT JOIN public.forklifts f ON d.forklift_id = f.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить простой
app.post('/downtimes', async (req, res) => {
  try {
    const { forklift_id, start_time, end_time, description } = req.body;
    const result = await pool.query(
      'INSERT INTO public.downtimes (forklift_id, start_time, end_time, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [forklift_id, start_time, end_time || null, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить простой (например, добавить end_time)
app.patch('/downtimes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { end_time, description } = req.body;
    const result = await pool.query(
      'UPDATE public.downtimes SET end_time = COALESCE($1, end_time), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [end_time, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Простой не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить простой
app.delete('/downtimes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM public.downtimes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Простой не найден' });
    }
    res.json({ message: 'Простой удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);



// ====================== ЗАПУСК СЕРВЕРА ====================== //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
