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
// router.post('/login', login);

// Get all customers List with status ACTIVE [GET]
// router.get('/customers', authenticate, getCustomers);
router.get('/customers', getCustomers);

// Delete customer. [DELETE]
// router.delete('/customers/:id', authorize, deleteCustomer);
router.delete('/customers/:id', deleteCustomer);


// Create new card [POST]
// router.post('/createCard', createCardAuth, createCard);
router.post('/createCard', createCard);

// Get all Card List[GET]
// router.get('/cards', authenticate, cards);
router.get('/cards', cards);


module.exports = router