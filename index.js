const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");

dotenv.config();

// Mongo configuration
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((e) => console.log(e));

//Middleware method between request and response to use JSON
app.use(express.json());

//Routes
app.get("/", function (req, res) {
  console.log("Endpoint / ");
  res.end("escuchando satisfactoriamente");
});

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor corriendo");
});
