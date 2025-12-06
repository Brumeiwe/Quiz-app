const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname)); // serve current folder



// API to get questions
app.get('/api/questions', (req, res) => {
    const questions = JSON.parse(fs.readFileSync('questions.json', 'utf-8'));
    res.json(questions);
});

app.listen(PORT, () => {
    console.log(`Quiz running at http://localhost:${PORT}`);
});
