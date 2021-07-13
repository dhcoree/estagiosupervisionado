// Setting temporary variable
let toUpdate = null;

// Getting all products and update table
async function getAll() {
  try {
    // Getting form and table HTML elements
    const form = document.body.querySelector("form"),
      tbody = document.body.querySelector("tbody");

    // Getting form inputs
    const inputs = Array.from(form.querySelectorAll("input"));

    // Create product payload for request
    const product = {};

    // Mount URL Request
    let urlRequest = `${location.origin}/api/venda`;
    // Variable to verify if is first loop
    let first = true;

    // Get all inputs vlaues and adding to URL Request query
    for (const input of inputs) {
      if (first) urlRequest += `?${input.name}=${input.value}`;
      else urlRequest += `&${input.name}=${input.value}`;

      first = false;
    }

    // Making request
    const response = await fetch(urlRequest);
    // Extract JSON
    const json = await response.json();

    // Verify if request has error
    if (!json.success) throw json.error;

    const moneyFormatter = (total) => {
      return Intl.NumberFormat("pt-br", {
        style: "currency",
        currency: "BRL",
      }).format(parseInt(total).toFixed(2));
    };

    // Clean table rows
    tbody.innerHTML = "";

    // Mounting table rows
    let rows = "";
    const styles = "px-6 py-4 whitespace-nowrap text-sm text-gray-500";
    for (const product of json.data) {
      rows += `
        <tr>
          <td class="${styles}">${product.cliente}</td>
          <td class="${styles}">${product.marca}</td>
          <td class="${styles}">${product.produto}</td>
          <td class="${styles}">${parseInt(product.quantidade)}</td>
          <td class="${styles}">${moneyFormatter(product.total)}</td>
        </tr>
      `;
    }

    // Mounting table rows
    tbody.innerHTML = rows;
  } catch (error) {
    console.log(error);
  }
}

// Set product to update
function update(_id, description, price) {
  // Getting Cancel Update button
  const button = document.querySelector("#cancel_update");

  // Remove hide button CSS class
  button.classList.remove("hidden");

  // Saving product to temporary variable
  toUpdate = {
    _id,
    description,
    price,
  };

  // Getting form and inputs
  const form = document.querySelector("form"),
    inputs = Array.from(form.querySelectorAll("input"));

  // Setting input values
  for (const input of inputs) {
    if (input.name == "description") input.value = description;
    else if (input.name == "price") input.value = parseFloat(price);
  }
}

// Delete product
async function remove(id) {
  try {
    // Confirm delete
    if (confirm("Confirm Delete?")) {
      // Mount request options
      const options = {
        method: "DELETE",
      };

      // Making request and getting json
      const response = await fetch(
          `${location.origin}/api/venda/${id}`,
          options
        ),
        json = await response.json();

      // Verify if request has error
      if (!json.success) throw json.error;

      // Update table rows
      getAll();
    }
  } catch (error) {
    if (error.message) alert(error.message);
    else console.log(error);
  }
}

// Submit form
async function submitForm(event) {
  // Cancel default submit form behaviour
  event.preventDefault();

  try {
    // Getting form and inputs
    const form = document.querySelector("form"),
      inputs = Array.from(form.querySelectorAll("input")),
      selects = Array.from(form.querySelectorAll("select"));

    // Create product object payload
    const product = {};

    // Setting product payload properties
    for (const input of inputs) {
      product[input.name] = input.value;
    }

    // Setting product payload properties
    for (const select of selects) {
      product[select.name] = select.value;
    }

    // Mount request options
    const options = {
      method: !toUpdate ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    };

    // Create URL Request
    let urlRequest = `${location.origin}/api/venda`;

    // Verify if it is update
    if (toUpdate) urlRequest += `/${toUpdate._id}`;

    // Making request and getting json
    const response = await fetch(urlRequest, options),
      json = await response.json();

    // Verify if request has error
    if (!json.success) throw json.error;

    // Verify if it is update
    if (toUpdate) cancelUpdate();

    // Reset form
    form.reset();
    // Update table rows
    getAll();
  } catch (error) {
    if (error.message) alert(error.message);
    else console.log(error);
  }
}

