const jwt = require('jsonwebtoken');

const CatalogService = require('../services/SellerService');

const apiCreateCatalog = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.JWT_KEY || 'secret')
        if (!decoded) {
            return res
                    .status(401)
                    .json({
                        status: 'failure',
                        message: 'Unauthorized',
                        data: null
                    });
        }
        const user_type = decoded?.type;
        if (
            !user_type ||
            user_type !== "seller"
            ) {
                return res
                        .status(401)
                        .json({
                            status: 'failure',
                            message: 'Unauthorized',
                            data: null
                        });
        }
        const seller_id = decoded?.userId;
        const { catalogs } = req.body;
        if (!catalogs) {
            return res
                    .status(400)
                    .json({
                        status: 'failure',
                        message: 'catalogs are required',
                        data: null
                    });
        }
        catalogs.filter(each => {
            if (
                !each.hasOwnProperty('name') ||
                !each.hasOwnProperty('price')
            ) {
                return res
                        .status(400)
                        .json({
                            status: 'failure',
                            message: 'name and price is required',
                            data: null
                        });
            }
        });
        const checkSeller = await CatalogService.checkSeller(seller_id);
        if (!checkSeller) {
            const storeCatalog = await CatalogService.createCatalog(seller_id, catalogs);
            return res
                .status(201)
                .json({
                    status: 'success',
                    message: 'Catalogs stored successfully',
                    data: {
                        seller_id: storeCatalog?.seller_id,
                        catalogs: storeCatalog?.catalogs
                    }
                });
        }
        const storeCatalog = await CatalogService.updateCatalog(seller_id, catalogs);
        return res
                .status(201)
                .json({
                    status: 'success',
                    message: 'Catalogs stored successfully',
                    data: {
                        seller_id: storeCatalog?.seller_id,
                        catalogs: storeCatalog?.catalogs
                    }
                });
    } catch (error) {
        return res
                .status(500)
                .json({
                    status: 'failure',
                    message: `Internal Server Error : ${error}`,
                    data: null
                });
    }
};


const apiGetOrders = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.JWT_KEY || 'secret')
        if (!decoded) {
            return res
                    .status(401)
                    .json({
                        status: 'failure',
                        message: 'Unauthorized',
                        data: null
                    });
        }
        const user_type = decoded?.type;
        if (
            !user_type ||
            user_type !== "seller"
            ) {
                return res
                        .status(401)
                        .json({
                            status: 'failure',
                            message: 'Unauthorized',
                            data: null
                        });
        }
        const seller_id = decoded?.userId;
        const orders = await CatalogService.getOrders(seller_id);
        if (!orders) {
            return res
                    .status(404)
                    .json({
                        status: 'failure',
                        message: 'No orders found',
                        data: null
                    });
        }
        return res
                .status(200)
                .json({
                    status: 'success',
                    message: 'Orders retrieved successfully',
                    data: orders.map(each => {
                        return {
                            order_id: each?._id,
                            buyer_id: each?.buyer_id,
                            seller_id: each?.seller_id,
                            products: each?.products.map(prod => {
                                return {
                                    productId: prod?._id,
                                    name: prod?.name,
                                    price: prod?.price,
                                }
                            })
                        }
                    })
                });
    } catch (error) {
        return res
                .status(500)
                .json({
                    status: 'failure',
                    message: `Internal Server Error : ${error}`,
                    data: null
                });
    }
};


module.exports = {
    apiCreateCatalog,
    apiGetOrders
}