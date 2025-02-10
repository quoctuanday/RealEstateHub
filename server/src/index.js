const express = require('express');
const cors = require('cors');
const route = require('./routes');
const http = require('http');
const { CLIENT_PORT, PORT } = require('./config/env');
const db = require('./config/db');
const cookieParser = require('cookie-parser');

const app = express();
db.connect();

const server = http.createServer(app);

app.use(cookieParser());

//CORS
app.use(
    cors({
        origin: `http://localhost:${CLIENT_PORT}`,
        credentials: true,
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

//Config route
route(app);

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
