/* ===================================
   CRYPTOCULTURA - JAVASCRIPT
   =================================== */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // VIDEO BACKGROUND
    // ===================================
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Forzar reproducción del video
        heroVideo.play().then(() => {
            console.log('Video reproduciendo correctamente');
        }).catch(error => {
            console.warn('Autoplay bloqueado, intentando de nuevo:', error);
            // Intentar reproducir en el primer click/touch
            document.body.addEventListener('click', function playOnInteraction() {
                heroVideo.play();
                document.body.removeEventListener('click', playOnInteraction);
            }, { once: true });
        });
        
        // Logs para debug
        heroVideo.addEventListener('loadstart', () => console.log('Video: Cargando...'));
        heroVideo.addEventListener('canplay', () => console.log('Video: Listo para reproducir'));
        heroVideo.addEventListener('playing', () => console.log('Video: Reproduciendo'));
        heroVideo.addEventListener('error', (e) => console.error('Video Error:', e));
    }
    
    // ===================================
    // NAVBAR
    // ===================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Efecto scroll en navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Toggle menú móvil
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animar el botón hamburguesa
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Cerrar menú móvil al hacer clic en un link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // ===================================
    // SMOOTH SCROLLING
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Offset para el navbar fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // CONTADOR ANIMADO (STATS)
    // ===================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                // Si el target es 24, agregar "h"
                if (target === 24) {
                    element.textContent = target + 'h';
                }
                // Si el target es 99 o 120, agregar el símbolo "+"
                else if (target === 99 || target === 120) {
                    element.textContent = target + '+';
                } else {
                    element.textContent = target;
                }
            }
        };
        
        updateCounter();
    }
    
    // Observador para activar el contador cuando sea visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
            }
        });
    }, { threshold: 0.2, rootMargin: '0px' });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Fallback: animar después de 3 segundos si no se ha activado (mobile fix)
    setTimeout(() => {
        if (!hasAnimated && statNumbers.length > 0) {
            hasAnimated = true;
            statNumbers.forEach(stat => {
                animateCounter(stat);
            });
        }
    }, 3000);
    
    // ===================================
    // ANIMACIONES AL SCROLL (AOS)
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con data-aos
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ===================================
    // FORMULARIO DE LEAD MAGNET
    // ===================================
    const leadForm = document.getElementById('leadForm');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrtAwLecXv5Z3mkr5LQ4kdG6EHKK6TqxGSFCLPnvMPhKTUNpkzEPZE-oQlLTA-WfnbrQ/exec';
    
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('leadName');
            const emailInput = document.getElementById('leadEmail');
            const submitButton = document.getElementById('submitBtn');
            const formMessage = document.getElementById('formMessage');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            
            // Validación básica
            if (!name) {
                showFormMessage('Por favor, ingresa tu nombre', 'error');
                return;
            }
            
            if (!email || !isValidEmail(email)) {
                showFormMessage('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Deshabilitar botón y mostrar loading
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            console.log('Enviando datos a Google Apps Script...');
            console.log('Datos:', { name, email });
            
            // SOLUCIÓN CORS: Usar iframe oculto para enviar el formulario
            // Crear iframe oculto si no existe
            let iframe = document.getElementById('hidden-iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'hidden-iframe';
                iframe.name = 'hidden-iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            
            // Crear formulario temporal
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = GOOGLE_SCRIPT_URL;
            tempForm.target = 'hidden-iframe';
            
            // Agregar campos
            const typeField = document.createElement('input');
            typeField.type = 'hidden';
            typeField.name = 'type';
            typeField.value = 'lead_magnet';
            tempForm.appendChild(typeField);
            
            const nameField = document.createElement('input');
            nameField.type = 'hidden';
            nameField.name = 'name';
            nameField.value = name;
            tempForm.appendChild(nameField);
            
            const emailField = document.createElement('input');
            emailField.type = 'hidden';
            emailField.name = 'email';
            emailField.value = email;
            tempForm.appendChild(emailField);
            
            // Agregar al body y enviar
            document.body.appendChild(tempForm);
            tempForm.submit();
            
            console.log('Formulario enviado via iframe (bypass CORS)');
            
            // Esperar 3 segundos y asumir éxito
            setTimeout(() => {
                console.log('Asumiendo envio exitoso...');
                
                // Limpiar formulario
                nameInput.value = '';
                emailInput.value = '';
                
                // Restaurar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                
                // Mostrar modal Thank You
                showThankYouModal();
                
                // Limpiar formulario temporal
                document.body.removeChild(tempForm);
                
                console.log('Proceso completado. Verifica tu email y el Google Sheet.');
            }, 3000);
        });
    }
    
    // Función para mostrar mensajes en el formulario
    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        formMessage.style.display = 'block';
        formMessage.className = `form-message form-message-${type}`;
        formMessage.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        if (type === 'error') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Función auxiliar para validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Función para mostrar mensajes
    function showMessage(message, type) {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Estilos del mensaje
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remover después de 4 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 4000);
    }
    
    // ===================================
    // SCROLL TO TOP BUTTON
    // ===================================
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===================================
    // LAZY LOADING DE IMÁGENES
    // ===================================
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ===================================
    // ANIMACIÓN DEL LOGO EN HERO
    // ===================================
    const logo = document.querySelector('.nav-brand .logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // ===================================
    // EFECTO PARALLAX EN HERO
    // ===================================
    const heroDecorations = document.querySelectorAll('.decoration-circle');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        
        heroDecorations.forEach((circle, index) => {
            const speed = (index + 1) * 0.1;
            circle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ===================================
    // TRACKING DE CLICS EN BOTONES CTA
    // ===================================
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-accent');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('CTA clickeado:', buttonText);
            
            // Aquí podrías enviar eventos a Google Analytics
            // gtag('event', 'cta_click', { button_text: buttonText });
        });
    });
    
    // ===================================
    // EFECTO HOVER EN CARDS
    // ===================================
    const cards = document.querySelectorAll('.feature-card, .package-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // ===================================
    // ANIMACIÓN DE ENTRADA INICIAL
    // ===================================
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // ===================================
    // PRELOADER (opcional)
    // ===================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // ===================================
    // DETECCIÓN DE DISPOSITIVO
    // ===================================
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Ajustar comportamientos según dispositivo
    if (isMobile()) {
        // Deshabilitar parallax en móviles para mejor performance
        heroDecorations.forEach(circle => {
            circle.style.transform = 'none';
        });
    }
    
    // ===================================
    // RESIZE HANDLER
    // ===================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Cerrar menú móvil si se redimensiona a desktop
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }, 250);
    });
    
    // ===================================
    // CONSOLE MESSAGE
    // ===================================
    console.log('%cCRYPTOCULTURA', 'color: #1976D2; font-size: 24px; font-weight: bold;');
    console.log('%cEducacion Crypto Sin Humo', 'color: #7C4DFF; font-size: 14px;');
    console.log('Sitio desarrollado con ❤️ para empoderar a la comunidad crypto latina');
    
    // ===================================
    // DECRYPTED TEXT EFFECT
    // ===================================
    class DecryptedText {
        constructor(element, options = {}) {
            this.element = element;
            this.originalText = element.getAttribute('data-text') || element.textContent;
            this.options = {
                speed: options.speed || 50,
                maxIterations: options.maxIterations || 10,
                sequential: options.sequential !== undefined ? options.sequential : false,
                revealDirection: options.revealDirection || 'start',
                useOriginalCharsOnly: options.useOriginalCharsOnly !== undefined ? options.useOriginalCharsOnly : false,
                characters: options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+0123456789',
                animateOn: options.animateOn || 'view'
            };
            
            this.isScrambling = false;
            this.revealedIndices = new Set();
            this.currentIteration = 0;
            this.interval = null;
            this.hasAnimated = false;
            
            this.init();
        }
        
        init() {
            // Convertir el texto a caracteres individuales con spans
            this.wrapCharacters();
            
            // Setup event listeners según animateOn
            if (this.options.animateOn === 'hover' || this.options.animateOn === 'both') {
                this.element.addEventListener('mouseenter', () => this.startScramble());
                this.element.addEventListener('mouseleave', () => this.stopScramble());
            }
            
            if (this.options.animateOn === 'view' || this.options.animateOn === 'both') {
                this.setupIntersectionObserver();
            }
        }
        
        wrapCharacters() {
            const chars = this.originalText.split('');
            this.element.innerHTML = '';
            
            chars.forEach((char, index) => {
                const span = document.createElement('span');
                span.className = 'char revealed';
                span.textContent = char;
                span.setAttribute('data-index', index);
                this.element.appendChild(span);
            });
            
            this.chars = this.element.querySelectorAll('.char');
        }
        
        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.startScramble();
                        this.hasAnimated = true;
                    }
                });
            }, {
                threshold: 0.1
            });
            
            observer.observe(this.element);
        }
        
        startScramble() {
            if (this.isScrambling) return;
            
            this.isScrambling = true;
            this.revealedIndices.clear();
            this.currentIteration = 0;
            this.element.classList.add('scrambling');
            
            this.interval = setInterval(() => {
                if (this.options.sequential) {
                    this.scrambleSequential();
                } else {
                    this.scrambleAll();
                }
            }, this.options.speed);
        }
        
        stopScramble() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            
            this.isScrambling = false;
            this.revealedIndices.clear();
            this.element.classList.remove('scrambling');
            
            // Restaurar texto original
            this.chars.forEach((char, index) => {
                char.textContent = this.originalText[index];
                char.classList.remove('encrypted');
                char.classList.add('revealed');
            });
        }
        
        scrambleAll() {
            this.chars.forEach((char, index) => {
                if (this.originalText[index] !== ' ') {
                    char.textContent = this.getRandomChar();
                    char.classList.add('encrypted');
                    char.classList.remove('revealed');
                }
            });
            
            this.currentIteration++;
            
            if (this.currentIteration >= this.options.maxIterations) {
                this.stopScramble();
            }
        }
        
        scrambleSequential() {
            // Scramble unrevealed characters
            this.chars.forEach((char, index) => {
                if (!this.revealedIndices.has(index) && this.originalText[index] !== ' ') {
                    char.textContent = this.getRandomChar();
                    char.classList.add('encrypted');
                    char.classList.remove('revealed');
                }
            });
            
            // Reveal next character
            if (this.revealedIndices.size < this.originalText.length) {
                const nextIndex = this.getNextIndex();
                this.revealedIndices.add(nextIndex);
                
                const char = this.chars[nextIndex];
                char.textContent = this.originalText[nextIndex];
                char.classList.remove('encrypted');
                char.classList.add('revealed');
            } else {
                this.stopScramble();
            }
        }
        
        getNextIndex() {
            const textLength = this.originalText.length;
            
            switch (this.options.revealDirection) {
                case 'start':
                    return this.revealedIndices.size;
                    
                case 'end':
                    return textLength - 1 - this.revealedIndices.size;
                    
                case 'center':
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(this.revealedIndices.size / 2);
                    const nextIndex = this.revealedIndices.size % 2 === 0 
                        ? middle + offset 
                        : middle - offset - 1;
                    
                    if (nextIndex >= 0 && nextIndex < textLength && !this.revealedIndices.has(nextIndex)) {
                        return nextIndex;
                    }
                    
                    // Fallback: find first unrevealed
                    for (let i = 0; i < textLength; i++) {
                        if (!this.revealedIndices.has(i)) return i;
                    }
                    return 0;
                    
                default:
                    return this.revealedIndices.size;
            }
        }
        
        getRandomChar() {
            if (this.options.useOriginalCharsOnly) {
                const uniqueChars = Array.from(new Set(this.originalText.split('')))
                    .filter(char => char !== ' ');
                return uniqueChars[Math.floor(Math.random() * uniqueChars.length)];
            } else {
                const chars = this.options.characters;
                return chars[Math.floor(Math.random() * chars.length)];
            }
        }
    }
    
    // Initialize decrypted text effect on CRYPTOCULTURA
    const decryptedElements = document.querySelectorAll('.decrypted-text');
    decryptedElements.forEach(element => {
        new DecryptedText(element, {
            speed: 80,
            maxIterations: 20,
            sequential: true,
            revealDirection: 'start',
            useOriginalCharsOnly: false,
            animateOn: 'view'
        });
    });
    
    // ===================================
    // TRUE FOCUS ANIMATION - BLACK FRIDAY
    // ===================================
    class TrueFocus {
        constructor(containerId, options = {}) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            
            this.words = Array.from(this.container.querySelectorAll('.focus-word'));
            this.frame = this.container.closest('.black-friday-banner').querySelector('.focus-frame');
            this.currentIndex = 0;
            this.options = {
                animationDuration: options.animationDuration || 0.5,
                pauseBetweenAnimations: options.pauseBetweenAnimations || 1.5,
                blurAmount: options.blurAmount || 5
            };
            
            this.init();
        }
        
        init() {
            // Start animation loop
            this.animate();
            setInterval(() => {
                this.animate();
            }, (this.options.animationDuration + this.options.pauseBetweenAnimations) * 1000);
        }
        
        animate() {
            // Blur all words
            this.words.forEach(word => {
                word.classList.add('blurred');
                word.style.filter = `blur(${this.options.blurAmount}px)`;
            });
            
            // Focus on current word
            const currentWord = this.words[this.currentIndex];
            currentWord.classList.remove('blurred');
            currentWord.style.filter = 'blur(0px)';
            
            // Position frame around current word
            this.positionFrame(currentWord);
            
            // Move to next word
            this.currentIndex = (this.currentIndex + 1) % this.words.length;
        }
        
        positionFrame(word) {
            const containerRect = this.container.getBoundingClientRect();
            const wordRect = word.getBoundingClientRect();
            const bannerRect = this.container.closest('.black-friday-banner').getBoundingClientRect();
            
            const x = wordRect.left - bannerRect.left;
            const y = wordRect.top - bannerRect.top;
            const width = wordRect.width;
            const height = wordRect.height;
            
            this.frame.style.left = `${x}px`;
            this.frame.style.top = `${y}px`;
            this.frame.style.width = `${width}px`;
            this.frame.style.height = `${height}px`;
            this.frame.classList.add('active');
        }
    }
    
    // Initialize True Focus animation on Black Friday banner
    const blackFridayAnimation = new TrueFocus('blackFridayText', {
        animationDuration: 0.5,
        pauseBetweenAnimations: 1.5,
        blurAmount: 5
    });
    
    // ===================================
    // THANK YOU MODAL
    // ===================================
    const thankYouModal = document.getElementById('thankYouModal');
    const modalClose = document.getElementById('modalClose');
    const modalCtaBtn = document.getElementById('modalCtaBtn');
    
    // Función para mostrar el modal
    window.showThankYouModal = function() {
        thankYouModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    };
    
    // Función para cerrar el modal
    function closeThankYouModal() {
        thankYouModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
    
    // Cerrar con botón X
    if (modalClose) {
        modalClose.addEventListener('click', closeThankYouModal);
    }
    
    // Cerrar al hacer click fuera del modal
    if (thankYouModal) {
        thankYouModal.addEventListener('click', function(e) {
            if (e.target === thankYouModal) {
                closeThankYouModal();
            }
        });
    }
    
    // CTA del modal - cerrar al hacer click
    if (modalCtaBtn) {
        modalCtaBtn.addEventListener('click', function() {
            closeThankYouModal();
        });
    }
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && thankYouModal.classList.contains('active')) {
            closeThankYouModal();
        }
    });
    
    // ===================================
    // FORMULARIO DE WATCHLIST
    // ===================================
    const watchlistForm = document.getElementById('watchlistForm');
    
    if (watchlistForm) {
        watchlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('watchlistName');
            const emailInput = document.getElementById('watchlistEmail');
            const submitButton = document.getElementById('watchlistSubmitBtn');
            const formMessage = document.getElementById('watchlistFormMessage');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            
            // Validación básica
            if (!name) {
                showWatchlistMessage('Por favor, ingresa tu nombre', 'error');
                return;
            }
            
            if (!email || !isValidEmail(email)) {
                showWatchlistMessage('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Deshabilitar botón y mostrar loading
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            console.log('Enviando datos del Watchlist...');
            console.log('Datos:', { name, email, type: 'watchlist' });
            
            // Crear iframe oculto si no existe
            let iframe = document.getElementById('hidden-iframe-watchlist');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'hidden-iframe-watchlist';
                iframe.name = 'hidden-iframe-watchlist';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            
            // Crear formulario temporal
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = GOOGLE_SCRIPT_URL;
            tempForm.target = 'hidden-iframe-watchlist';
            
            // Agregar campos
            const typeField = document.createElement('input');
            typeField.type = 'hidden';
            typeField.name = 'type';
            typeField.value = 'watchlist';
            tempForm.appendChild(typeField);
            
            const nameField = document.createElement('input');
            nameField.type = 'hidden';
            nameField.name = 'name';
            nameField.value = name;
            tempForm.appendChild(nameField);
            
            const emailField = document.createElement('input');
            emailField.type = 'hidden';
            emailField.name = 'email';
            emailField.value = email;
            tempForm.appendChild(emailField);
            
            // Agregar al body y enviar
            document.body.appendChild(tempForm);
            tempForm.submit();
            
            console.log('Formulario Watchlist enviado via iframe');
            
            // Esperar 3 segundos y asumir éxito
            setTimeout(() => {
                console.log('Asumiendo envio exitoso del Watchlist...');
                
                // Limpiar formulario
                nameInput.value = '';
                emailInput.value = '';
                
                // Restaurar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                
                // Mostrar mensaje de éxito
                showWatchlistMessage('¡Listo! Revisa tu email para acceder al Watchlist.', 'success');
                
                // Limpiar formulario temporal
                document.body.removeChild(tempForm);
                
                console.log('Proceso completado. Verifica tu email.');
            }, 3000);
        });
    }
    
    // Función para mostrar mensajes en el formulario Watchlist
    function showWatchlistMessage(message, type) {
        const formMessage = document.getElementById('watchlistFormMessage');
        formMessage.style.display = 'block';
        formMessage.style.padding = '1rem';
        formMessage.style.borderRadius = '8px';
        formMessage.style.marginTop = '1rem';
        formMessage.style.background = type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
        formMessage.style.color = type === 'success' ? '#10b981' : '#ef4444';
        formMessage.style.border = `2px solid ${type === 'success' ? '#10b981' : '#ef4444'}`;
        formMessage.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        if (type === 'error') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
});

// ===================================
// ANIMACIONES CSS PARA MENSAJES
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
