// Import and create route
const express = require('express'),
      route   = express.Router()

// Import cliente Model
const cliente = require('./../model/cliente.model')

// Setting GET path
route.get('/', async (request, response) => {
  try {
    let { _id, description, price } = request.query

    const payload = {}

    if (_id) {
      payload['_id'] = _id
    }

    if (description) {
      payload['description'] = description
    }

    if (price) {
      price = parseFloat(price)

      if (isNaN(price))
        throw { message: `Invalid parameters - 'description' is required` }

      payload['price'] = price
    }

    const clientes = await cliente.read(payload)

    response.json({ success: true, data: clientes, error: null })
  } catch (error) {
    response.status(500).json({ success: false, data: [], error })
  }
})

// Setting POST path
route.post('/', async (request, response) => {
  try {
    let { description, price } = (typeof request.body == 'string') ? JSON.parse(request.body) : request.body

    if (!description)
      throw { message: `Invalid parameters - 'description' is required` }
    if (!price)
      throw { message: `Invalid parameters - 'price' is required` }

    price = parseFloat(price)

    if (isNaN(price))
      throw { message: `Invalid parameters - 'price' is not a number` }

    const payload = {
      description,
      price
    }

    const newcliente = await cliente.create(payload)

    response.json({ success: true, data: newcliente, error: null })
  } catch (error) {
    response.status(500).json({ success: false, data: null, error })
  }
})

// Setting PUT path
route.put('/:_id', async (request, response) => {
  try {
    let { _id }                = request.params,
        { description, price } = (typeof request.body == 'string') ? JSON.parse(request.body) : request.body

    if (!_id)
      throw { message: `Invalid parameters - '_id' is required` }
    if (!description)
      throw { message: `Invalid parameters - 'description' is required` }
    if (!price)
      throw { message: `Invalid parameters - 'price' is required` }

    price = parseFloat(price)

    if (isNaN(price))
      throw { message: `Invalid parameters - 'price' is not a number` }

    const payload = {
      description,
      price
    }

    const numReplaced = await cliente.update(_id, payload)

    response.json({ success: true, data: numReplaced, error: null })
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error })
  }
})

// Setting DELETE path
route.delete('/:_id', async (request, response) => {
  try {
    const { _id } = request.params

    if (!_id)
      throw { message: 'Invalid parameters' }

    const numRemoved = await cliente.delete(_id)

    response.json({ success: true, data: numRemoved, error: null })
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error })
  }
})

// Export route
module.exports = route
