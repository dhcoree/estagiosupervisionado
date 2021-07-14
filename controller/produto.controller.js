// Import and create route
const express = require('express'),
  route = express.Router()

// Import Product Model
const product = require('./../model/produto.model')
const estoque = require('./../model/estoque.model')
const fornecedor = require('./../model/fornecedor.model')
const marca = require('./../model/marca.model')
const grupo = require('./../model/grupo.model')

// Setting GET path
route.get('/', async (request, response) => {
  try {
    let { _id, description, price } = request.query

    const payload = {}

    if (_id) {
      payload['_id'] = _id
    }

    /*if (description) {
      payload["description"] = description;
    }*/

    if (price) {
      price = parseFloat(price)

      if (isNaN(price))
        throw { message: `Invalid parameters - 'description' is required` }

      payload['price'] = price
    }

    // pegando todos produtos
    let produtos = await product.read(payload)

    // trocando os ids dos marcas pelos nomes
    const marcas = await marca.read({})

    produtos = produtos.map(p => {
      let marcaDescricao = marcas.find(f => f._id === p.marca)

      if (!marcaDescricao) marcaDescricao = ''
      else marcaDescricao = `${marcaDescricao.nome}`

      return {
        ...p,
        marca: marcaDescricao
      }
    })

    // trocando os ids dos grupos pelos nomes
    const grupos = await grupo.read({})

    produtos = produtos.map(p => {
      let grupoDescricao = grupos.find(f => f._id === p.grupo)

      if (!grupoDescricao) grupoDescricao = ''
      else grupoDescricao = `${grupoDescricao.nome}`

      return {
        ...p,
        grupo: grupoDescricao
      }
    })

    // pegando todos fornecedores
    const fornecedores = await fornecedor.read({})

    // trocando os ids dos fornecedores pelos nomes
    produtos = produtos.map(p => {
      let fornecedorDescricao = fornecedores.find(f => f._id === p.fornecedor)

      if (!fornecedorDescricao) fornecedorDescricao = ''
      else
        fornecedorDescricao = `${fornecedorDescricao.nome} (${fornecedorDescricao.cnpj})`

      return {
        ...p,
        fornecedor: fornecedorDescricao
      }
    })

    if (description) {
      produtos = produtos.filter(product => {
        if (product.description.indexOf(description) != -1) {
          return true
        }

        return false
      })
    }

    produtos = await Promise.all(
      produtos.map(async produto => {
        const estoques = await estoque.read({
          produto: produto.description
        })

        produto.quantidade = estoques.reduce((a, b) => {
          return b.tipo === 'Entrada'
            ? a + Number(b.quantidade)
            : a - Number(b.quantidade)
        }, 0)

        return produto
      })
    )

    response.json({ success: true, data: produtos, error: null })
  } catch (error) {
    console.log(error)
    response.status(500).json({ success: false, data: [], error })
  }
})

// Setting POST path
route.post('/', async (request, response) => {
  try {
    let {
      description,
      price,
      quantidade,
      fornecedor,
      marca: marcaParam,
      grupo
    } = typeof request.body == 'string'
      ? JSON.parse(request.body)
      : request.body

    if (!description)
      throw { message: `Invalid parameters - 'description' is required` }

    if (!price) throw { message: `Invalid parameters - 'price' is required` }

    if (!quantidade)
      throw { message: `Invalid parameters - 'quantidade' is required` }

    if (!fornecedor)
      throw { message: `Invalid parameters - 'fornecedor' is required` }

    if (!marcaParam)
      throw { message: `Invalid parameters - 'marca' is required` }

    if (!grupo) throw { message: `Invalid parameters - 'grupo' is required` }

    price = parseFloat(price)

    if (isNaN(price))
      throw { message: `Invalid parameters - 'price' is not a number` }

    if (isNaN(quantidade))
      throw { message: `Invalid parameters - 'quantidade' is not a number` }

    const payload = {
      description,
      price,
      fornecedor,
      marca: marcaParam,
      grupo
    }

    const newProduct = await product.create(payload)

    if (newProduct) {
      await estoque.create({
        produto: newProduct.description,
        quantidade,
        tipo: 'Entrada',
        dataInclusao: new Date().toLocaleString()
      })

      const marcas = await marca.read({})

      await Promise.all(
        marcas.map(async m => {
          if (m._id === marcaParam) {
            await marca.update(m._id, {
              ...m,
              produtos: m.produtos
                ? [...m.produtos, newProduct.description]
                : [newProduct.description]
            })
          }
        })
      )
    }

    response.json({ success: true, data: newProduct, error: null })
  } catch (error) {
    console.log(error)
    response.status(500).json({ success: false, data: null, error })
  }
})

// Setting PUT path
route.put('/:_id', async (request, response) => {
  try {
    let { _id } = request.params,
      { description, price, quantidade, fornecedor, marca, grupo } =
        typeof request.body == 'string'
          ? JSON.parse(request.body)
          : request.body

    if (!_id) throw { message: `Invalid parameters - '_id' is required` }
    if (!description)
      throw { message: `Invalid parameters - 'description' is required` }
    if (!price) throw { message: `Invalid parameters - 'price' is required` }

    price = parseFloat(price)

    if (isNaN(price))
      throw { message: `Invalid parameters - 'price' is not a number` }

    const payload = {
      description,
      price,
      fornecedor,
      marca,
      grupo
    }

    const numReplaced = await product.update(_id, payload)
    await estoque.create({
      produto: description,
      quantidade,
      tipo: 'Entrada',
      dataInclusao: new Date().toLocaleString()
    })
    response.json({ success: true, data: numReplaced, error: null })
  } catch (error) {
    response.status(500).json({ success: false, data: 0, error })
  }
})

// Setting DELETE path
route.delete('/:_id', async (request, response) => {
  try {
    const { _id } = request.params

    if (!_id) throw { message: 'Invalid parameters' }

    const [produtoAtual] = await product.read(request.params)

    const estoques = await estoque.read({
      produto: produtoAtual.description
    })

    const numRemoved = await product.delete(_id)

    await Promise.all(
      estoques.map(async _estoque => {
        await estoque.delete(_estoque._id)
      })
    )

    response.json({ success: true, data: numRemoved, error: null })
  } catch (error) {
    console.log(error)
    response.status(500).json({ success: false, data: 0, error })
  }
})

// Export route
module.exports = route
