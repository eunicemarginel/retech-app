//[SECTION] Dependencies and Modules
const Product = require("../models/Product");
const User = require("../models/User");

//[SECTION] Create a product
module.exports.addProduct = (req, res) => {

	let newProduct = new Product({
		name : req.body.name,
		description : req.body.description,
		price : req.body.price
	});

	Product.findOne({ name: req.body.name })
	.then(existingProduct => {
	    if (existingProduct) {
	    	return res.status(409).send({ error: 'Product already exists' });
	    }

	    return newProduct.save()
	    .then(savedProduct => res.status(201).send({ savedProduct }))
	    .catch(saveErr => {
	        console.error("Error in saving the product: ", saveErr)

	        return res.status(500).send({ error: 'Failed to save the product' });
	    });
	    
	})
	.catch(findErr => {
	    console.error("Error in finding the product: ", findErr)

	    return res.status(500).send({ message:'Error finding the product' });
	});

}; 


//[SECTION] Retrieve all Products
module.exports.getAllProducts = (req, res) => {

	return Product.find({})
	.then(products => {
	    if(products.length > 0){
	    	res.status(200).send({ products });
	    }
	    else{
	        return res.status(200).send({ message: 'No products found.' });
	    }
	})

};

//[SECTION] Retrieve all active Products
module.exports.getAllActive = (req, res) => {

	Product.find({ isActive : true })
	.then(products => {
	    
	    if (products.length > 0){
	        
	        return res.status(200).send({ products });
	    }
	    
	    else {
	        
	        return res.status(200).send({ message: 'No active products found.' })
	    }
	}).catch(err => res.status(500).send({ error: 'Error finding active products.' }));

};

//[SECTION] Retrieve a specific Product
module.exports.getProduct = (req, res) => {
	const productId = req.params.productId;

	Product.findById(req.params.productId)
	.then(product => {
		if (!product) {
			return res.status(404).send({ error: 'Product not found' });
		}
		return res.status(200).send({ product });
	})
	.catch(err => {
		console.error("Error in fetching the product: ", err)
		return res.status(500).send({ error: 'Failed to fetch product' });
	});
	
};

//[SECTION] Update a Product
module.exports.updateProduct = (req, res) => {

	let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(updatedProduct => {
        if (!updatedProduct) {

            return res.status(404).send({ error: 'Product not found' });

        }

        return res.status(200).send({ 
        	message: 'Product updated successfully', 
        	updatedProduct: updatedProduct
        });

    })
    .catch(err => {
		console.error("Error in updating a product: ", err)
		return res.status(500).send({ error: 'Error in updating a product.' });
	});
};

//[SECTION] Archive a Product
module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }
    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(archiveProduct => {
            if (!archiveProduct) {
            	return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({ 
            	message: 'Product archived successfully', 
            	archiveProduct: archiveProduct
            });
        })
        .catch(err => {
        	console.error("Error in archiving a product: ", err)
        	return res.status(500).send({ error: 'Failed to archive product' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};

//[SECTION] Activate a Product
module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(activateProduct=> {
            if (!activateProduct) {
            	return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({ 
            	message: 'Product activated successfully', 
            	activateProduct: activateProduct
            });
        })
        .catch(err => {
        	console.error("Error in activating a product: ", err)
        	return res.status(500).send({ error: 'Failed to activating a product' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};

//[SECTION] Search Product by name
module.exports.searchProductsByName = async (req, res) => {
	try {
	  const { productName } = req.body;
  
	  const products = await Product.find({
		name: { $regex: productName, $options: 'i' }
	  });
  
	  res.json(products);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Search Products by Price Range
exports.searchProductByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        // Validate that minPrice and maxPrice are valid numbers
        const parsedMinPrice = parseFloat(minPrice);
        const parsedMaxPrice = parseFloat(maxPrice);

        // Check if minPrice and maxPrice are valid numbers
        if (isNaN(parsedMinPrice) || isNaN(parsedMaxPrice)) {
            return res.status(400).json({ error: 'Invalid price values' });
        }

        // Perform the search based on the valid price range
        const products = await Product.find({
            price: { $gte: parsedMinPrice, $lte: parsedMaxPrice }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Error searching products by price range:", error);
        res.status(500).json({ error: 'Failed to search products by price range' });
    }
};

//[SECTION] Get ordered users via Product ID
module.exports.getEmailsOfOrderedUsers = async (req, res) => {
	const productId = req.params.productId; // Use req.params instead of req.body

	try {
		// Find the Product by productId
		const product = await Product.findById(productId);
	
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
	
		// Get the userIds of ordered users from the Product
		const userIds = product.customers.map(customer => customer.userId);
	
		// Find the users with matching userIds
		const orderedUsers = await User.find({ _id: { $in: userIds } }); // Use userIds variable instead of undefined "users"
	
		// Extract the emails from the ordered users
		const emails = orderedUsers.map(user => user.email); // Use map instead of forEach
	
		res.status(200).json({ userEmails: emails }); // Use the correct variable name userEmails instead of emails
	} catch (error) {
		res.status(500).json({ message: 'An error occurred while retrieving ordered users' });
	}
};