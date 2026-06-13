const productsdiv = document.getElementById('products');

// Función para inicializar la web
async function inicializar() {
    const products = await traerProductos();
    renderizarProductos(products);

}

// Fech a los productos de la API
async function traerProductos() {
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  console.log(data);
  return data;
}

// Función para renderizar los productos y crear la card
function renderizarProductos(products) {

    products.forEach(product => {
        crearCard(product);
        productsdiv.innerHTML += crearCard(product);
    });

}

function crearCard(product) {
   return `
    <section id="products">
          <div class="card" style="width: 18rem;" href="#">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text"><strong>$${product.price}</strong></p>
            </div>
          </div>
        </section>
    `
}

inicializar();


