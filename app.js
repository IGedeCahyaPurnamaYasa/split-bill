/**
 * REQUIRED MODULE
 */

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/split-bills'


/**
 * SECRET
 */
 const secret = process.env.SECRET || 'thisshouldbeabettersecret';


/**
 * REQUIRED FILE
 */

const userRoutes = require('./routes/api/users');
const roleRoutes = require('./routes/api/roles');
const permissionRoutes = require('./routes/api/permissions');
const companyRoutes = require('./routes/api/companies');
const menuTypeRoutes = require('./routes/api/menu_types');
const menuItemRoutes = require('./routes/api/menu_items');
const discountRoutes = require('./routes/api/discounts');
const transactionRoutes = require('./routes/api/transactions');
const splitbillRoutes = require('./routes/api/splitbills');
const ApiError = require('./utils/error/ApiError');
const apiErrorHandler = require('./utils/error/api-error-handler');

/**
 * DATABASE CONNECT
 */

 mongoose.connect(DB_URL);

 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.on('open', () => {
     console.log('Database connected');
 })

 
 /**
  * APP EXPRESS
  */
 
const app = express();

/**
 * ENGINE
 */
//  app.engine('ejs', ejsMate);

/**
 * SETTING
 */
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

/**
 * USE
 */

// making urlencoded (form) readed by express
app.use(express.urlencoded({extended: true}));
// making express accept json data
app.use(express.json());


/**
 * ROUTE
 */

app.use('/api/user', userRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/permission', permissionRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/menu-type', menuTypeRoutes);
app.use('/api/menu-item', menuItemRoutes);
app.use('/api/discount', discountRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/splitbill', splitbillRoutes);

/**
 * EXCEPTION 404 Page Not Found
 */

app.all('*', (req, res, next) => {
    next(ApiError.notFound());
})


/**
 * GLOBAL ERROR MIDDLEWARE
 */

app.use(apiErrorHandler);

/**
 * LISTEN PORT
 */
 const port = process.env.PORT || 3000;

 app.listen(port, () => {
     console.log(`LISTENING TO PORT ${port}`);
 })