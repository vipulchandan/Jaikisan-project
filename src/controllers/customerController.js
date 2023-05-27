const CustomerModel = require('../models/CustomerModel');
const jwt = require('jsonwebtoken');

// Create new customer [POST]
const createCustomer = async (req, res) => {
    try {
        if(!req.body.firstName){
            return res.status(400).send({msg : 'Customer first name is required'})
        }

        if(!req.body.lastName){
            return res.status(400).send({msg : 'Customer last name is required'})
        }

        if (!req.body.mobileNumber) {
            return res.status(400).send({ msg: 'Customer mobile number is required' });
        }
        
        const mobileNumber = req.body.mobileNumber.toString(); // Convert to string
        
        if (mobileNumber.length !== 10) {
            return res.status(400).send({ msg: 'Invalid mobile number length. Mobile number should be 10 digits long' });
        }
        if (!/^\d+$/.test(mobileNumber)) {
            return res.status(400).send({ msg: 'Invalid mobile number format. Mobile number should only contain digits' });
        }

        if(!req.body.DOB){
            return res.status(400).send({msg : 'Customer Date of birth is required'})
        }

        if(!req.body.emailID){
            return res.status(400).send({msg : 'Customer email is required'})
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(req.body.emailID)) {
            return res.status(400).send({msg: 'Invalid email format'})
        }
        const existingCustomer = await CustomerModel.findOne({ emailID: req.body.emailID });
            if (existingCustomer) {
                return res.status(400).send({ msg: 'Email already exists'});
        }

        if(!req.body.address){
            return res.status(400).send({msg : 'Customer address is required'})
        }

        if(!req.body.status){
            return res.status(400).send({msg : 'Customer STATUS is required'})
        }

        if (!['ACTIVE', 'INACTIVE'].includes(req.body.status)) {
            return res.status(400).json({ error: 'Invalid status. Customer title will only include - ACTIVE and INACTIVE' });
        }
        const createdCustomer = await CustomerModel.create(req.body);
        res.status(201).json({
            status: true,
            msg: "Customer created successfully",
            data: createdCustomer
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: err.message
        })
    }
}

// Login Customer [POST]
const login = async (req, res) => {
    try {
        const customer = await CustomerModel.findOne({ customerID: req.body.customerID });
        if (!customer || customer["status"] === "INACTIVE") {
            return res.status(404).json({
                status: false,
                msg: "Customer not found"
            })
        }
        
        const payload = {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName
        } 

        const secret = process.env.JWT_SECRET_KEY;

        const options = {
            expiresIn: '3d'
        }

        const token = jwt.sign(payload, secret, options);

        res.status(200).json({
            status: true,
            msg: "Customer logged in successfully",
            data: token
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            msg: err.message
        })
    }
}

// Get all customers List with status ACTIVE [GET]
const getCustomers = async (req, res) => {
    try {
        const customers = await CustomerModel.find({ status: 'ACTIVE'});
        res.status(200).json({
            status: true,
            msg: "Customers fetched successfully",
            data: customers
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: err.message
        })
    }
}

// Delete customer. [DELETE]
const deleteCustomer = async (req, res) => {
    try {
        // const deleteCustomer = await CustomerModel.findByIdAndDelete(req.params.id);
        const customer = await CustomerModel.findById(req.params.id);
        if(customer.status === "INACTIVE"){
            return res.status(404).json({
                status: false,
                msg: "Customer already deleted"
            })
        }
        await CustomerModel.updateOne(
            { _id: req.params.id },
            { status: 'INACTIVE' },
        );
        res.status(200).json({
            status: true,
            msg: "Customer deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: err.message
        })
    }
}


module.exports = {
    createCustomer,
    login,
    getCustomers, 
    deleteCustomer
}