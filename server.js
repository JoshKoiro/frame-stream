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

// get the ip address of the network interface of the server
const interfaces = require('os').networkInterfaces();
const addresses = [];
for (const name of Object.keys(interfaces)) {
    for (const details of interfaces[name]) {
        if (details.family === 'IPv4' && !details.internal) {
            addresses.push(details.address);
        }
    }
}

// Endpoint for the client to get the list of active clients
app.get('/active-clients', (req, res) => {
    res.send(activeClients);
});

// Endpoint to get the frame-config.json file on the client side
app.get('/config', (req, res) => {
    const config = JSON.parse(fs.readFileSync('frame-config.json', 'utf8'));
    res.send(config);
});

// Endpoint to geta particular ip address configuration on the client side
app.get('/config/:ip', (req, res) => {
    const ip = req.params.ip;
    const config = JSON.parse(fs.readFileSync('frame-config.json', 'utf8'));
    res.send(config[ip]);
});

// Endpoint to get the list of images on the client side
app.get('/images', (req, res) => {
    const images = JSON.parse(fs.readFileSync('frame-config.json', 'utf8')).default.images;
    res.send(images);
});

//Main endpoint for application
app.get('/', (req, res) => {
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

    // send a cookie to the client prior to sending the picture frame
    res.cookie('ip', clientInfo.ip);

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
    res.sendFile(path.join(__dirname, 'public', 'picture-frame.html'));
});
app.listen(port, () => {
    console.log('Access the frame stream at http://' + addresses[0] + ':' + port);
})