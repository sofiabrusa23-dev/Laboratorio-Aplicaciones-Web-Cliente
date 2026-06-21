const productsdiv = document.getElementById('products');
const botonesCategoria = document.querySelectorAll(".filter-category");
const botonesPrecio = document.querySelectorAll(".filter-price");
const searchInput = document.getElementById("searchInput");
const cartContainer = document.getElementById("cart-container");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const total = document.getElementById("total");
const STORAGE_KEY = "cart";

let productos = [];
let categoriaActual = "all";
let ordenPrecio = "";
let busquedaActual = "";

// Función para inicializar la web
async function inicializar() {
    inicializarLocalStorage();
    actualizarBadge();
    actualizarEstadoBotones();
    const products = await traerProductos();
    productos = products; 
    renderizarProductos(products);
    activarFiltros();
    activarBusqueda();

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
 productsdiv.innerHTML = "";

  products.forEach(product => {
    productsdiv.innerHTML += crearCard(product);
  });

  activarBotonesVerMas();

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




// Funcion para abrir modal 
function abrirModal(product) {
  const modal = document.getElementById("modalProducto");

  const modalImagen = document.getElementById("modalImagen");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalCategoria = document.getElementById("modalCategoria");
  const modalDescripcion = document.getElementById("modalDescripcion");
  const modalPrecio = document.getElementById("modalPrecio");
  const botonAgregar = document.querySelector(".modal-producto_boton");

  modalImagen.src = product.image;
  modalImagen.alt = product.title;
  modalTitulo.textContent = product.title;
  modalCategoria.textContent = product.category;
  modalDescripcion.textContent = product.description;
  modalPrecio.textContent = `$${product.price}`;

  botonAgregar.onclick = () => {
    GuardarEnLocalStorage(product);
    actualizarBadge();
    mostrarToast();
  };

  modal.classList.add("modal-producto_activo");
}

function cerrarModal() {
  const modal = document.getElementById("modalProducto");
  modal.classList.remove("modal-producto_activo");
}

function actualizarEstadoBotones() {
  const cart = ObtenerDelLocalStorage();

  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");

  if (!checkoutBtn || !clearCartBtn) return;

  const estaVacio = cart.length === 0;

  checkoutBtn.disabled = estaVacio;
  clearCartBtn.disabled = estaVacio;
}

document.getElementById("cerrarModal").addEventListener("click", cerrarModal);

document.getElementById("modalProducto").addEventListener("click", (event) => {
  if (event.target.id === "modalProducto") {
    cerrarModal();
  }
});




//  Funcion Filtros
function activarFiltros() {
  botonesCategoria.forEach(boton => {
    boton.addEventListener("click", () => {
      botonesCategoria.forEach(btn => btn.classList.remove("active"));
      boton.classList.add("active");

      categoriaActual = boton.dataset.category;
      filtrarProductos();
    });
  });

  botonesPrecio.forEach(boton => {
    boton.addEventListener("click", () => {
      botonesPrecio.forEach(btn => btn.classList.remove("active"));
      boton.classList.add("active");

      ordenPrecio = boton.dataset.order;
      filtrarProductos();
    });
  });
}

function filtrarProductos() {
  let productosFiltrados = [...productos];

  if (categoriaActual !== "all") {
    productosFiltrados = productosFiltrados.filter(product => {
      return product.category === categoriaActual;
    });
  }

   if (busquedaActual !== "") {
    productosFiltrados = productosFiltrados.filter(product => {
      return (
        product.title.toLowerCase().includes(busquedaActual) ||
        product.category.toLowerCase().includes(busquedaActual)
      );
    });
  }

  if (ordenPrecio === "menor") {
    productosFiltrados.sort((a, b) => a.price - b.price);
  }

  if (ordenPrecio === "mayor") {
    productosFiltrados.sort((a, b) => b.price - a.price);
  }

  renderizarProductos(productosFiltrados);
}




// Funcion Busqueda
function activarBusqueda() {
  searchInput.addEventListener("input", () => {
    busquedaActual = searchInput.value.toLowerCase().trim();
    filtrarProductos();
  });
}

// Local Storage

function inicializarLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

function ObtenerDelLocalStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function GuardarEnLocalStorage(item) {
  let cart = ObtenerDelLocalStorage();

  const productoExistente = cart.find((producto) => producto.id === item.id);

  if (productoExistente) {
    productoExistente.quantity++;
  } else {
    cart.push({
      ...item,
      quantity: 1,
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// Carrito

function actualizarBadge() {
  const cart = ObtenerDelLocalStorage();

  let cantidad = 0;

  cart.forEach((product) => {
    cantidad += product.quantity;
  });

  document.getElementById("cart-badge").textContent = cantidad;
}

function renderCart() {
  const cart = ObtenerDelLocalStorage();

  cartContainer.innerHTML = "";

  let totalCompra = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <h3>Tu carrito está vacío 🛒</h3>
    `;

    total.textContent = "Total: $0";
    actualizarEstadoBotones();
    return;
  }

  cart.forEach((product) => {
    totalCompra += product.price * product.quantity;

    cartContainer.innerHTML += `
  <article class="cart-item">

    <img src="${product.image}" alt="${product.title}">

    <div class="cart-item-info">

      <h3 class="cart-item-title">
        ${product.title}
      </h3>

      <div class="cart-quantity">

        <button
          onclick="disminuirCantidad(${product.id})"
          ${product.quantity === 1 ? "disabled" : ""}
        >
          -
        </button>

        <span>
          ${product.quantity}
        </span>

        <button
          onclick="aumentarCantidad(${product.id})"
        >
          +
        </button>

      </div>

      <p class="cart-item-subtotal">
        $${(product.price * product.quantity).toFixed(2)}
      </p>

      <button
        class="btn-delete"
        onclick="eliminarProducto(${product.id})"
      >
        Eliminar
      </button>

    </div>

  </article>
`;
  });

  total.textContent = `Total: $${totalCompra.toFixed(2)}`;

  actualizarEstadoBotones();
}

function eliminarProducto(id) {
  let cart = ObtenerDelLocalStorage();

  cart = cart.filter((p) => p.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  actualizarBadge();
  renderCart();
}

function aumentarCantidad(id) {
  const cart = ObtenerDelLocalStorage();

  const producto = cart.find((p) => p.id === id);

  producto.quantity++;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  actualizarBadge();
  renderCart();
}

function disminuirCantidad(id) {
  const cart = ObtenerDelLocalStorage();

  const producto = cart.find((p) => p.id === id);

  if (producto.quantity > 1) {
    producto.quantity--;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  actualizarBadge();
  renderCart();
}

function mostrarToast() {
  const toastElement = document.getElementById("cartToast");

  const toast = new bootstrap.Toast(toastElement, {
    delay: 2000
  });

  toast.show();
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", vaciarCarrito);
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", finalizarCompra);
}

function finalizarCompra() {
  const cart = ObtenerDelLocalStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

  actualizarBadge();
  renderCart();

  alert("Compra realizada con éxito");
}

function vaciarCarrito() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

  actualizarBadge();
  renderCart();
}

document
  .getElementById("carritoSidebar")
  .addEventListener("show.bs.offcanvas", renderCart);


inicializar();


