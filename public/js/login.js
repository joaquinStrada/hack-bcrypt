(function () {
    /*-----------------------------------*/
    /* Variables */
    /*-----------------------------------*/
    const formulario = document.getElementById('formulario')
    const inputs = formulario.querySelectorAll('input[type="email"], input[type="password"]')

    const expresiones = {
	    password: /^.{8,20}$/, // 4 a 12 digitos.
	    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    }

    var campos = {
        email: false,
        password: false
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
            login()
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
            case "email":
                validarCampo(e.target, expresiones.email, 'email')
                break;
            case "password":
                validarCampo(e.target, expresiones.password, 'password')
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
    async function login() {
        const datos = new FormData(formulario)
        const email = datos.get('email')
        const password = datos.get('password')
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }

        try {
            const res = await fetch('/', options)
            const data = await res.json()

            if (data.error == true) {
                toastr.error(data.mensaje)
            } else if (data.error == false) {
                window.location.href = "/hashes"
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    }
}())