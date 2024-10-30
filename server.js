const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.put('/data/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE mediadata SET watched = watched + 1 WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Record not found');
        }

        res.send('Record updated successfully');
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:$PORT`);
});