// FAQ Animated Accordion with Scroll Effects
// Converted from React to Vanilla JS

document.addEventListener('DOMContentLoaded', () => {
    const faqList = document.getElementById('faqList');
    const faqItems = document.querySelectorAll('.faq-item');
    const gradientTop = document.querySelector('.faq-gradient-top');
    const gradientBottom = document.querySelector('.faq-gradient-bottom');
    
    let selectedIndex = -1;
    let keyboardNav = false;

    // Intersection Observer para animaciones de entrada
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, observerOptions);

    // Observar cada FAQ item
    faqItems.forEach(item => observer.observe(item));

    // Manejar scroll para gradientes
    function handleScroll() {
        const scrollTop = faqList.scrollTop;
        const scrollHeight = faqList.scrollHeight;
        const clientHeight = faqList.clientHeight;

        // Gradiente superior
        const topOpacity = Math.min(scrollTop / 50, 1);
        gradientTop.style.opacity = topOpacity;

        // Gradiente inferior
        const bottomDistance = scrollHeight - (scrollTop + clientHeight);
        const bottomOpacity = scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1);
        gradientBottom.style.opacity = bottomOpacity;
    }

    faqList.addEventListener('scroll', handleScroll);
    
    // Inicializar gradientes
    handleScroll();

    // Toggle FAQ item
    function toggleFaqItem(index) {
        const item = faqItems[index];
        const isActive = item.classList.contains('active');

        // Cerrar todos los items
        faqItems.forEach(faq => faq.classList.remove('active'));

        // Si no estaba activo, abrirlo
        if (!isActive) {
            item.classList.add('active');
            selectedIndex = index;
        } else {
            selectedIndex = -1;
        }
    }

    // Click en preguntas
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            toggleFaqItem(index);
        });

        // Hover para selección visual
        item.addEventListener('mouseenter', () => {
            selectedIndex = index;
        });
    });

    // Navegación con teclado
    function handleKeyDown(e) {
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            keyboardNav = true;
            selectedIndex = Math.min(selectedIndex + 1, faqItems.length - 1);
            scrollToSelected();
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            keyboardNav = true;
            selectedIndex = Math.max(selectedIndex - 1, 0);
            scrollToSelected();
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && selectedIndex < faqItems.length) {
                e.preventDefault();
                toggleFaqItem(selectedIndex);
            }
        }
    }

    // Auto-scroll al item seleccionado
    function scrollToSelected() {
        if (!keyboardNav || selectedIndex < 0) return;

        const selectedItem = faqItems[selectedIndex];
        if (!selectedItem) return;

        const extraMargin = 50;
        const containerScrollTop = faqList.scrollTop;
        const containerHeight = faqList.clientHeight;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;

        if (itemTop < containerScrollTop + extraMargin) {
            faqList.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
        } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
            faqList.scrollTo({
                top: itemBottom - containerHeight + extraMargin,
                behavior: 'smooth'
            });
        }

        keyboardNav = false;
    }

    // Event listener para teclado
    window.addEventListener('keydown', handleKeyDown);

    // Limpiar observer al salir
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
});
