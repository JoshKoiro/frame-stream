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

activeClients = [];

// Endpoint for the client to get the list of active clients
app.get('/active-clients', (req, res) => {
    res.send(activeClients);
});

// Endpoint to get the frame-config.json file on the client side
app.get('/config', (req, res) => {
    const images = JSON.parse(fs.readFileSync('frame-config.json', 'utf8'));
    res.send(images);
});

// Endpoint to get the list of images on the client side
app.get('/images', (req, res) => {
    const images = JSON.parse(fs.readFileSync('frame-config.json', 'utf8')).images;
    res.send(images);
});

//Main endpoint for application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'picture-frame.html'));
    var clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(clientIP === "::1"){
        clientIP = "127.0.0.1";
    } else {
        clientIP = clientIP.split(":")[3];
    }
    var clientInfo = {
        "ip": clientIP,
        // get the browser version of the connected client application
        "browser": req.headers['user-agent'],
        // get the platform of the connected client application
        "platform": req.headers['sec-ch-ua-platform'],
        "connectionTime": // get the current time
        new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    console.log(clientInfo);

    // check if the client has already connected to the application
    for(var i = 0; i < activeClients.length; i++){
        if(activeClients[i].ip === clientInfo.ip){
            activeClients[i] = clientInfo;
            // delete the client from the list of active clients
            activeClients.splice(i, 1);
            break;
        }
    }

    activeClients.push(clientInfo);
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})