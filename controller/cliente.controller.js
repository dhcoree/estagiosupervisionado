// Import and create route
const express = require("express"),
  route = express.Router();

// Import cliente Model
const cliente = require("./../model/cliente.model");

// Setting GET path
route.get("/", async (request, response) => {
  try {
    let { _id, nome, idade } = request.query;

    const payload = {};

    if (_id) {
      payload["_id"] = _id;
    }

    if (nome) {
      payload["nome"] = nome;
    }

    if (idade) {
      idade = parseFloat(idade);

      if (isNaN(idade))
        throw { message: `Invalid parameters - 'idade' is not a number` };

      payload["idade"] = idade;
    }

    const clientes = await cliente.read(payload);

    response.json({ success: true, data: clientes, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: [], error });
  }
});

// Setting POST path
route.post("/", async (request, response) => {
  try {
    let { nome, idade } =
      typeof request.body == "string" ? JSON.parse(request.body) : request.body;

    if (!nome) throw { message: `Invalid parameters - 'nome' is required` };
    if (!idade) throw { message: `Invalid parameters - 'idade' is required` };

    idade = parseFloat(idade);

    if (isNaN(idade))
      throw { message: `Invalid parameters - 'idade' is not a number` };

    const payload = {
      nome,
      idade,
    };

    const novoCliente = await cliente.create(payload);

    response.json({ success: true, data: novoCliente, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: null, error });
  }
});

// Setting PUT path
route.put("/:_id", async (request, response) => {
  try {
    let { _id } = request.params,
      { nome, idade } =
        typeof request.body == "string"
          ? JSON.parse(request.body)
          : request.body;

    if (!_id) throw { message: `Invalid parameters - '_id' is required` };
    if (!nome) throw { message: `Invalid parameters - 'nome' is required` };
    if (!idade) throw { message: `Invalid parameters - 'idade' is required` };

    idade = parseFloat(idade);

    if (isNaN(idade))
      throw { message: `Invalid parameters - 'idade' is not a number` };

    const payload = {
      nome,
      idade,
    };

    const numReplaced = await cliente.update(_id, payload);

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

    const numRemoved = await cliente.delete(_id);

    response.json({ success: true, data: numRemoved, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error });
  }
});

// Export route
module.exports = route;
