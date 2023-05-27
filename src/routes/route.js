const express = require('express');
const router = express.Router();

const { 
    createCustomer, 
    login,
    getCustomers, 
    deleteCustomer 
} = require('../controllers/customerController');

const {
    createCard,
    cards
}  = require('../controllers/cardController');

const {
    authenticate,
    authorize,
    createCardAuth
} = require('../middleware/auth');

router.get('/test', (req, res) => {
    res.json('Hello World!');
})

// Create new customer [POST]
router.post('/create', createCustomer);

// Login Customer [POST]
router.post('/login', login);

// Get all customers List with status ACTIVE [GET]
router.get('/customers', authenticate, getCustomers);

// Delete customer. [DELETE]
router.delete('/customers/:id', authorize, deleteCustomer);


// Create new card [POST]
router.post('/createCard', createCardAuth, createCard);

// Get all Card List[GET]
router.get('/cards', authenticate, cards);


module.exports = router