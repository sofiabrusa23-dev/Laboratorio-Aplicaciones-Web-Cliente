const productsdiv = document.getElementById('products');
let productos = [];

// Función para inicializar la web
async function inicializar() {
    const products = await traerProductos();
    productos = products; 
    renderizarProductos(products);
    activarBotonesVerMas();

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
          <button class="product-card_button" data-id="${product.id}">Ver más</button>
        </div>
      </div>
    </article>
  `;
}


// Funcion mapear los botones para abrir el modal
function activarBotonesVerMas() {
  const botonesVerMas = document.querySelectorAll(".product-card_button");

  botonesVerMas.forEach(boton => {
    boton.addEventListener("click", () => {
      const idProducto = Number(boton.dataset.id);
      const productoSeleccionado = productos.find(product => product.id === idProducto);

      abrirModal(productoSeleccionado);
    });
  });
}




// funcion para abrir modal 
function abrirModal(product) {
  const modal = document.getElementById("modalProducto");

  const modalImagen = document.getElementById("modalImagen");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalCategoria = document.getElementById("modalCategoria");
  const modalDescripcion = document.getElementById("modalDescripcion");
  const modalPrecio = document.getElementById("modalPrecio");

  modalImagen.src = product.image;
  modalImagen.alt = product.title;
  modalTitulo.textContent = product.title;
  modalCategoria.textContent = product.category;
  modalDescripcion.textContent = product.description;
  modalPrecio.textContent = `$${product.price}`;

  modal.classList.add("modal-producto_activo");
}

function cerrarModal() {
  const modal = document.getElementById("modalProducto");
  modal.classList.remove("modal-producto_activo");
}

document.getElementById("cerrarModal").addEventListener("click", cerrarModal);

document.getElementById("modalProducto").addEventListener("click", (event) => {
  if (event.target.id === "modalProducto") {
    cerrarModal();
  }
});



inicializar();


