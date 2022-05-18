const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const apiCreateUser = async (req, res, next) => {
    try {
        const { email, password, type } = req.body;
        if (
            !email ||
            !password ||
            !type
        ) {
            return res
                    .status(400)
                    .json({
                        status: 'failure',
                        message: 'email, password and type are required',
                        data: null
                    });
        }
        const checkUser = await UserService.checkUser(email);
        if (checkUser.length > 0) {
            return res
                    .status(409)
                    .json({
                        status: 'failure',
                        message: 'email already exists',
                        data: null
                    });
        }
        hash = await bcrypt.hash( password, 10);
        const user = await UserService.createUser(email, hash, type);
        return res
                .status(201)
                .json({
                    status: 'success',
                    message: 'user created',
                    data: {
                        user: {
                            id: user?._id,
                            email: user?.email,
                            type: user?.type
                        }
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


const apiLoginUser = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (
            !email ||
            !password
        ) {
            return res
                    .status(400)
                    .json({
                        status: 'failure',
                        message: 'email and password are required',
                        data: null
                    });
        }
        const user = await UserService.checkUser(email);
        if (user.length === 0) {
            return res
                    .status(404)
                    .json({
                        status: 'failure',
                        message: 'Login failed',
                        data: null
                    });
        }
        bcrypt.compare(password, user[0]?.password, (err, result) => {
            if (err) {
                return res
                        .status(401)
                        .json({
                            status: 'failure',
                            message: 'Login failed',
                            data: null
                        });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0]?.email,
                    userId: user[0]?._id,
                    type: user[0]?.type
                }, process.env.JWT_KEY || 'secret', {
                    expiresIn: '1h'
                });
                return res
                        .status(200)
                        .json({
                            status: 'success',
                            message: 'Login successful',
                            data: {
                                token: token,
                                expiresIn: '1h',
                                user: {
                                    id: user[0]?._id,
                                    email: user[0]?.email,
                                    type: user[0]?.type
                                }
                            }
                        });
            }
            return res
                    .status(401)
                    .json({
                        status: 'failure',
                        message: 'Login failed',
                        data: null
                    });
        } );
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
    apiCreateUser,
    apiLoginUser
};