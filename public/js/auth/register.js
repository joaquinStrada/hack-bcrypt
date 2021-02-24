(function () {
    /*-----------------------------------*/
    /* Variables */
    /*-----------------------------------*/
    const formulario = document.getElementById('formulario')
    const inputs = formulario.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]')
    const inputFile = document.getElementById('imagen')

    const expresiones = {
	    nombre: /^[a-zA-ZÀ-ÿ\s]{4,40}$/, // Letras y espacios, pueden llevar acentos.
	    password: /^.{8,20}$/, // 4 a 12 digitos.
	    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    }

    var campos = {
        nombre: false,
        email: false,
        password: false,
        Rpassword: false,
        Imagen: true
    }

    /*-----------------------------------*/
    /* Eventos */
    /*-----------------------------------*/
    inputs.forEach(input => {
        input.addEventListener('keyup', validarInput)
        input.addEventListener('blur', validarInput)
    })
    inputFile.addEventListener('change', () => {
        const padre = inputFile.parentNode
        const alert = padre.querySelector('.form-text')

        const file = inputFile.files[0]
        let { type } = file
        type = type.split('/')[0]
        
        if (type != "image" && alert.classList.contains('d-none')) {
            alert.classList.remove('d-none')
            campos.Imagen = false 
        } else if (type == "image" && !alert.classList.contains('d-none')) {
            alert.classList.add('d-none')
            campos.Imagen = true 
        }
    })
    formulario.addEventListener('submit', (e) => {
        e.preventDefault()
        if (validarFormulario()) {
            registrarUsuario()
        }
    })
    window.addEventListener('load', () => {
        formulario.reset()
    })

    /*-----------------------------------*/
    /* Funciones */
    /*-----------------------------------*/
    function validarInput(e) {
        switch (e.target.name) {
            case "nombre":
                validarCampo(e.target, expresiones.nombre, 'nombre')
                break;
            case "email":
                validarCampo(e.target, expresiones.email, 'email')
                break;
            case "password":
                validarCampo(e.target, expresiones.password, 'password')
                validarPassword()
                break;
            case "rpassword":
                validarPassword()
                break;
        }
    }
    function validarCampo(input, expresion, campo) {
        const padre = input.parentNode
        const alert = padre.querySelector('.form-text')

        if (expresion.test(input.value) && !alert.classList.contains('d-none')) {
            alert.classList.add('d-none')
            campos[campo] = true
        } else if (!expresion.test(input.value) && alert.classList.contains('d-none')) {
            alert.classList.remove('d-none')
            campos[campo] = false
        }
    }
    function validarPassword() {
        var inputPass = formulario.querySelector('input#password')
        var inputRPass = formulario.querySelector('input#rpassword')
        
        const padre = inputRPass.parentNode
        const alert = padre.querySelector('.form-text')

        if (inputPass.value == inputRPass.value && !alert.classList.contains('d-none')) {
            alert.classList.add('d-none')
            campos.Rpassword = true
        } else if (inputPass.value != inputRPass.value && alert.classList.contains('d-none')) {
            alert.classList.remove('d-none')
            campos.Rpassword = false
        }
    }
    function validarFormulario() {
        const camposError = []

        for (const propiedad in campos) {
            if (campos[propiedad] == false) {
                camposError.push(propiedad)
            }
        }
        
        if (camposError.length > 0) {
            mostrarError(camposError)
            return false
        } else {
            return true
        }
    }
    function mostrarError(campos) {
        for (let campo of campos) {
            campo = campo.toLowerCase()
            campo = formulario.querySelector(`#${campo}`)
            
            var padre = campo.parentNode
            const alert = padre.querySelector('.form-text')
            
            if (alert.classList.contains('d-none')) {
                alert.classList.remove('d-none')
            }
        }
    }
    async function registrarUsuario() {
      const datos = new FormData(formulario)
      const nombre = datos.get('nombre');
      const email = datos.get('email');
      const password = datos.get('password');
      const file = datos.get('imagen');

      try {

          const imagen = await getBase64(file)
    
          if (imagen.error == false) {
              
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    password,
                    imagen: imagen.imagen
                })
            }

            const res = await fetch('/register', options)
            const data = await res.json()
            
            if (data.error == false) {
                toastr.success(data.mensaje)
                setTimeout(() => {
                    window.location.href = "/"
                }, 3000)
            } else if (data.error == true) {
                toastr.error(data.mensaje)
            } else {
                console.log(data);
            }

          } else {
              console.log(imagen);
          }
      } catch (err) {
          console.log(err);
      }
    }
    function getBase64(file) {
        return new Promise((resolve, reject) => {
          if (typeof file != 'undefined' && file != 0) {
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
              resolve({
                error: false,
                imagen: reader.result
              })
            }
            reader.onerror = (err) => {
              resolve({
                error: true,
                mensaje: err
              })
            }
          } else {
            resolve({
              error: false,
              imagen: ''
            })
          }
        })
      }
}())