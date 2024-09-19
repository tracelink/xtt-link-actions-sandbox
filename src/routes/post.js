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

// POST request to add new data
router.post('/data', (req, res) => {
    const newData = req.body;
    data.push(newData);
    const expectedData=data.find(object=>{
        return newData.id==object.id;
     });
    res.status(201).json(expectedData);
});

//module.exports = router;
export default router;