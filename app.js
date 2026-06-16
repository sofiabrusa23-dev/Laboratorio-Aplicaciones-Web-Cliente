const productsdiv = document.getElementById('products');
const botonesCategoria = document.querySelectorAll(".filter-category");
const botonesPrecio = document.querySelectorAll(".filter-price");
const searchInput = document.getElementById("searchInput");

let productos = [];
let categoriaActual = "all";
let ordenPrecio = "";
let busquedaActual = "";

// Función para inicializar la web
async function inicializar() {
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




inicializar();


