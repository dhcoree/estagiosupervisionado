// Server
const express = require("express");
// Middlewares
const bodyParser = require("body-parser"),
  cors = require("cors");

// Utils
const path = require("path");

// Environment variables
const PORT = process.env.PORT || 8080;

// API
const api = require("./api");

// Creating application
const app = express();

// Setting middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// Setting routes
// Application page
app.get("/", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/index.html"));
});

// Cliente page
app.get("/cliente", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/cliente.html"));
});

// Cliente page
app.get("/produto", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/produto.html"));
});

// Cliente page
app.get("/estoque", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/estoque.html"));
});

// Vendas page
app.get("/venda", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/venda.html"));
});


app.get("/fornecedor", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/fornecedor.html"));
});

app.get("/grupo", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/grupo.html"));
});

app.get("/marca", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/marca.html"));
});





// Public path
app.use("/public", express.static(path.join(__dirname, "public")));

// API Route
app.use("/api", api);

// 404 Not found
app.use("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "public/error.html"));
});

// Starting app
app.listen(PORT, () => console.log(`Running at port ${PORT}`));
