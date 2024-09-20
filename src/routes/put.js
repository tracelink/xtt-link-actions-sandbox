import express from 'express';
import fs from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Path to the JSON file
const dataFilePath = path.join(__dirname, '../../sampleData.json');

// Function to read the JSON file
const readDataFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data from file:', err);
        return [];
    }
};

// Sample data
let data = readDataFromFile();

// PUT request to update data by ID
router.put('/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newData = req.body;
    data = data.map(item => (item.id === id ? { ...item, ...newData } : item));
    const expectedData = data.find(item => item.id === id);
    res.json(expectedData);
});

//module.exports = router;
export default router;
