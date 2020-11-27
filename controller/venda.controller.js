// Import and create route
const express = require("express"),
  route = express.Router();

// Import venda Model
const venda = require("./../model/venda.model");
const estoque = require("./../model/estoque.model");

// Setting GET path
route.get("/", async (request, response) => {
  try {
    let { _id, cliente, produto, quantidade, total } = request.query;

    const payload = {};

    if (_id) {
      payload["_id"] = _id;
    }

    if (cliente) {
      payload["cliente"] = cliente;
    }

    if (produto) {
      payload["produto"] = produto;
    }

    if (quantidade) {
      quantidade = parseFloat(quantidade);

      if (isNaN(quantidade))
        throw { message: `Invalid parameters - 'quantidade' is not a number` };

      payload["quantidade"] = quantidade;
    }

    if (total) {
      total = parseFloat(total);

      if (isNaN(total))
        throw { message: `Invalid parameters - 'total' is not a number` };

      payload["total"] = total;
    }

    const vendas = await venda.read(payload);

    response.json({ success: true, data: vendas, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: [], error });
  }
});

// Setting POST path
route.post("/", async (request, response) => {
  try {
    let { cliente, produto, quantidade, total } =
      typeof request.body == "string" ? JSON.parse(request.body) : request.body;

    if (!cliente)
      throw { message: `Invalid parameters - 'cliente' is required` };

    if (!produto)
      throw { message: `Invalid parameters - 'produto' is required` };

    if (!quantidade)
      throw { message: `Invalid parameters - 'quantidade' is required` };

    if (!total) throw { message: `Invalid parameters - 'total' is required` };

    total = parseFloat(total);

    if (isNaN(total))
      throw { message: `Invalid parameters - 'total' is not a number` };

    const payload = {
      cliente,
      produto,
      quantidade,
      total,
      dataInclusao: new Date().toLocaleDateString(),
    };

    const estoques = await estoque.read({
      produto,
    });

    const estoqueAtual = estoques.reduce((a, b) => {
      return b.tipo === "Entrada"
        ? a + Number(b.quantidade)
        : a - Number(b.quantidade);
    }, 0);

    if (estoqueAtual < quantidade) {
      throw { message: `Quantidade fora de estoque!` };
    }

    const novaVenda = await venda.create(payload);

    if (novaVenda) {
      estoque.create({
        produto,
        quantidade,
        tipo: "Saida",
        dataInclusao: new Date().toLocaleString(),
      });
    }

    if (produto) {
      payload["produto"] = produto;
    }

    response.json({ success: true, data: novaVenda, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: null, error });
  }
});

// Setting PUT path
route.put("/:_id", async (request, response) => {
  try {
    let { _id } = request.params,
      { description, price } =
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

    const numReplaced = await venda.update(_id, payload);

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

    const numRemoved = await venda.delete(_id);

    response.json({ success: true, data: numRemoved, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error });
  }
});

// Export route
module.exports = route;
