document.addEventListener('DOMContentLoaded', function() {
    const pages = Array.from(document.querySelectorAll('.page'));
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pagesContainer = document.getElementById('pages-container');
    
    let currentPageIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Mostrar página actual
    function showPage(index) {
        pages.forEach((page, i) => {
            if (i === index) {
                page.classList.add('active');
                page.classList.remove('hidden');
            } else {
                if (Math.abs(i - index) > 1) {
                    page.classList.add('hidden');
                }
                page.classList.remove('active');
                page.style.transform = 'translate(-50%, -50%)';
            }
        });
        
        // Actualizar botones de navegación
        prevButton.style.display = index === 0 ? 'none' : 'flex';
        nextButton.style.display = index === pages.length - 1 ? 'none' : 'flex';
    }

    // Animación para pasar página siguiente
    function flipNext() {
        if (isAnimating || currentPageIndex >= pages.length - 1) return;
        
        isAnimating = true;
        const currentPage = pages[currentPageIndex];
        const nextPage = pages[currentPageIndex + 1];
        
        // Preparar animación
        currentPage.classList.add('animating');
        nextPage.classList.remove('hidden');
        nextPage.classList.add('active');
        
        // Aplicar transformaciones
        currentPage.style.transform = 'translate(-50%, -50%) rotateY(-180deg)';
        nextPage.style.transform = 'translate(-50%, -50%) rotateY(0deg)';
        
        // Al completar la animación
        setTimeout(() => {
            currentPage.classList.remove('animating', 'active');
            currentPage.classList.add('hidden');
            currentPage.style.transform = 'translate(-50%, -50%)';
            currentPageIndex++;
            isAnimating = false;
        }, 800);
    }

    // Animación para pasar página anterior
    function flipPrev() {
        if (isAnimating || currentPageIndex <= 0) return;
        
        isAnimating = true;
        const currentPage = pages[currentPageIndex];
        const prevPage = pages[currentPageIndex - 1];
        
        // Preparar animación
        prevPage.classList.remove('hidden');
        prevPage.classList.add('animating', 'active');
        
        // Aplicar transformaciones
        prevPage.style.transform = 'translate(-50%, -50%) rotateY(0deg)';
        currentPage.style.transform = 'translate(-50%, -50%) rotateY(180deg)';
        
        // Al completar la animación
        setTimeout(() => {
            currentPage.classList.remove('active');
            prevPage.classList.remove('animating');
            currentPageIndex--;
            isAnimating = false;
        }, 800);
    }

    // Event listeners para botones
    prevButton.addEventListener('click', flipPrev);
    nextButton.addEventListener('click', flipNext);

    // Gestión de toques
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        if (isAnimating) return;
        
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                flipPrev();
            } else {
                flipNext();
            }
        }
    }

    // Añadir detector de deslizamiento
    pagesContainer.addEventListener('touchstart', handleTouchStart);
    pagesContainer.addEventListener('touchend', handleTouchEnd);

    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            flipNext();
        } else if (e.key === 'ArrowLeft') {
            flipPrev();
        }
    });

    // Inicializar
    showPage(0);
});