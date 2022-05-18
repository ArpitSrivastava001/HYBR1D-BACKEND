const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const BuyerController = require('../controllers/buyer.controller');


router.get('/list-of-sellers', checkAuth, BuyerController.apiGetAllSellerId);
router.get('/seller-catalog/:seller_id', checkAuth, BuyerController.apiGetSellerCatalog);
router.post('/create-order/:seller_id', checkAuth, BuyerController.apiCreateOrder);


module.exports = router;