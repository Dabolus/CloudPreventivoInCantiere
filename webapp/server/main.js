const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./api');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', api);
app.get('*', express.static(path.resolve(__dirname, '..', 'app')));

app.listen(8080);
