// NeDB
const Datastore = require('nedb')

const path = require('path')

// Creating Store
const marcaStore = new Datastore({
  filename: path.resolve(__dirname, './nedb/marca.db'),
  autoload: true
})

module.exports = {
  create(marca) {
    return new Promise((resolve, reject) => {
      marcaStore.insert(marca, (error, newMarca) => {
        if (error) return reject(error)

        resolve(newMarca)
      })
    })
  },
  read(marca) {
    return new Promise((resolve, reject) => {
      marcaStore.find(marca, (error, marcas) => {
        if (error) return reject(error)

        resolve(marcas)
      })
    })
  },
  update(_id, marca) {
    return new Promise((resolve, reject) => {
      marcaStore.update({ _id }, marca, {}, (error, numReplaced) => {
        if (error) return reject(error)

        resolve(numReplaced)
      })
    })
  },
  delete(_id) {
    return new Promise((resolve, reject) => {
      marcaStore.remove({ _id }, {}, (error, numRemoved) => {
        if (error) return reject(error)

        resolve(numRemoved)
      })
    })
  }
}
