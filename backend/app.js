const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const authJwt = require('./helpers/auth');
const errorHandler = require('./helpers/error-handler');
require('dotenv').config();

app.use(cors());
app.options('*', cors());

// Middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

// Routes
const product = require('./routes/product');
const category = require('./routes/category');
const orders = require('./routes/order');
const user = require('./routes/user');

const api = process.env.API_URL

app.use(`/${api}/products`, product);
app.use(`/${api}/category`, category);
app.use(`/${api}/orders`, orders);
app.use(`/${api}/users`, user);


// DB Connection
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(()=> {
    console.log('Connected to database.')
})
.catch((err) => {
    console.log(err);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
