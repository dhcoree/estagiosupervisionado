// NeDB
const Datastore = require('nedb')

const path = require('path')

// Creating Store
const productStore = new Datastore({
  filename: path.resolve(__dirname, './nedb/product.db'),
  autoload: true
})

module.exports = {
  create (product) {
    return new Promise((resolve, reject) => {
      productStore.insert(product, (error, newProduct) => {
        if (error)
          return reject(error)

        resolve(newProduct)
      })
    })
  },
  read (product) {
    return new Promise((resolve, reject) => {
      productStore.find(product, (error, products) => {
        if (error)
          return reject(error)

        resolve(products)
      })
    })
  },
  update (_id, product) {
    return new Promise((resolve, reject) => {
      productStore.update({ _id }, product, {}, (error, numReplaced) => {
        if (error)
          return reject(error)

        resolve(numReplaced)
      })
    })
  },
  delete (_id) {
    return new Promise((resolve, reject) => {
      productStore.remove({ _id }, {}, (error, numRemoved) =>  {
        if (error)
          return reject(error)

        resolve(numRemoved)
      })
    })
  }
}
