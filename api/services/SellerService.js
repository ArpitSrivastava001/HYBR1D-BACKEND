const { ObjectId } = require('mongoose').Types;

const Catalog = require('../models/Seller');
const Order = require('../models/Order');


const createCatalog = async (seller_id, catalogs) => {
    try {
        const catalog = await new Catalog({
            seller_id: seller_id,
            catalogs: catalogs
        }).save();
        return catalog;
    } catch (error) {
        console.log(error);
    }
};

const updateCatalog = async (seller_id, catalogs) => {
    try {
        const catalog = await Catalog.findOneAndUpdate({ seller_id: seller_id }, { $push: { catalogs: catalogs } });
        return catalog;
    } catch (error) {
        console.log(error);
    }
};

const checkSeller = async (seller_id) => {
    try {
        const sellerCheck = await Catalog.findOne({ seller_id: seller_id });
        return sellerCheck;
    } catch (error) {
        console.log(error);
    }
};

const getOrders = async (seller_id) => {
    try {
        const orderCheck = await Order.find({
            seller_id : seller_id
        });
        console.log(orderCheck);
        return orderCheck;
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    createCatalog,
    updateCatalog,
    checkSeller,
    getOrders
}