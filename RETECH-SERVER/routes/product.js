//[SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");

// Deconstruct the "auth" module so that we can simply store "verify" and "verifyAdmin" in their variables and reuse it in our routes.
const {verify, verifyAdmin} = auth;

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Route for creating a products
router.post("/", verify, verifyAdmin, productController.addProduct);

//[SECTION] Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

//[SECTION] Route for retrieving all active products
router.get("/", productController.getAllActive);

//[SECTION] Route for retrieving a specific products
router.get("/:productId", productController.getProduct);

//[SECTION] Route for updating a products (Admin)
router.patch("/:productId", verify, verifyAdmin, productController.updateProduct);

//[SECTION] Route to archiving a products (Admin)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

//[SECTION] Route to activating a products (Admin)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

//[SECTION] Route for searching products by name
router.post('/search', productController.searchProductsByName);

// Search Products by Price Range
router.post('/searchByPrice', productController.searchProductByPriceRange);

//[SECTION] Route for getting ordered users by products
router.get('/:productId/ordered-users', productController.getEmailsOfOrderedUsers);

module.exports = router;