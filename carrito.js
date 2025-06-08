// Variables
let carrito = []
const botonCarrito = document.getElementById("botonCarrito")
const modalCarrito = document.getElementById("modalCarrito")
const cerrarModal = document.getElementById("cerrarModal")
const itemsCarrito = document.getElementById("itemsCarrito")
const totalCarrito = document.getElementById("totalCarrito")
const contadorCarrito = document.getElementById("contadorCarrito")
const mensajeConfirmacion = document.getElementById("mensajeConfirmacion")
const botonesAgregar = document.querySelectorAll(".boton-agregar")
const botonComprar = document.getElementById("botonComprar")


function limpiarCarritoCompleto() {
  carrito = []
  localStorage.removeItem("carrito")
  localStorage.clear() 
  actualizarCarrito()
  console.log("Carrito limpiado completamente")
}

function validarCarrito() {
  carrito = carrito.filter((producto) => {
    return (
      producto.id &&
      producto.nombre &&
      producto.precio !== undefined &&
      producto.precio !== null &&
      producto.cantidad > 0
    )
  })
}

function cargarCarrito() {
  try {
    const carritoGuardado = localStorage.getItem("carrito")
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado)
      validarCarrito() 
    }
  } catch (error) {
    console.log("Error al cargar carrito, limpiando...")
    limpiarCarritoCompleto()
  }
}

function actualizarCarrito() {

  validarCarrito()

  itemsCarrito.innerHTML = ""

  if (carrito.length === 0) {
    itemsCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>'
    totalCarrito.textContent = "$0"
    contadorCarrito.textContent = "0"
    contadorCarrito.style.display = "none"
    return
  }

  let total = 0
  let cantidadTotal = 0

  carrito.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad
    total += subtotal
    cantidadTotal += producto.cantidad

    const itemHTML = `
            <div class="item-carrito" data-id="${producto.id}" data-index="${index}">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-item">
                <div class="info-item">
                    <p class="nombre-item">${producto.nombre}</p>
                    <p class="precio-item">$${producto.precio}</p>
                </div>
                <div class="cantidad-item">
                    <button class="boton-cantidad restar" data-id="${producto.id}" data-index="${index}">-</button>
                    <span class="numero-cantidad">${producto.cantidad}</span>
                    <button class="boton-cantidad sumar" data-id="${producto.id}" data-index="${index}">+</button>
                    <button class="boton-eliminar" data-id="${producto.id}" data-index="${index}">🗑️</button>
                </div>
            </div>
        `

    itemsCarrito.innerHTML += itemHTML
  })

  totalCarrito.textContent = `$${total}`
  contadorCarrito.textContent = cantidadTotal
  contadorCarrito.style.display = cantidadTotal > 0 ? "flex" : "none"

  localStorage.setItem("carrito", JSON.stringify(carrito))

  agregarEventListenersCarrito()
}

function agregarEventListenersCarrito() {
  const botonesSumar = document.querySelectorAll(".sumar")
  botonesSumar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const index = Number.parseInt(boton.getAttribute("data-index"))
      sumarCantidad(index)
    })
  })

  const botonesRestar = document.querySelectorAll(".restar")
  botonesRestar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const index = Number.parseInt(boton.getAttribute("data-index"))
      restarCantidad(index)
    })
  })

  const botonesEliminar = document.querySelectorAll(".boton-eliminar")
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const index = Number.parseInt(boton.getAttribute("data-index"))
      eliminarProducto(index)
    })
  })
}

function agregarAlCarrito(id, nombre, precio, imagen) {
  if (!id || !nombre || precio === undefined || precio === null) {
    console.error("Datos de producto inválidos")
    return
  }

  const productoExistente = carrito.find((item) => item.id === id)

  if (productoExistente) {
    productoExistente.cantidad += 1
  } else {
    carrito.push({
      id: id,
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      cantidad: 1,
    })
  }


  actualizarCarrito()


  mostrarMensaje(`${nombre} agregado al carrito`)
}

function sumarCantidad(index) {
  if (carrito[index]) {
    carrito[index].cantidad += 1
    actualizarCarrito()
  }
}

function restarCantidad(index) {
  if (carrito[index]) {
    carrito[index].cantidad -= 1

    if (carrito[index].cantidad <= 0) {
      eliminarProducto(index)
    } else {
      actualizarCarrito()
    }
  }
}

function eliminarProducto(index) {
  if (index >= 0 && index < carrito.length) {
    const nombreProducto = carrito[index].nombre
    carrito.splice(index, 1)
    actualizarCarrito()
    mostrarMensaje(`${nombreProducto} eliminado del carrito`)
  }
}

function mostrarMensaje(texto = "Producto agregado al carrito") {
  const mensaje = document.getElementById("mensajeConfirmacion")
  mensaje.querySelector("p").textContent = texto
  mensaje.style.display = "block"


  setTimeout(() => {
    mensaje.style.display = "none"
  }, 3000)
}

function vaciarCarrito() {
  carrito = []
  actualizarCarrito()
  mostrarMensaje("Carrito vaciado")
}


document.addEventListener("DOMContentLoaded", () => {

  cargarCarrito()


  actualizarCarrito()

 
  botonCarrito.addEventListener("click", (e) => {
    e.preventDefault()
    modalCarrito.style.display = "flex"
  })


  cerrarModal.addEventListener("click", (e) => {
    e.preventDefault()
    modalCarrito.style.display = "none"
  })


  window.addEventListener("click", (e) => {
    if (e.target === modalCarrito) {
      modalCarrito.style.display = "none"
    }
  })


  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault()
      const producto = boton.closest(".producto, .oferta")
      const id = producto.getAttribute("data-id")
      const nombre = producto.querySelector("h4").textContent
      const precio = Number.parseInt(producto.getAttribute("data-precio"))
      const imagen = producto.querySelector("img").src

      agregarAlCarrito(id, nombre, precio, imagen)
    })
  })

  botonComprar.addEventListener("click", (e) => {
    e.preventDefault()
    if (carrito.length > 0) {
      const total = totalCarrito.textContent
      alert(`¡Gracias por tu compra! Total: ${total}`)
      vaciarCarrito()
      modalCarrito.style.display = "none"
    } else {
      alert("Tu carrito está vacío")
    }
  })

  
  const botonLimpiar = document.createElement("button")
  botonLimpiar.textContent = "Limpiar Carrito"
  botonLimpiar.style.cssText =
    "position: fixed; top: 10px; right: 10px; z-index: 9999; background: red; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;"
  botonLimpiar.addEventListener("click", limpiarCarritoCompleto)
  document.body.appendChild(botonLimpiar)

  console.log("Carrito cargado:", carrito)
})
