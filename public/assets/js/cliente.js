// Setting temporary variable
let toUpdate = null;

// Getting all clientes and update table
async function getAll() {
  try {
    // Getting form and table HTML elements
    const form = document.body.querySelector("form"),
      tbody = document.body.querySelector("tbody");

    // Getting form inputs
    const inputs = Array.from(form.querySelectorAll("input"));

    // Create cliente payload for request
    const cliente = {};

    // Mount URL Request
    let urlRequest = `${location.origin}/api/cliente`;
    // Variable to verify if is first loop
    let first = true;

    // Get all inputs values and adding to URL Request query
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

    // Clean table rows
    tbody.innerHTML = "";

    // Mounting table rows
    let rows = "";
    for (const cliente of json.data) {
      rows += `
        <tr>
          <td class="nome">${cliente.nome}</td>
          <td class="idade">${parseInt(cliente.idade)}</td>
          <td class="options">
            <button onclick="update('${cliente._id}', '${cliente.nome}', ${
        cliente.idade
      })">Editar</button>
            <button onclick="remove('${cliente._id}')">Deletar</button>
          </td>
        </tr>
      `;
    }

    // Mounting table rows
    tbody.innerHTML = rows;
  } catch (error) {
    console.log(error);
  }
}

// Set cliente to update
function update(_id, nome, idade) {
  // Getting Cancel Update button
  const button = document.querySelector("#cancel_update");

  // Remove hide button CSS class
  button.classList.remove("hidden");

  // Saving cliente to temporary variable
  toUpdate = {
    _id,
    nome,
    idade,
  };

  // Getting form and inputs
  const form = document.querySelector("form"),
    inputs = Array.from(form.querySelectorAll("input"));

  // Setting input values
  for (const input of inputs) {
    if (input.name == "nome") input.value = nome;
    else if (input.name == "idade") input.value = parseFloat(idade);
  }
}

// Delete cliente
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
          `${location.origin}/api/cliente/${id}`,
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
      inputs = Array.from(form.querySelectorAll("input"));

    // Create cliente object payload
    const cliente = {};

    // Setting cliente payload properties
    for (const input of inputs) {
      cliente[input.name] = input.value;
    }

    // Mount request options
    const options = {
      method: !toUpdate ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    };

    // Create URL Request
    let urlRequest = `${location.origin}/api/cliente`;

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

function cancelUpdate() {
  // Getting cancel update button and form HTML elements
  const button = document.querySelector("#cancel_update"),
    form = document.querySelector("form");

  // Remove hidden CSS class from button
  button.classList.add("hidden");
  // Reset form
  form.reset();

  // Clean temporary variable
  toUpdate = null;
}

// Getting form
const form = document.body.querySelector("form");

// Add submit event to form
form.addEventListener("submit", submitForm);
// Update table rows
getAll();
