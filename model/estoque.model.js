// NeDB
const Datastore = require("nedb");

const path = require("path");

// Creating Store
const estoqueStore = new Datastore({
  filename: path.resolve(__dirname, "./nedb/estoque.db"),
  autoload: true,
});

module.exports = {
  create(estoque) {
    return new Promise((resolve, reject) => {
      estoqueStore.insert(estoque, (error, novoEstoque) => {
        if (error) return reject(error);

        resolve(novoEstoque);
      });
    });
  },
  read(estoque) {
    return new Promise((resolve, reject) => {
      estoqueStore.find(estoque, (error, estoque) => {
        if (error) return reject(error);

        resolve(estoque);
      });
    });
  },
  update(_id, estoque) {
    return new Promise((resolve, reject) => {
      estoqueStore.update({ _id }, estoque, {}, (error, numReplaced) => {
        if (error) return reject(error);

        resolve(numReplaced);
      });
    });
  },
  delete(_id) {
    return new Promise((resolve, reject) => {
      estoqueStore.remove({ _id }, {}, (error, numRemoved) => {
        if (error) return reject(error);

        resolve(numRemoved);
      });
    });
  },
};
