// 1. Variables
const contenedorCarrito = document.getElementById('contenedor-carrito');
const accionesCarrito = document.getElementById('acciones-carrito');
const precioTotalElement = document.getElementById('precio-total');
const contadorCarrito = document.getElementById('contador-carrito');

let productosDisponibles = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// 2. Inicialización: Cargar productos y luego renderizar carrito
document.addEventListener('DOMContentLoaded', () => {
    fetch('../productos.json')
        .then(response => response.json())
        .then(data => {
            productosDisponibles = data;
            mostrarCarrito();
            actualizarContador();
        })
        .catch(error => console.error('Error cargando productos:', error));
});

// 3. Función Principal: Mostrar el Carrito
function mostrarCarrito() {
    contenedorCarrito.innerHTML = ''; // Limpiar

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="alert alert-info text-center" role="alert">
                Tu carrito está vacío. <a href="../index.html#servicios" class="alert-link">¡Volvé a la tienda!</a>
            </div>
        `;
        accionesCarrito.classList.add('d-none'); // Ocultar resumen
        return;
    }

    // Si hay productos, mostramos la sección de resumen
    accionesCarrito.classList.remove('d-none');

    // Crear Tabla
    const tabla = document.createElement('table');
    tabla.classList.add('table', 'align-middle');
    tabla.innerHTML = `
        <thead>
            <tr>
                <th scope="col">Destinos</th>
                <th scope="col" class="text-center">Precio</th>
                <th scope="col" class="text-center">Cant.</th>
                <th scope="col" class="text-center">Subtotal</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody id="items-tabla"></tbody>
    `;
    contenedorCarrito.appendChild(tabla);

    const bodyTabla = document.getElementById('items-tabla');
    let totalCalculado = 0;

    // Generar filas
    carrito.forEach(item => {
        // Buscamos la info completa del producto usando su ID
        const productoInfo = productosDisponibles.find(p => p.id === item.id);
        
        if (productoInfo) {
            const subtotal = productoInfo.precio * item.cantidad;
            totalCalculado += subtotal;

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src=".${productoInfo.imagen}" alt="${productoInfo.titulo}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                        <div>
                            <p class="m-0 fw-bold">${productoInfo.titulo}</p>
                        </div>
                    </div>
                </td>
                <td class="text-center">$${productoInfo.precio}</td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span class="btn btn-light disabled" style="width: 40px; color: black;">${item.cantidad}</span>
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td class="text-center fw-bold text-secondary">$${subtotal}</td>
                <td class="text-end">
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${item.id})">🗑️</button>
                </td>
            `;
            bodyTabla.appendChild(fila);
        }
    });

    // Actualizar total en el DOM
    precioTotalElement.textContent = `$${totalCalculado}`;
}

// 4. Funciones de manipulación

// Cambiar cantidad (+1 o -1)
window.cambiarCantidad = function(id, cambio) {
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarProducto(id);
            return;
        }
        actualizarStorage();
    }
};

// Eliminar producto
window.eliminarProducto = function(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarStorage();
};

// Vaciar todo
window.vaciarCarrito = function() {
    carrito = [];
    actualizarStorage();
};

// Función auxiliar para guardar y redibujar
function actualizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
}

// Actualizar el numerito del header
function actualizarContador() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (contadorCarrito) {
        contadorCarrito.textContent = totalItems;
    }
}