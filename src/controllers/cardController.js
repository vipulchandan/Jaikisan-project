const CardModel = require('../models/CardModel');
const CustomerModel = require('../models/CustomerModel');

// Create new card [POST]
const createCard = async (req, res) => {
    try {
        if(!req.body.cardType){
            return res.status(400).send({msg : 'Card type is required'})
        }

        if (!['REGULAR', 'SPECIAL'].includes(req.body.cardType)) {
            return res.status(400).json({ error: 'Invalid status. Customer title will only include - REGULAR, SPECIAL' });
        }

        if(!req.body.customerName){
            return res.status(400).send({msg : 'Card type is required'})
        }

        if (!['ACTIVE', 'INACTIVE'].includes(req.body.status)) {
            return res.status(400).json({ error: 'Invalid status. Customer title will only include - ACTIVE and INACTIVE' });
        }

        if(!req.body.vision){
            return res.status(400).send({msg : 'Card type is required'})
        }

        if(!req.body.customerID){
            return res.status(400).send({msg : 'Card type is required'})
        }

        const customer = await CustomerModel.findById(req.body.customerID);
        if(!customer || customer["status"] === "INACTIVE" ){
            return res.status(404).json({
                status: false,
                msg: "Customer not found"
            })
        }
        const createdCard = await CardModel.create(req.body);
        res.status(201).json({
            status: true,
            msg: "Card created successfully",
            data: createdCard
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: err.message
        })
    }
}

// Get all Card List[GET]
const cards = async (req, res) => {
    try {
        const cards = await CardModel.find();
        res.status(200).json({
            status: true,
            msg: "Card List",
            data: cards
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: err.message
        })
    }
}

module.exports = {
    createCard,
    cards
}