const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const userRoutes = require('./api/routes/user');
const sellerRoutes = require('./api/routes/seller');
const buyerRoutes = require('./api/routes/buyer');

const url = 'mongodb+srv://test:test@chatapp.3gdhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(url, connectionParams)
    .then( () => {
        console.log('Connected to MongoDB');
    } )
    .catch( err => {
        console.log('Error connecting to MongoDB: ' + err);
    } );
mongoose.Promise = global.Promise;


app.use(cors());
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
} );


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use('/api/auth', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/buyer', buyerRoutes);




module.exports = app;

