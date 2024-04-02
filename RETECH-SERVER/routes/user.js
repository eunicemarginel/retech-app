//[SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
//Import the auth module and deconstruct it to get our verify method.
const {verify} = require("../auth");
const auth = require("../auth");

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Routes - POST
router.post("/checkEmail", userController.checkEmailExists);

//[SECTION] Route for user registration
router.post("/register", userController.registerUser);

//[SECTION] Route for user authentication
router.post("/login", userController.loginUser);

//[SECTION] Route for retrieving user details
router.get("/details", verify, userController.getProfile);

//[SECTION] Route for ordering of user
router.post('/order', verify, userController.order);

//[SECTION] Route to get the user's orders array
router.get('/getOrders', verify, userController.getOrders);

//[SECTION] Route for resetting the user password
router.put('/reset-password', verify, userController.resetPassword);

//[SECTION] Route for updating user profile
router.put('/profile', verify, userController.updateProfile);

module.exports = router;