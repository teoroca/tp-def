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

//filtra productos inválidos del carrito
function validarCarrito() {
    const carritoOriginal = [...carrito]
    carrito = carrito.filter((producto) => {
      return (
        producto.id &&
        producto.nombre &&
        producto.precio !== undefined &&
        producto.precio !== null &&
        producto.cantidad > 0
      )
    })
  
    if (carritoOriginal.length !== carrito.length) {
      guardarCarrito()
    }
  }
  // carga carrito desde localStorage
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

function guardarCarrito() {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito))
      console.log("Carrito guardado:", carrito)
    } catch (error) {
      console.error("Error al guardar carrito:", error)
    }
  }

// actualiza el contenido visual del carrito
function actualizarCarrito() {

  validarCarrito()

  itemsCarrito.innerHTML = ""

  if (carrito.length === 0) {
    itemsCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>'
    totalCarrito.textContent = "$0"
    contadorCarrito.textContent = "0"
    contadorCarrito.style.display = "none"
    guardarCarrito() 
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
                    <button class="boton-eliminar" data-id="${producto.id}">🗑️</button>

                </div>
            </div>
        `

    itemsCarrito.innerHTML += itemHTML
  })

  totalCarrito.textContent = `$${total}`
  contadorCarrito.textContent = cantidadTotal
  contadorCarrito.style.display = cantidadTotal > 0 ? "flex" : "none"

  guardarCarrito()

  agregarEventListenersCarrito()
}
// agrega eventos a los botones del carrito
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
    const id = boton.getAttribute("data-id")
    eliminarProductoPorId(id)
  })
})

}

// agrega un producto al carrito
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

// inicia eventos al cargar la página
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

  // Finalizar compra
    botonComprar.addEventListener("click", (e) => {
        e.preventDefault()
        if (carrito.length > 0) {
         mostrarFormularioPago()
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


//COMPRA

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
  
  // funcion para mostrar formulario de pago
  function mostrarFormularioPago() {
    const total = totalCarrito.textContent
  
    const formularioHTML = `
      <div class="modal-pago" id="modalPago">
        <div class="contenido-modal-pago">
          <div class="cabecera-modal-pago">
            <h3>Finalizar Compra</h3>
            <button class="cerrar-modal-pago" id="cerrarModalPago">&times;</button>
          </div>
          <div class="cuerpo-modal-pago">
            <div class="resumen-compra">
              <h4>Resumen de tu compra</h4>
              <p><strong>Total a pagar: ${total}</strong></p>
            </div>
            
            <form class="formulario-pago" id="formularioPago">
              <div class="campo-formulario">
                <label for="nombre">Nombre completo *</label>
                <input type="text" id="nombre" name="nombre" required>
                <span class="error-mensaje" id="errorNombre"></span>
              </div>
              
              <div class="campo-formulario">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required>
                <span class="error-mensaje" id="errorEmail"></span>
              </div>
              
              <div class="campo-formulario">
                <label for="tarjeta">Número de tarjeta *</label>
                <input type="text" id="tarjeta" name="tarjeta" placeholder="1234 5678 9012 3456" maxlength="19" required>
                <span class="error-mensaje" id="errorTarjeta"></span>
              </div>
              
              <div class="campo-formulario">
                <label for="direccion">Dirección de envío *</label>
                <textarea id="direccion" name="direccion" rows="3" required></textarea>
                <span class="error-mensaje" id="errorDireccion"></span>
              </div>
              
              <div class="botones-formulario">
                <button type="button" class="boton-cancelar" id="cancelarPago">Cancelar</button>
                <button type="submit" class="boton-pagar">Confirmar Pago</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `
  
    document.body.insertAdjacentHTML("beforeend", formularioHTML)
  
    const modalPago = document.getElementById("modalPago")
    const cerrarModalPago = document.getElementById("cerrarModalPago")
    const cancelarPago = document.getElementById("cancelarPago")
    const formularioPago = document.getElementById("formularioPago")
    const inputTarjeta = document.getElementById("tarjeta")
  
    cerrarModalPago.addEventListener("click", () => {
      modalPago.remove()
    })
  
    cancelarPago.addEventListener("click", () => {
      modalPago.remove()
    })
  
    modalPago.addEventListener("click", (e) => {
      if (e.target === modalPago) {
        modalPago.remove()
      }
    })
  
    // validar y procesar formulario
    formularioPago.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const nombre = document.getElementById("nombre").value.trim()
      const email = document.getElementById("email").value.trim()
      const tarjeta = document.getElementById("tarjeta").value.trim()
      const direccion = document.getElementById("direccion").value.trim()
      document.querySelectorAll(".error-mensaje").forEach((error) => (error.textContent = ""))
      document
        .querySelectorAll(".campo-formulario input, .campo-formulario textarea")
        .forEach((campo) => campo.classList.remove("error"))
  
      let hayErrores = false
  
      if (nombre.length < 2) {
        document.getElementById("errorNombre").textContent = "El nombre debe tener al menos 2 caracteres"
        document.getElementById("nombre").classList.add("error")
        hayErrores = true
      }
  
      if (!validarEmail(email)) {
        document.getElementById("errorEmail").textContent = "Ingresa un email válido"
        document.getElementById("email").classList.add("error")
        hayErrores = true
      }
  
  
      if (!hayErrores) {
        procesarPago(nombre, email, tarjeta, direccion, total)
        modalPago.remove()
      }
    })
  }
  
  // funcion para procesar el pago
  function procesarPago(nombre, email, tarjeta, direccion, total) {
    const modalCarrito = document.getElementById("modalCarrito")
    modalCarrito.style.display = "none"
  
    // mostrar mensaje de éxito
    const mensajeExito = `
      <div class="modal-exito" id="modalExito">
        <div class="contenido-modal-exito">
          <div class="icono-exito">✅</div>
          <h3>¡Compra realizada con éxito!</h3>
          <div class="detalles-compra">
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Total pagado:</strong> ${total}</p>
            <p><strong>Dirección de envío:</strong> ${direccion}</p>
          </div>
          <p class="mensaje-envio">Recibirás un email de confirmación y el seguimiento de tu pedido.</p>
          <button class="boton-cerrar-exito" id="cerrarExito">Cerrar</button>
        </div>
      </div>
    `
  
    document.body.insertAdjacentHTML("beforeend", mensajeExito)
  
    vaciarCarrito()
  
    document.getElementById("cerrarExito").addEventListener("click", () => {
      document.getElementById("modalExito").remove()
    })
  }


// vaciar carrito
const vaciarCarritoBtn = document.getElementById("vaciarCarritoBtn")
if (vaciarCarritoBtn) {
  vaciarCarritoBtn.addEventListener("click", (e) => {
    e.preventDefault()
    vaciarCarrito()
  })
}

//elimina producto por id
function eliminarProductoPorId(id) {
    console.log("Intentando eliminar producto con ID:", id)
    console.log("Carrito actual:", carrito)
  
    const index = carrito.findIndex((producto) => {
      const productoId = String(producto.id)
      const targetId = String(id)
      console.log(`Comparando: "${productoId}" === "${targetId}"`)
      return productoId === targetId
    })
  
    if (index !== -1) {
      const nombreProducto = carrito[index].nombre
      carrito.splice(index, 1)
      console.log(`Producto "${nombreProducto}" eliminado correctamente del índice ${index}`)
      actualizarCarrito()
      mostrarMensaje(`${nombreProducto} eliminado del carrito`)
    } else {
      console.error("Producto no encontrado para eliminar con ID:", id)
      console.log(
        "IDs disponibles en carrito:",
        carrito.map((p) => p.id),
      )
    }
  
    console.log("Carrito después de eliminar:", carrito)
  }
  