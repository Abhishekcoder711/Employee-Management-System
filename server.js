const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const app = express();


const employeeRoutes = require('./routes/employee');

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const USER = {
  username: process.env.APP_USERNAME,// Replace with your actual username
  password: process.env.APP_PASSWORD// Replace with your actual password
};


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.use('/api/employees', employeeRoutes); 

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});