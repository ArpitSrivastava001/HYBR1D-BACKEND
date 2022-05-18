const express = require('express');
const router = express.Router();

const CatalogController = require('../controllers/seller.controller')
const checkAuth = require('../middleware/check-auth')

router.post('/create-catalog', checkAuth, CatalogController.apiCreateCatalog);
router.get('/orders', checkAuth, CatalogController.apiGetOrders);


module.exports = router;