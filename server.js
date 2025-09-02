const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path'); // Path module ko import karein

const app = express();


// Employee routes ko import karein
const employeeRoutes = require('./routes/employee');

app.use(cors());
app.use(express.json());

// EJS ko view engine ke roop mein set karein
app.set('view engine', 'ejs');

// Views directory ko set karein, jahan EJS files honge
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS, images) ko serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));


// Dummy user credentials (production me isko environment variables se ya database se lein)
const USER = {
    username: process.env.APP_USERNAME || 'admin',
    password: process.env.APP_PASSWORD || 'password'
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

// Root route (/) ko handle karein aur 'index.ejs' file ko render karein
app.get('/', (req, res) => {
    res.render('index');
});

// Employee API routes ko use karein
app.use('/api/employees', employeeRoutes);

app.listen(3000, () => {
    console.log('✅ Server running at http://localhost:3000');
});
