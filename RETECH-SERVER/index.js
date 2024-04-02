const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");

// Add the database connection
mongoose.connect("mongodb+srv://valderama-mapusao:admin1234@ecommerce-api.qsbohqj.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=ECOMMERCE-API", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

// Server setup
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//connect routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);


app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
});

module.exports = { app, mongoose };
