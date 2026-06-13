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
    <article class="product-card">
      <div class="product-card_image-contenedor">
        <img src="${product.image}" alt="${product.title}" class="product-card_image">
      </div>

      <div class="product-card_content">
        <h3 class="product-card_title">${product.title}</h3>

        <div class="product-card_footer">
          <p class="product-card_price">$${product.price}</p>
          <button class="product-card_button">Ver más</button>
        </div>
      </div>
    </article>
  `;
}

inicializar();


