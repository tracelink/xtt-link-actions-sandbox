import express from 'express';
import bodyParser from 'body-parser';
import getRoutes from './src/routes/get.js'
import postRoutes from './src/routes/post.js';
import putRoutes from './src/routes/put.js';
import patchRoutes from './src/routes/patch.js';

const app = express();
const PORT = 3003;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use('/api', getRoutes);
app.use('/api', postRoutes);
app.use('/api', putRoutes);
app.use('/api', patchRoutes);

app.use((req, res, next) => {
    // Set the banner content
    const banner = `
    <div style="font-size: 40px;">
    Welcome to Localhost!
    </div>
    `;
    // Append the banner to the response
    res.locals.banner = banner;
    next();
});

// Define a base route
app.get('/', (req, res) => {
    res.send(res.locals.banner);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
