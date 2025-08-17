
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// Import the pg (node-postgres) library
const { Pool } = require('pg');

const app = express();
// Use the port from your .env file or default to 8080
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// --- Database Connection ---
// Create a new Pool instance to connect to the database
// The Pool will automatically use the environment variables (PGUSER, PGHOST, etc.)

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// --- API Route ---
app.get('/api/questions', async (req, res) => {
    console.log('Received request for quiz questions from database...');
    
    try {
        
        const query = 'SELECT country_name as country, capital_name as capital FROM countries ORDER BY RANDOM() LIMIT 50';
        const { rows } = await pool.query(query);
        
        // Send the first 10 questions for the quiz round
        const questions = rows.slice(0, 10);
        
        res.json(questions);

    } catch (err) {
        console.error('Database query error', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`BrainBolt Quiz API server running on http://localhost:${PORT}`);
});