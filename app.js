if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');
require('./utils/update_coins');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')));
}

app.use((req, res) => {
    res.sendStatus(404);
});

app.use((err, req, res, next) => {
    console.log(`Internal error: ${err}`);
    res.sendStatus(500);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App started listening on port ${port}`));