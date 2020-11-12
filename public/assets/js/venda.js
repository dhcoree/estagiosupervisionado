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

    // Clean table rows
    tbody.innerHTML = "";

    // Mounting table rows
    let rows = "";
    for (const product of json.data) {
      rows += `
        <tr>
          <td class="description">${product.description}</td>
          <td class="price">${parseFloat(product.price).toFixed(2)}</td>
          <td class="options">
            <button onclick="update('${product._id}', '${
        product.description
      }', ${product.price})">Edit</button>
            <button onclick="remove('${product._id}')">Delete</button>
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
      inputs = Array.from(form.querySelectorAll("input"));

    // Create product object payload
    const product = {};

    // Setting product payload properties
    for (const input of inputs) {
      product[input.name] = input.value;
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
