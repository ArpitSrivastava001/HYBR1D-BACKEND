const jwt = require('jsonwebtoken');

const BuyerService = require('../services/BuyerService');
const UserService = require('../services/UserService');


const apiGetAllSellerId = async (req, res, next) => {
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
            user_type === "seller"
            ) {
                return res
                        .status(401)
                        .json({
                            status: 'failure',
                            message: 'Unauthorized',
                            data: null
                        });
        }
        const allSeller = await BuyerService.getAllSellerId();
        if (!allSeller) {
            return res
                    .status(404)
                    .json({
                        status: 'failure',
                        message: 'No seller found',
                        data: null
                    });
        }
        return res
                .status(200)
                .json({
                    status: 'success',
                    message: 'Seller found',
                    data: allSeller.map(each => {
                        return {
                            seller_id: each?._id,
                            email: each?.email,
                            type: each?.type
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



const apiGetSellerCatalog = async (req, res, next) => {
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
            user_type === "seller"
            ) {
                return res
                        .status(401)
                        .json({
                            status: 'failure',
                            message: 'Unauthorized',
                            data: null
                        });
        }
        const { seller_id } = req.params;
        if (!seller_id) {
            return res
                    .status(400)
                    .json({
                        status: 'failure',
                        message: 'seller_id is required',
                        data: null
                    });
        }
        const seller_check = await UserService.checkUserById(seller_id);
        if (!seller_check) {
            return res
                    .status(404)
                    .json({
                        status: 'failure',
                        message: 'Seller not found',
                        data: null
                    });
        }
        const getCatalog = await BuyerService.getSellerCatalog(seller_id);
        if (!getCatalog) {
            return res
                    .status(404)
                    .json({
                        status: 'failure',
                        message: 'No catalog found',
                        data: null
                    });
        }
        return res
                .status(200)
                .json({
                    status: 'success',
                    message: 'Catalog found',
                    data: {
                        seller_id: getCatalog?.seller_id,
                        catalogs: getCatalog?.catalogs?.map(each => {
                            return {
                                name: each?.name,
                                price: each?.price,
                                productId: each?._id
                            }
                        })
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


const apiCreateOrder = async (req, res, next) => {
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
            user_type === "seller"
            ) {
                return res
                        .status(401)
                        .json({
                            status: 'failure',
                            message: 'Unauthorized',
                            data: null
                        });
        }
        const buyer_id = decoded?.userId;
        const { seller_id } = req.params;
        if (!seller_id) {
            return res
                    .status(400)
                    .json({
                        status: 'failure',
                        message: 'seller_id is required',
                        data: null
                    });
        }
        const seller_check = await UserService.checkUserById(seller_id);
        if (!seller_check) {
            return res
                    .status(404)
                    .json({
                        status: 'failure',
                        message: 'Seller not found',
                        data: null
                    });
        }
        const { products } = req.body;
        if (!products) {
            return res
                    .status(400)
                    .json({
                        status: 'failure',
                        message: 'products is required',
                        data: null
                    });
        }
        products.filter(each => {
            if (
                !each.hasOwnProperty('productId') ||
                !each.hasOwnProperty('name') ||
                !each.hasOwnProperty('price') 
            ) {
                return res
                        .status(400)
                        .json({
                            status: 'failure',
                            message: 'productId, name and price is required',
                            data: null
                        });
            }
        });
        const productCheck = await BuyerService.productCheck(seller_id, products);
        if (!productCheck) {
            return res
                    .status(400)
                    .json({
                        status: 'failure',
                        message: 'Product not found',
                        data: null
                    });
        }
        const buyerCheck = await BuyerService.checkBuyer(buyer_id);
        if (!buyerCheck) {
            const createOrder = await BuyerService.createOrder(buyer_id, seller_id, products);
            return res
                    .status(201)
                    .json({
                        status: 'success',
                        message: 'Order created',
                        data: {
                            order_id: createOrder?._id,
                            buyer_id: createOrder?.buyer_id,
                            seller_id: createOrder?.seller_id,
                            products: createOrder?.products.map(each => {
                                return {
                                    productId: each?._id,
                                    name: each?.name,
                                    price: each?.price
                                }
                            })
                        }
                    });
        }
        const createOrder = await BuyerService.updateOrder(buyer_id, seller_id, products);
        return res
                .status(201)
                .json({
                    status: 'success',
                    message: 'Order created',
                    data: {
                        order_id: createOrder?._id,
                        buyer_id: createOrder?.buyer_id,
                        seller_id: createOrder?.seller_id,
                        products: createOrder?.products.map(each => {
                            return {
                                productId: each?._id,
                                name: each?.name,
                                price: each?.price
                            }
                        })
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


module.exports = {
    apiGetAllSellerId,
    apiGetSellerCatalog,
    apiCreateOrder
};