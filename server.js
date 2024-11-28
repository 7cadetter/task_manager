const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');


app.use(cors({
    origin: 'https://taskmanager-5si3.onrender.com'
  }));
app.use(express.json());

console.log('Database URL:', process.env.DATABASE_URL);
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(express.static(path.join(__dirname, 'public')));

// Show index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Select all data from database ordered by id
app.get('/data', async (res) => {
    try {
        const result = await pool.query('SELECT * FROM mediadata ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Server Error');
    }
});

// Update database by either incrementing or decrementing based on inorde variable
app.put('/data/:inorde/:id', async (req, res) => {
    const { inorde, id } = req.params;
    let query;

    try {
        if (inorde === '+') {
            query = 'UPDATE mediadata SET watched = watched + 1 WHERE id = $1';
        } else if (inorde === '-') {
            query = 'UPDATE mediadata SET watched = watched - 1 WHERE id = $1';
        } else {
            return res.status(400).send('Invalid action');
        }

        const result = await pool.query(query, [id]);

        // If the ID is not in the database
        if (result.rowCount === 0) {
            return res.status(404).send('Record not found');
        }

        res.send('Record updated successfully');
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Server error');
    }
});


// Insert a new row into database with inputted values
app.put('/data', async (req, res) => {
    const { episodes, title } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO mediadata (title, episodes, watched) VALUES ($1, $2, 0) RETURNING *",
            [title, episodes]
        );

        // If the data was inserted
        if (result.rows.length > 0) {
            res.status(201).json(result.rows[0]);
        } else {
            res.status(500).json({ error: 'No data was inserted' });
        }
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Server error' });
    }
});


// Removes data from database with a certain ID
app.delete('/data/delete', async (req, res) => { 
    const { id } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const result = await pool.query("DELETE FROM mediadata WHERE id = $1", [id]);
        
        // If ID is not in database
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }
        
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Server error' });
    }
});


// Prints when server begins running
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
