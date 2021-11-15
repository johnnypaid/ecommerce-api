const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.options('*', cors());

// Middlewares
app.use(express.json());
app.use(morgan('tiny'));

// Routes
const product = require('./routes/product');
const category = require('./routes/category');

const api = process.env.API_URL

app.use(`/${api}/products`, product);
app.use(`/${api}/category`, category);


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
