/**
 * MagicButton - Sistema de animaciones avanzadas para botones
 * Adaptado de MagicBento a Vanilla JavaScript
 * 
 * Características:
 * - Partículas animadas al hover
 * - Efecto tilt 3D
 * - Magnetismo (botón sigue al cursor)
 * - Efecto ripple al click
 * - Glow spotlight
 */

const MAGIC_CONFIG = {
    particleCount: 8,
    glowColor: '0, 229, 255', // Cyan de CRYPTOCULTURA
    spotlightRadius: 200,
    tiltIntensity: 8,
    magnetIntensity: 0.08,
    animationDuration: 300,
    particleSize: 3
};

class MagicButton {
    constructor(element, config = {}) {
        this.element = element;
        this.config = { ...MAGIC_CONFIG, ...config };
        
        this.particles = [];
        this.timeouts = [];
        this.isHovered = false;
        this.animationFrames = [];
        
        this.init();
    }
    
    init() {
        // Preparar el botón
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        this.element.style.transform = 'perspective(1000px)';
        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Añadir variables CSS
        this.element.style.setProperty('--glow-color', this.config.glowColor);
        this.element.style.setProperty('--glow-x', '50%');
        this.element.style.setProperty('--glow-y', '50%');
        this.element.style.setProperty('--glow-intensity', '0');
        
        // Event listeners
        this.element.addEventListener('mouseenter', () => this.handleMouseEnter());
        this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.element.addEventListener('click', (e) => this.handleClick(e));
        
        // Añadir clase para estilos
        this.element.classList.add('magic-button');
    }
    
    handleMouseEnter() {
        this.isHovered = true;
        this.spawnParticles();
        
        // Efecto de elevación
        this.element.style.transform = 'perspective(1000px) translateZ(10px) scale(1.02)';
        this.element.style.setProperty('--glow-intensity', '1');
    }
    
    handleMouseLeave() {
        this.isHovered = false;
        this.clearParticles();
        
        // Reset transforms
        this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0) translateY(0) translateZ(0) scale(1)';
        this.element.style.setProperty('--glow-intensity', '0');
    }
    
    handleMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Actualizar posición del glow
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        this.element.style.setProperty('--glow-x', `${relativeX}%`);
        this.element.style.setProperty('--glow-y', `${relativeY}%`);
        
        // Efecto tilt 3D
        const rotateX = ((y - centerY) / centerY) * -this.config.tiltIntensity;
        const rotateY = ((x - centerX) / centerX) * this.config.tiltIntensity;
        
        // Efecto magnetismo
        const magnetX = (x - centerX) * this.config.magnetIntensity;
        const magnetY = (y - centerY) * this.config.magnetIntensity;
        
        this.element.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateX(${magnetX}px) 
            translateY(${magnetY}px) 
            translateZ(10px)
            scale(1.02)
        `;
    }
    
    handleClick(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calcular distancia máxima para el ripple
        const maxDistance = Math.max(
            Math.hypot(x, y),
            Math.hypot(x - rect.width, y),
            Math.hypot(x, y - rect.height),
            Math.hypot(x - rect.width, y - rect.height)
        );
        
        // Crear elemento ripple
        const ripple = document.createElement('div');
        ripple.className = 'magic-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: ${maxDistance * 2}px;
            height: ${maxDistance * 2}px;
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(${this.config.glowColor}, 0.6) 0%, 
                rgba(${this.config.glowColor}, 0.3) 30%, 
                transparent 70%
            );
            left: ${x - maxDistance}px;
            top: ${y - maxDistance}px;
            pointer-events: none;
            z-index: 1000;
            transform: scale(0);
            opacity: 1;
        `;
        
        this.element.appendChild(ripple);
        
        // Animar ripple
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => ripple.remove();
        
        // Efecto de "punch"
        this.element.animate([
            { transform: this.element.style.transform },
            { transform: this.element.style.transform + ' scale(0.95)' },
            { transform: this.element.style.transform + ' scale(1.02)' }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        });
    }
    
    spawnParticles() {
        const rect = this.element.getBoundingClientRect();
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const timeout = setTimeout(() => {
                if (!this.isHovered) return;
                
                const particle = this.createParticle(rect.width, rect.height);
                this.element.appendChild(particle);
                this.particles.push(particle);
                this.animateParticle(particle);
                
            }, i * 100); // Stagger el spawn
            
            this.timeouts.push(timeout);
        }
    }
    
    createParticle(width, height) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        particle.style.cssText = `
            position: absolute;
            width: ${this.config.particleSize}px;
            height: ${this.config.particleSize}px;
            border-radius: 50%;
            background: rgba(${this.config.glowColor}, 1);
            box-shadow: 
                0 0 6px rgba(${this.config.glowColor}, 0.8),
                0 0 12px rgba(${this.config.glowColor}, 0.4);
            pointer-events: none;
            z-index: 100;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            opacity: 0;
        `;
        
        return particle;
    }
    
    animateParticle(particle) {
        // Animación de entrada
        particle.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            fill: 'forwards'
        });
        
        // Movimiento flotante
        const moveAnimation = particle.animate([
            { 
                transform: `translate(0, 0) rotate(0deg) scale(1)`,
                opacity: 1
            },
            { 
                transform: `translate(${(Math.random() - 0.5) * 60}px, ${(Math.random() - 0.5) * 60}px) rotate(${Math.random() * 360}deg) scale(1)`,
                opacity: 0.5
            },
            { 
                transform: `translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 80}px) rotate(${Math.random() * 720}deg) scale(1)`,
                opacity: 1
            }
        ], {
            duration: 3000 + Math.random() * 2000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        // Pulsación de opacidad
        const pulseAnimation = particle.animate([
            { opacity: 0.3 },
            { opacity: 1 },
            { opacity: 0.3 }
        ], {
            duration: 1500,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        this.animationFrames.push(moveAnimation, pulseAnimation);
    }
    
    clearParticles() {
        // Cancelar timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
        
        // Cancelar animaciones
        this.animationFrames.forEach(anim => anim.cancel());
        this.animationFrames = [];
        
        // Animar salida de partículas
        this.particles.forEach(particle => {
            particle.animate([
                { transform: particle.style.transform, opacity: 1 },
                { transform: particle.style.transform + ' scale(0)', opacity: 0 }
            ], {
                duration: 300,
                easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
            }).onfinish = () => particle.remove();
        });
        
        this.particles = [];
    }
    
    destroy() {
        this.clearParticles();
        this.element.classList.remove('magic-button');
        // Los event listeners se limpiarán automáticamente al remover el elemento
    }
}

// Auto-inicialización para botones con clase .magic-btn
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar botones principales (CTA y paquetes)
    const ctaButtons = document.querySelectorAll('.btn-accent, .btn-primary');
    
    ctaButtons.forEach(button => {
        // Configuración personalizada según el tipo de botón
        const config = {};
        
        if (button.classList.contains('btn-accent')) {
            // Botones de descarga: más intensidad
            config.particleCount = 12;
            config.tiltIntensity = 10;
            config.magnetIntensity = 0.1;
        } else if (button.classList.contains('btn-primary')) {
            // Botones de paquetes: más sutil
            config.particleCount = 8;
            config.tiltIntensity = 6;
            config.magnetIntensity = 0.06;
        }
        
        new MagicButton(button, config);
    });
    
    console.log('MagicButton initialized on', ctaButtons.length, 'buttons');
});

// Exportar para uso manual si se necesita
window.MagicButton = MagicButton;
