// --- 1. Lógica del Menú Móvil ---
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks)
{
    menuToggle.addEventListener('click', () =>
    {
        navLinks.classList.toggle('active');
    });
}

// --- 2. Animaciones al hacer Scroll ---
// --- 2. Animaciones al hacer Scroll ---
const observerOptions = 
{
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) =>
{
    let animacionEjecutada = false;

    entries.forEach(entry =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            animacionEjecutada = true;
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () =>
{
    const elementosAnimables = document.querySelectorAll('.section-reveal, .card-reveal');
    
    // Seleccionamos los contenedores por separado en lugar de todas las tarjetas juntas
    const gruposDeTarjetas = document.querySelectorAll('.carrusel-track, .contenedor-tarjetas, .contenedor-top3, .grid-galeria, .grid-categorias');
    
    // Recorremos cada contenedor para reiniciar el index a 0 por cada sección
    gruposDeTarjetas.forEach(grupo =>
    {
        const tarjetas = grupo.querySelectorAll('.card-reveal');
        
        tarjetas.forEach((tarjeta, index) =>
        {
            tarjeta.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    elementosAnimables.forEach(el => 
    {
        observer.observe(el);
    });
});

// --- 3. Lógica del Carrusel Principal ---
const track = document.getElementById('track');

function moverCarrusel(direccion)
{
    if (track)
    {
        const desplazamiento = track.clientWidth + 20; 
        track.scrollBy(
        { 
            left: desplazamiento * direccion, 
            behavior: 'smooth' 
        });
    }
}

// --- 4. Lógica de la Galería (Lightbox Interactivo) ---
const modalGaleria = document.getElementById('modal-galeria');
const imgModal = document.getElementById('img-modal');
let indiceGaleriaActual = 0;
let listaImagenesGaleria = [];

function abrirModal(src)
{
    if (!modalGaleria) return;

    // Recopilamos todas las imágenes de la galería en la página actual
    listaImagenesGaleria = Array.from(document.querySelectorAll('.grid-galeria img'));
    
    let indiceEncontrado = -1;
    let i = 0;
    let buscando = true; // Usamos bandera en lugar de break
    
    while (i < listaImagenesGaleria.length && buscando)
    {
        if (listaImagenesGaleria[i].src === src)
        {
            indiceEncontrado = i;
            buscando = false; 
        }
        i++;
    }
    
    indiceGaleriaActual = indiceEncontrado !== -1 ? indiceEncontrado : 0;
    actualizarImagenGaleria();

    modalGaleria.style.display = "flex";
    setTimeout(() =>
    {
        modalGaleria.classList.add('show');
    }, 10);
    
    document.body.style.overflow = "hidden";
}

function navegarGaleria(direccion)
{
    indiceGaleriaActual += direccion;
    
    // Si nos pasamos de los límites, damos la vuelta (carrusel infinito)
    if (indiceGaleriaActual < 0)
    {
        indiceGaleriaActual = listaImagenesGaleria.length - 1;
    }
    else if (indiceGaleriaActual >= listaImagenesGaleria.length)
    {
        indiceGaleriaActual = 0;
    }
    
    actualizarImagenGaleria();
}

function actualizarImagenGaleria()
{
    if(listaImagenesGaleria.length > 0 && imgModal)
    {
        imgModal.src = listaImagenesGaleria[indiceGaleriaActual].src;
    }
}

function cerrarModal()
{
    if (modalGaleria)
    {
        modalGaleria.classList.remove('show');
        setTimeout(() =>
        {
            modalGaleria.style.display = "none";
            document.body.style.overflow = "auto";
        }, 300);
    }
}

if (modalGaleria)
{
    modalGaleria.onclick = function(e)
    {
        // Solo cerramos si tocamos el fondo, no los botones ni la imagen
        if (e.target === modalGaleria || e.target.classList.contains('cerrar'))
        {
            cerrarModal();
        }
    }
}

// --- 5. Lógica del Modal de Reseñas (Con Navegación) ---
const modalResena = document.getElementById('modal-resena');
let indiceResenaActual = 0;
let listaTarjetasResena = [];

function abrirResena(tarjeta)
{
    if (!modalResena) return; 

    // Guardamos todas las tarjetas clickeables de la página
    listaTarjetasResena = Array.from(document.querySelectorAll('[onclick="abrirResena(this)"]'));
    
    let indiceEncontrado = -1;
    let i = 0;
    let buscando = true; // Usamos bandera en lugar de break
    
    while (i < listaTarjetasResena.length && buscando)
    {
        if (listaTarjetasResena[i] === tarjeta)
        {
            indiceEncontrado = i;
            buscando = false; 
        }
        i++;
    }
    
    indiceResenaActual = indiceEncontrado !== -1 ? indiceEncontrado : 0;
    
    cargarDatosResena(listaTarjetasResena[indiceResenaActual]);

    modalResena.style.display = "flex";
    setTimeout(() =>
    {
        modalResena.classList.add('show');
    }, 10);
    
    document.body.style.overflow = "hidden"; 
}

function navegarResena(direccion)
{
    indiceResenaActual += direccion;
    
    // Si nos pasamos de los límites, damos la vuelta
    if (indiceResenaActual < 0)
    {
        indiceResenaActual = listaTarjetasResena.length - 1;
    }
    else if (indiceResenaActual >= listaTarjetasResena.length)
    {
        indiceResenaActual = 0;
    }
    
    cargarDatosResena(listaTarjetasResena[indiceResenaActual]);
}

function cargarDatosResena(tarjetaElement)
{
    if (!tarjetaElement) return;

    // Validación segura para evitar errores si algún elemento no existe en la tarjeta
    const h3Element = tarjetaElement.querySelector('h3');
    const badgeElement = tarjetaElement.querySelector('.badge');
    const calificacionElement = tarjetaElement.querySelector('.calificacion');
    const textoElement = tarjetaElement.querySelector('.resena-completa-texto');
    const imgElement = tarjetaElement.querySelector('.portada-oculta');

    const titulo = h3Element ? h3Element.textContent : '';
    const categoria = badgeElement ? badgeElement.textContent : '';
    const calificacion = calificacionElement ? calificacionElement.textContent : '';
    const reseñaCompleta = textoElement ? textoElement.innerHTML : '';
    const imgSrc = imgElement ? imgElement.src : '';

    // Inyectamos la información en el modal
    document.getElementById('mr-titulo').textContent = titulo;
    document.getElementById('mr-badge').textContent = categoria;
    document.getElementById('mr-calificacion').textContent = calificacion;
    document.getElementById('mr-texto').innerHTML = reseñaCompleta;
    document.getElementById('mr-img').src = imgSrc;
}

function cerrarResenaModal()
{
    if (!modalResena) return;

    modalResena.classList.remove('show');
    setTimeout(() =>
    {
        modalResena.style.display = "none";
        document.body.style.overflow = "auto";
    }, 300);
}

if (modalResena)
{
    modalResena.addEventListener('click', function(e)
    {
        // Solo cerramos si se hace click en el fondo oscuro o en la X, evitamos los botones
        let clickEnFondo = (e.target === modalResena);
        let clickEnCerrar = e.target.classList.contains('cerrar');
        
        if (clickEnFondo || clickEnCerrar)
        {
            cerrarResenaModal();
        }
    });
}

// --- 6. Navegación con Teclado (Flechas y Escape) ---
document.addEventListener('keydown', function(event)
{
    // Verificamos si el modal de la galería está en pantalla
    const modalGaleria = document.getElementById('modal-galeria');
    const galeriaAbierta = modalGaleria && modalGaleria.classList.contains('show');

    // Verificamos si el modal de reseñas está en pantalla
    const modalResena = document.getElementById('modal-resena');
    const resenaAbierta = modalResena && modalResena.classList.contains('show');

    // Si la galería está abierta
    if (galeriaAbierta)
    {
        if (event.key === 'ArrowLeft')
        {
            navegarGaleria(-1);
        }
        else if (event.key === 'ArrowRight')
        {
            navegarGaleria(1);
        }
        else if (event.key === 'Escape')
        {
            cerrarModal();
        }
    }
    // Si la reseña está abierta
    else if (resenaAbierta)
    {
        if (event.key === 'ArrowLeft')
        {
            navegarResena(-1);
        }
        else if (event.key === 'ArrowRight')
        {
            navegarResena(1);
        }
        else if (event.key === 'Escape')
        {
            cerrarResenaModal();
        }
    }
});