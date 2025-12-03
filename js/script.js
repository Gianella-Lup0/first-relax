let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const contenedorProductos = document.getElementById('contenedor-productos');
const contadorCarrito = document.getElementById('contador-carrito');

// 2. Función para obtener datos (FETCH)
async function fetchProductos() {
    try {        
        const response = await fetch('./productos.json'); 
        if (!response.ok) {
            throw new Error('No se pudo cargar la data');
        }
        const productos = await response.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error('Error:', error);
        // Si falla:
        contenedorProductos.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los servicios.</p>';
    }
}

// 3. Función para dibujar (renderizar) los productos en el HTML
function renderizarProductos(productos) {
    contenedorProductos.innerHTML = ''; 
    
    productos.forEach(producto => {
        const div = document.createElement('div');       
        div.classList.add('col-12', 'col-md-6', 'col-lg-3');
        
        div.innerHTML = `
            <div class="card h-100 service">
                 <img src="${producto.imagen}" class="card-img-top" alt="${producto.titulo}">
                 <div class="card-body d-flex flex-column align-items-center"> <h3 class="card-title">${producto.titulo}</h3> <p class="card-text texto-servicio small">${producto.descripcion}</p>
                        <p class="price fw-bold">Precio: $${producto.precio}</p>
                        <button class="btn btn-dark mt-3" onclick="agregarAlCarrito(${producto.id})">Reservar</button> </div>
             </div>
        `;
        contenedorProductos.appendChild(div);
    });
}

// 4. Función Agregar al Carrito 
window.agregarAlCarrito = function(id) {
    
    const itemExistente = carrito.find(item => item.id === id);
    
    if(itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    alert("¡Servicio agregado al carrito!");
    actualizarContador();
}

// 5. Actualizar el numerito del carrito
function actualizarContador() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if(contadorCarrito) {
        contadorCarrito.textContent = totalItems;
    }
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    fetchProductos();
    actualizarContador();
});