const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');

mongoose.connect('mongodb://localhost:27017/codeTests', {
	autoReconnect: true,
	reconnectTries: 60,
	reconnectInterval: 10000
});

const port = process.env.PORT || 3000;
const app = express();
app.listen(port);

app.use(cors());
app.use(require('body-parser').json());

app.use('/account/create', require('./api/account/create'));
app.use('/account/fetch', require('./api/account/fetch'));
app.use('/conversion/create', require('./api/conversion/create'));
app.use('/conversion/total-by-date', require('./api/conversion/total-by-date'));
app.use('/conversion/count', require('./api/conversion/count'));
app.use('/conversion/fetch', require('./api/conversion/fetch'));

console.log(`app running on port ${port}`);

module.exports = app;
