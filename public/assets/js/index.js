// Setting temporary variable
let toUpdate = null;

// Getting all sales and update table
async function getAll() {
  try {
    // Mount URL Request
    let urlRequest = `${location.origin}/api/venda`;

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
    for (const sale of json.data) {
      rows += `
        <tr>
          <td class="cliente">${sale.cliente}</td>
          <td class="produto">${sale.produto}</td>
          <td class="quantidade">${parseInt(sale.quantidade)}</td>
          <td class="total">${parseInt(sale.total).toFixed(2)}</td>
        </tr>
      `;
    }

    // Mounting table rows
    tbody.innerHTML = rows;
  } catch (error) {
    console.log(error);
  }
}

// Set sale to update
function update(_id, description, price) {
  // Getting Cancel Update button
  const button = document.querySelector("#cancel_update");

  // Remove hide button CSS class
  button.classList.remove("hidden");

  // Saving sale to temporary variable
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

// Delete sale
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
          `${location.origin}/api/sale/${id}`,
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

    // Create sale object payload
    const sale = {};

    // Setting sale payload properties
    for (const input of inputs) {
      sale[input.name] = input.value;
    }

    // Mount request options
    const options = {
      method: !toUpdate ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sale),
    };

    // Create URL Request
    let urlRequest = `${location.origin}/api/sale`;

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
