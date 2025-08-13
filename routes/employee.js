const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');


const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


router.get('/', auth, (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.post('/', auth, (req, res) => {
  const { name, position, salary } = req.body;
  db.query(
    'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)',
    [name, position, salary],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Employee added', id: result.insertId });
    }
  );
});


router.put('/:id', auth, (req, res) => {
  const id = req.params.id;
  const { name, position, salary } = req.body;
  db.query(
    'UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?',
    [name, position, salary, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Employee updated' });
    }
  );
});


router.delete('/:id', auth, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee deleted' });
  });
});

module.exports = router;
