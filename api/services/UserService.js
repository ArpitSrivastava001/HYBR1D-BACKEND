const User = require('../models/User');

const createUser = async (email, password, type) => {
    try{
        const user = await new User({
            email: email,
            password: password,
            type: type
        }).save();
        return user;    
    } catch (error) {
        console.log(error);
    }
};

const checkUser = async ( email ) => {
    try {
        const user_check = await User.find({ email: email });
        return user_check;
    } catch (error) {
        console.log(error);
    }
};

const checkUserById = async ( seller_id ) => {
    try {
        const user_check = await User.findOne({ _id: seller_id });
        return user_check;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createUser,
    checkUser,
    checkUserById
};