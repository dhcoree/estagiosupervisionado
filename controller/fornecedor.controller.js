// Import and create route
const express = require("express"),
  route = express.Router();

// Import fornecedor Model
const fornecedor = require("./../model/fornecedor.model");

// Setting GET path
route.get("/", async (request, response) => {
  try {
    let { _id, nome, cnpj } = request.query;

    const payload = {};

    if (_id) {
      payload["_id"] = _id;
    }

    if (nome) {
      payload["nome"] = nome;
    }

    if (cnpj) {
      cnpj = String(cnpj);

      if ((!cnpj))
      payload["cnpj"] = cnpj;
    }

    const fornecedores = await fornecedor.read(payload);

    response.json({ success: true, data: fornecedores, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: [], error });
  }
});

// Setting POST path
route.post("/", async (request, response) => {
  try {
    let { nome, cnpj } =
      typeof request.body == "string" ? JSON.parse(request.body) : request.body;

    if (!nome) throw { message: `Invalid parameters - 'nome' is required` };
    if (!cnpj) throw { message: `Invalid parameters - 'cnpj' is required` };

    const payload = {
      nome,
      cnpj,
    };

    const novoFornecedor = await fornecedor.create(payload);

    response.json({ success: true, data: novoFornecedor, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: null, error });
  }
});

// Setting PUT path
route.put("/:_id", async (request, response) => {
  try {
    let { _id } = request.params,
      { nome, cnpj } =
        typeof request.body == "string"
          ? JSON.parse(request.body)
          : request.body;

    if (!_id) throw { message: `Invalid parameters - '_id' is required` };
    if (!nome) throw { message: `Invalid parameters - 'nome' is required` };
    if (!cnpj) throw { message: `Invalid parameters - 'cnpj' is required` };

    cnpj = String(cnpj);

    if ((!cnpj))
      throw { message: `Invalid parameters - 'cnpj' is not a number` };

    const payload = {
      nome,
      cnpj,
    };

    const numReplaced = await fornecedor.update(_id, payload);

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

    const numRemoved = await fornecedor.delete(_id);

    response.json({ success: true, data: numRemoved, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error });
  }
});

// Export route
module.exports = route;
