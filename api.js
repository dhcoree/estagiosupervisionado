// Import and create route
const express = require("express"),
  route = express.Router();

// Import Controllers
const cliente = require("./controller/cliente.controller");
const produto = require("./controller/produto.controller");
const venda = require("./controller/venda.controller");

// Setting route paths
route.use("/cliente", cliente);
route.use("/produto", produto);
route.use("/venda", venda);

route.use("*", (request, response) => {
  response.status(404).json({ success: false, message: "Not found" });
});

// Export route
module.exports = route;
