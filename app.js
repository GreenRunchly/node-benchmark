require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dayjs = require('dayjs');

const app = express();
const apiPath = process.env.API_PATH;

// Agar saat crash web tidak shutdown
app.on('uncaughtException', function (err) {
    console.log(`Node Still Running...`);
});

// Middleware global
app.use(cors({
    origin: ['https://ujian.ieu.link'],
    credentials: true
}));
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_KEY));

app.use(express.static('assets'));

function intensiveRandomCalculation(iterations) {
    const operations = ['+', '-', '*', '/'];
    let results = [];

    for (let i = 0; i < iterations; i++) {
    const num1 = Math.floor(Math.random() * 10000) + 1; // Larger numbers
    const num2 = Math.floor(Math.random() * 10000) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let result;
    switch (operation) {
        case '+':
        result = num1 + num2;
        break;
        case '-':
        result = num1 - num2;
        break;
        case '*':
        result = num1 * num2;
        break;
        case '/':
        result = num2 !== 0 ? num1 / num2 : 'undefined';
        break;
    }
    results.push(`${num1} ${operation} ${num2} = ${result}`);
    }

    return results;
}

// Rute-rute aplikasi
app.get(apiPath + '/', (req, res) => {
    const counts = intensiveRandomCalculation(1_000_00);
    res.json({
        code: "ok",
        msg: "Selamat Datang!",
        counts
    });
});

// Menangani permintaan API yang tidak valid
app.all(apiPath + '/*', (req, res) => {
    res.status(404).json({
        code: "error",
        msg: "API Invalid"
    });
});

// Menjalankan server
const port = process.env.HTTP_PORT || 3000;
app.listen(port, () => {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Server berjalan pada port ${port}... HTTP Route Addon disetel ke ${apiPath}`);
});
