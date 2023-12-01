//create a basic express node server to serve index.html and the static files
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/config', (req, res) => {
    const images = JSON.parse(fs.readFileSync('frame-config.json', 'utf8'));
    res.send(images);
});
//serve the index.html file 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'picture-frame.html'));
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})