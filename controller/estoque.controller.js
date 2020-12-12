// Import and create route
const express = require("express"),
  route = express.Router();

// Import estoque Model
const estoque = require("./../model/estoque.model");

// Setting GET path
route.get("/", async (request, response) => {
  try {
    let estoques = await estoque.read({});

    response.json({ success: true, data: estoques, error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ success: false, data: [], error });
  }
});

// Setting POST path
route.post("/", async (request, response) => {
  try {
    let { produto, quantidade, dataInclusao } =
      typeof request.body == "string" ? JSON.parse(request.body) : request.body;

    if (!produto)
      throw { message: `Invalid parameters - 'produto' is required` };

    if (!quantidade)
      throw { message: `Invalid parameters - 'quantidade' is required` };

    if (isNaN(quantidade))
      throw { message: `Invalid parameters - 'quantidade' is not a number` };

    const payload = {
      produto,
      quantidade,
      dataInclusao,
      tipo: "Entrada",
    };

    const novoEstoque = await estoque.create(payload);

    response.json({ success: true, data: novoEstoque, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: null, error });
  }
});

// Export route
module.exports = route;
