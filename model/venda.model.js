// NeDB
const Datastore = require("nedb");

const path = require("path");

// Creating Store
const vendasStore = new Datastore({
  filename: path.resolve(__dirname, "./nedb/venda.db"),
  autoload: true,
});

module.exports = {
  create(vendas) {
    return new Promise((resolve, reject) => {
      vendasStore.insert(vendas, (error, newvendas) => {
        if (error) return reject(error);

        resolve(newvendas);
      });
    });
  },
  read(vendas) {
    return new Promise((resolve, reject) => {
      vendasStore.find(vendas, (error, vendas) => {
        if (error) return reject(error);

        resolve(vendas);
      });
    });
  },
  update(_id, vendas) {
    return new Promise((resolve, reject) => {
      vendasStore.update({ _id }, vendas, {}, (error, numReplaced) => {
        if (error) return reject(error);

        resolve(numReplaced);
      });
    });
  },
  delete(_id) {
    return new Promise((resolve, reject) => {
      vendasStore.remove({ _id }, {}, (error, numRemoved) => {
        if (error) return reject(error);

        resolve(numRemoved);
      });
    });
  },
};