// Getting all clientes and update table
async function getAllClientes() {
  try {
    // Getting form and table HTML elements
    const select = document.body.querySelector("#venda_cliente");

    // Mount URL Request
    let urlRequest = `${location.origin}/api/cliente`;

    // Making request
    const response = await fetch(urlRequest);
    // Extract JSON
    const json = await response.json();

    // Verify if request has error
    if (!json.success) throw json.error;

    // Clean table rows
    select.innerHTML = `<option value="" selected>Selecione um cliente</option>`;

    // Mounting table rows
    let rows = select.innerHTML;
    for (const cliente of json.data) {
      rows += `
        <option value="${cliente.nome}">
        ${cliente.nome}
        </option>
      `;
    }

    // Mounting table rows
    select.innerHTML = rows;
  } catch (error) {
    console.log(error);
  }
}

// Getting all produto and update table
async function getAllProdutos() {
  try {
    // Getting form and table HTML elements
    const select = document.body.querySelector("#venda_produto");

    // Mount URL Request
    let urlRequest = `${location.origin}/api/produto`;

    // Making request
    const response = await fetch(urlRequest);
    // Extract JSON
    const json = await response.json();

    // Verify if request has error
    if (!json.success) throw json.error;

    // Clean table rows
    select.innerHTML = `<option value="" selected>Selecione um produto</option>`;

    // Mounting table rows
    let rows = select.innerHTML;
    for (const produto of json.data) {
      rows += `
        <option value="${produto.description}" data-price="${produto.price}">
        ${produto.description} (R$ ${parseFloat(produto.price).toFixed(2)})
        </option>
      `;
    }

    // Mounting table rows
    select.innerHTML = rows;
  } catch (error) {
    console.log(error);
  }
}

// Getting all marca and update table
async function getAllMarca() {
  try {
    // Getting form and table HTML elements
    const select = document.body.querySelector("#produto_marca");

    // Mount URL Request
    let urlRequest = `${location.origin}/api/marca`;

    // Making request
    const response = await fetch(urlRequest);
    // Extract JSON
    const json = await response.json();

    // Verify if request has error
    if (!json.success) throw json.error;

    // Clean table rows
    select.innerHTML = `<option value="" selected>Selecione um marca</option>`;

    // Mounting table rows
    let rows = select.innerHTML;
    for (const marca of json.data) {
      rows += `
        <option value="${marca._id}">
         ${marca.nome}
        </option>
      `;
    }
    // Mounting table rows
    select.innerHTML = rows;
  } catch (error) {
    console.log(error);
  }
}

function cancelUpdate() {
  // Getting cancel update button and form HTML elements
  const button = document.querySelector("#cancel_update"),
    form = document.querySelector("form");

  // Remove hidden CSS class from button
  // button.classList.add("hidden");
  // Reset form
  form.reset();

  // Clean temporary variable
  toUpdate = null;
}

// https://stackoverflow.com/questions/15547198/export-html-table-to-csv
// Quick and simple export target #table_id into a csv
function makeReport(table_id = "venda_table", separator = ";") {
  // Select rows from table_id
  var rows = document.querySelectorAll("table#" + table_id + " tr");
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td:not(.acoes), th:not(.acoes)");
    for (var j = 0; j < cols.length; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      var data = cols[j].innerText
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/(\s\s)/gm, " ");
      // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  var csv_string = csv.join("\n");
  // Download it
  var filename =
    "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
  var link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("target", "_blank");
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csv_string)
  );
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Getting form
const form = document.body.querySelector("form");

// Add submit event to form
form.addEventListener("submit", submitForm);
// Update table rows
getAll();
getAllClientes();
getAllProdutos();
getAllMarca();

// evento para atualizar o valor total da compra
document
  .querySelector("#venda_quantidade")
  .addEventListener("change", function (event) {
    const quantidade = event.target.value;

    const valor = document.querySelector("#venda_produto").selectedOptions[0]
      .dataset.price;

    document.querySelector("#venda_total").value = quantidade * valor;
  });
