// Import and create route
const express = require("express"),
  route = express.Router();

// Import grupo Model
const grupo = require("../model/grupo.model");

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

    const grupos = await grupo.read(payload);

    response.json({ success: true, data: grupos, error: null });
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

    const novogrupo = await grupo.create(payload);

    response.json({ success: true, data: novogrupo, error: null });
  } catch (error) {
    console.log(error);
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

    const numReplaced = await grupo.update(_id, payload);

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

    const numRemoved = await grupo.delete(_id);

    response.json({ success: true, data: numRemoved, error: null });
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error });
  }
});

// Export route
module.exports = route;
