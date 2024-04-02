//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../auth");

//[SECTION] Check if the email already exists
module.exports.checkEmailExists = (req,res) => {

	if (req.body.email.includes("@")){
		return User.find({ email : req.body.email })
		.then(result => {

			// The "find" method returns a record if a match is found
			if (result.length > 0) {

				// If there is a duplicate email, send true with 409 http status back to the client
				return res.status(409).send({ error: "Duplicate Email Found" });

			// No duplicate email found
			// The user is not yet registered in the database
			} else {

	            // If there is no duplicate email, send false with 204 http status back to the client
				return res.status(404).send({ message: "Email not found" });

			};
		})
		.catch(err => {
			console.error("Error in find", err)
			return res.status(500).send({ error: "Error in find"});
		});
	} else {
	    res.status(400).send({ error: "Invalid Email"})
	};

};

//[SECTION] User registration
module.exports.registerUser = (req,res) => {

	// Checks if the email is in the right format
	if (!req.body.email.includes("@")){
	    return res.status(400).send({ error: "Email invalid" });
	}
	// Checks if the mobile number has the correct number of characters
	else if (req.body.mobileNo.length !== 11){
	    return res.status(400).send({ error: "Mobile number invalid" });
	}
	// Checks if the password has atleast 8 characters
	else if (req.body.password.length < 8) {
	    return res.status(400).send({ error: "Password must be atleast 8 characters" });
	// If all needed requirements are achieved
	} else {
		let newUser = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((user) => res.status(201).send({ message: "Registered Successfully" }))
		.catch(err => {
			console.error("Error in saving: ", err)
			return res.status(500).send({ error: "Error in saving"})
		})
	}

};

//[SECTION] User authentication
module.exports.loginUser = (req,res) => {
	if(req.body.email.includes("@")){
		return User.findOne({ email : req.body.email })
		.then(result => {

			// User does not exist
			if(result == null){

				// Send the message to the user
				return res.status(404).send({ error: "No Email Found" });

			// User exists
			} else {

				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				// If the passwords match/result of the above code is true
				if (isPasswordCorrect) {

					return res.status(200).send({ access : auth.createAccessToken(result)})

				// Passwords do not match
				} else {

					return res.status(401).send({ message: "Email and password do not match" });

				}

			}

		})
		.catch(err => err);
	} else {
	    return res.status(400).send({ error: "Invalid Email" })
	}
};

//[SECTION] Retrieve user details
module.exports.getProfile = (req, res) => {

	return User.findById(req.user.id)
	.then(user => {
	    if (!user) {
	        return res.status(404).send({ error: 'User not found' });
	    }

	    // Exclude sensitive information like password
	    user.password = undefined;

	    return res.status(200).send({ user });
	})
	.catch(err => {
		console.error("Error in fetching user profile", err)
		return res.status(500).send({ error: 'Failed to fetch user profile' })
	});

};

//[SECTION] Ordered a product
module.exports.order = (req, res) => {

	// The user's id from the decoded token after verify()
    console.log(req.user.id);
    // The product from our request body
    console.log(req.body.orderedProducts) ;

    // Process stops here and sends response IF user is an admin
    if(req.user.isAdmin){
        // Admins should not be allowed to order a product, so we need the "verify" to check the req.user.isAdmin
        return res.status(403).send({ error: "Admin is forbidden" });
    }

    let newOrder = new Order ({
        // Adds the id of the logged in user from the decoded token
        userId : req.user.id,
        // Gets the productIds from the request body
        orderedProducts: req.body.orderedProducts,
        totalPrice: req.body.totalPrice
    })

    return newOrder.save()
    .then(ordered => {
        return res.status(201).send({ 
			message: "Successfully Ordered",
			ordered: ordered
		 });
    })
    .catch(err => {
    	console.error("Error in ordering: ", err)
    	return res.status(500).send({ error: "Error in ordering" })
    })

}

//[SECTION] Get orders
module.exports.getOrders = (req, res) => {
	return Order.find({userId : req.user.id})
	.then(orders => {
		console.log(orders)
		if (order.length > 0) {
			return res.status(200).send({ orders });
		}
		return res.status(404).send({ error: 'No orders found' });
	})
	.catch(err => {
		console.error("Error in fetching orders")
		return res.status(500).send({ error: 'Failed to fetch orders' })
	});
};

//[SECTION] Reset password
module.exports.resetPassword = async (req, res) => {

	try {

		const { newPassword } = req.body;

		const { id } = req.user; // Extracting user ID from the authorization header

		// Hashing the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		
		await User.findByIdAndUpdate(id, { password: hashedPassword });

		// Sending a success response
		res.status(200).json({ message: 'Password reset successfully' });

	} catch (error) {

		console.error(error);
		res.status(500).json({ message: 'Internal server error' });

	}

};

//[SECTION] Update profile
module.exports.updateProfile = async (req, res) => {
	try {

		const userId = req.user.id;

		const { firstName, lastName, mobileNo } = req.body;

		// Update the user's profile in the database
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ firstName, lastName, mobileNo },
			{ new: true }
		);

		res.send(updatedUser);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Failed to update profile' });
	}
}