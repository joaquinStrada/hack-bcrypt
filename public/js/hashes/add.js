(function () {
    /*-----------------------------------*/
    /* Variables */
    /*-----------------------------------*/
    const formulario = document.getElementById('formulario')
    const inputs = formulario.querySelectorAll('input, textarea')
    
    const expresiones = {
        nombre: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,
        descripcion: /^.{4,200}$/,
        password: /^.{8,20}$/,
        salt: /^\d{1,3}$/
    }
    var campos = {
        nombre: false,
        descripcion: false,
        password: false,
        salt: false
    }

    /*-----------------------------------*/
    /* Eventos */
    /*-----------------------------------*/
    inputs.forEach(input => {
        input.addEventListener('keyup', validarInput)
        input.addEventListener('blur', validarInput)
    })
    formulario.addEventListener('submit', (e) => {
        e.preventDefault()

        if (validarFormulario()) {
            add()
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
            case "descripcion":
                validarCampo(e.target, expresiones.descripcion, 'descripcion')
                break;
            case "password":
                validarCampo(e.target, expresiones.password, 'password')
                break;
            case "salt":
                validarCampo(e.target, expresiones.salt, 'salt')
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
    async function add() {
        const datos = new FormData(formulario)

        const campos = {
            nombre: datos.get('nombre'),
            descripcion: datos.get('descripcion'),
            password: datos.get('password'),
            salt: datos.get('salt'),
        }

        try {
            const res = await fetch('/hashes/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(campos)
            })
            const data = await res.json()
            
            if (!data.error) {
                window.location.href = "/hashes"
            } else {
                console.error(data)
            }
        } catch (err) {
            console.error(err)
        }
    }
}())