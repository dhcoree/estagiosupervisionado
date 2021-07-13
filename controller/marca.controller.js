// Import and create route
const express = require("express"),
  route = express.Router();

// Import marca Model
const marca = require("../model/marca.model");

// Setting GET path
route.get("/", async (request, response) => {
  try {
    let { _id, nome } = request.query;

    const payload = {};

    if (_id) {
      payload["_id"] = _id;
    }

    if (nome) {
      payload["nome"] = nome;
    }

    const marcas = await marca.read(payload);

    response.json({ success: true, data: marcas, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: [], error });
  }
});

// Setting POST path
route.post("/", async (request, response) => {
  try {
    let { nome } =
      typeof request.body == "string" ? JSON.parse(request.body) : request.body;

    if (!nome) throw { message: `Invalid parameters - 'nome' is required` };

    const payload = {
      nome,
    };

    const novomarca = await marca.create(payload);

    response.json({ success: true, data: novomarca, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: null, error });
  }
});

// Setting PUT path
route.put("/:_id", async (request, response) => {
  try {
    let { _id } = request.params,
      { nome } =
        typeof request.body == "string"
          ? JSON.parse(request.body)
          : request.body;

    if (!_id) throw { message: `Invalid parameters - '_id' is required` };
    if (!nome) throw { message: `Invalid parameters - 'nome' is required` };

    const payload = {
      nome,
    };

    const numReplaced = await marca.update(_id, payload);

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

    const numRemoved = await marca.delete(_id);

    response.json({ success: true, data: numRemoved, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error });
  }
});

// Export route
module.exports = route;
