// Import and create route
const express = require("express"),
  route = express.Router();

// Import Product Model
const product = require("./../model/produto.model");
const estoque = require("./../model/estoque.model");

// Setting GET path
route.get("/", async (request, response) => {
  try {
    let { _id, description, price } = request.query;

    const payload = {};

    if (_id) {
      payload["_id"] = _id;
    }

    /*if (description) {
      payload["description"] = description;
    }*/

    if (price) {
      price = parseFloat(price);

      if (isNaN(price))
        throw { message: `Invalid parameters - 'description' is required` };

      payload["price"] = price;
    }

    let produtos = await product.read(payload);

    if (description) {
      produtos = produtos.filter((product) => {
        if (product.description.indexOf(description) != -1) {
          return true;
        }

        return false;
      });
    }

    produtos = await Promise.all(
      produtos.map(async (produto) => {
        const estoques = await estoque.read({
          produto: produto.description,
        });

        produto.quantidade = estoques.reduce((a, b) => {
          return b.tipo === "Entrada"
            ? a + Number(b.quantidade)
            : a - Number(b.quantidade);
        }, 0);

        return produto;
      })
    );

    response.json({ success: true, data: produtos, error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ success: false, data: [], error });
  }
});

// Setting POST path
route.post("/", async (request, response) => {
  try {
    let { description, price, quantidade } =
      typeof request.body == "string" ? JSON.parse(request.body) : request.body;

    if (!description)
      throw { message: `Invalid parameters - 'description' is required` };

    if (!price) throw { message: `Invalid parameters - 'price' is required` };

    if (!quantidade)
      throw { message: `Invalid parameters - 'quantidade' is required` };

    price = parseFloat(price);

    if (isNaN(price))
      throw { message: `Invalid parameters - 'price' is not a number` };

    if (isNaN(quantidade))
      throw { message: `Invalid parameters - 'quantidade' is not a number` };

    const payload = {
      description,
      price,
    };

    const newProduct = await product.create(payload);

    if (newProduct) {
      await estoque.create({
        produto: newProduct.description,
        quantidade,
        tipo: "Entrada",
        dataInclusao: new Date().toLocaleString(),
      });
    }

    response.json({ success: true, data: newProduct, error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ success: false, data: null, error });
  }
});

// Setting PUT path
route.put("/:_id", async (request, response) => {
  try {
    let { _id } = request.params,
      { description, price, quantidade } =
        typeof request.body == "string"
          ? JSON.parse(request.body)
          : request.body;

    if (!_id) throw { message: `Invalid parameters - '_id' is required` };
    if (!description)
      throw { message: `Invalid parameters - 'description' is required` };
    if (!price) throw { message: `Invalid parameters - 'price' is required` };

    price = parseFloat(price);

    if (isNaN(price))
      throw { message: `Invalid parameters - 'price' is not a number` };

    const payload = {
      description,
      price,
    };

    const numReplaced = await product.update(_id, payload);
    await estoque.create({
      produto: description,
      quantidade,
      tipo: "Entrada",
      dataInclusao: new Date().toLocaleString(),
    });
    response.json({ success: true, data: numReplaced, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error });
  }
});

// Setting DELETE path
route.delete("/:_id", async (request, response) => {
  try {
    const { _id } = request.params;

    if (!_id) throw { message: "Invalid parameters" };

    const [produtoAtual] = await product.read(request.params);

    console.log(produtoAtual);

    const estoques = await estoque.read({
      produto: produtoAtual.description,
    });

    console.log(estoques);

    const numRemoved = await product.delete(_id);

    await Promise.all(
      estoques.map(async (_estoque) => {
        await estoque.delete(_estoque._id);
      })
    );

    response.json({ success: true, data: numRemoved, error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ success: false, data: 0, error });
  }
});

// Export route
module.exports = route;
