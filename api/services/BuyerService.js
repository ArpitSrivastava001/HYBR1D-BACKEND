const Order = require('../models/Order');
const User = require('../models/User');
const Seller = require('../models/Seller');


const getAllSellerId = async () => {
    try {
        const allSeller = await User.find({type: 'seller'});
        return allSeller;
    } catch (error) {
        console.log(error);
    }
};

const getSellerCatalog = async (seller_id) => {
    try {
        const sellerCatalog = await Seller.findOne({seller_id: seller_id});
        return sellerCatalog;
    } catch (error) {
        console.log(error);
    }
};

const createOrder = async (buyer_id, seller_id, products) => {
    try {
        const order = await new Order({
            buyer_id: buyer_id,
            seller_id: seller_id,
            products: products
        }).save();
        return order;
    } catch (error) {
        console.log(error);
    }
};

const updateOrder = async (buyer_id, seller_id, products) => {
    try {
        const order = await Order.findOneAndUpdate({buyer_id: buyer_id, seller_id: seller_id}, {$push: {products: products}});
        return order;
    } catch (error) {
        console.log(error);
    }
};

const checkBuyer = async (buyer_id) => {
    try {
        const buyerCheck = await Order.findOne({buyer_id: buyer_id});
        return buyerCheck;
    } catch (error) {
        console.log(error);
    }
};

const productCheck = async (seller_id, products) => {
    try {
        product_check = await products.filter(each => {
            const product = Seller.findOne({
                seller_id: seller_id, 
                products: {
                    $elemMatch: {
                        productId: each.productId,
                        name: each.name,
                        price: each.price
                    }
                }
            });
        });
        return product_check;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllSellerId,
    getSellerCatalog,
    createOrder,
    updateOrder,
    checkBuyer,
    productCheck
};