const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projectdb',
    password: 'Eggface_1431',
    port: 5432,
});

app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mediadata');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:$PORT`);
});