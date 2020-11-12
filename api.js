// Import and create route
const express = require('express'),
      route   = express.Router()

// Import Product Controller
const product = require('./controller/product.controller')
const vendas = require('./controller/vendas.controller')

// Setting route paths
route.use('/product', product)
route.use('/vendas', vendas)

route.use('*', (request, response) => {
  response.status(404).json({ success: false, message: 'Not found' })
})

// Export route
module.exports = route
