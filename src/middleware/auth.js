const jwt = require('jsonwebtoken');
const CardModel = require('../models/CardModel');

const authenticate = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token provided."
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                status: false,
                message: "Invalid token."
            });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

const authorize = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token provided."
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                status: false,
                message: "Invalid token."
            });
        }
        req.customer = decoded;

        let CustomerToBeModified = req.params.id;
        let decodedCustomer = decoded.id;

        if(CustomerToBeModified !== decodedCustomer){
            return res.status(403).json({
                status: false,
                message: "Unauthorized access. You are not authorized to access this resource."
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
}


const createCardAuth = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token provided."
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                status: false,
                message: "Invalid token."
            });
        }
        req.customer = decoded;
    
        if(req.body.customerID !== decoded.id){
            return res.status(403).json({
                status: false,
                message: "Unauthorized access. You are not authorized to create a CARD."
            })
        }
        
        next();
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

module.exports = {
    authenticate,
    authorize,
    createCardAuth
}