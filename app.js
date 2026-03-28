const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');

mongoose.connect('mongodb://localhost:27017/codeTest', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to MongoDB');
}).catch(err => {
	console.error('MongoDB connection error:', err);
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
