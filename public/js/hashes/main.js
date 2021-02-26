(function () {
    /*-----------------------------------*/
    /* Variables */
    /*-----------------------------------*/
    const btns_eliminar = document.querySelectorAll('.btn-danger')

    /*-----------------------------------*/
    /* Eventos */
    /*-----------------------------------*/
    btns_eliminar.forEach(btn_eliminar => {
        btn_eliminar.addEventListener('click', eliminarHash)
    })

    /*-----------------------------------*/
    /* Funciones */
    /*-----------------------------------*/
    async function eliminarHash(e) {
        const id = e.target.dataset.id
        
        const res = await fetch(`/hashes/${id}`, {
            method: 'DELETE'
        })
        const data = await res.json()
        
        if (!data.error) {
            window.location.reload()
        } else {
            console.log(data);
        }
    }
}())