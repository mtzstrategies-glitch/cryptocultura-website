// ========================================
// CRYPTOCULTURA - Thank You Page Logic
// Timer 72h + Variant Selector + UTM Tracking
// ========================================

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    
    const STRIPE_LINKS = {
        regular: 'https://buy.stripe.com/9B69AU2nZ2DX0483kbdfG01',
        credit50: 'https://buy.stripe.com/aFa7sM0fR1zT6sw07ZdfG03'
    };

    const VARIANT_CONFIG = {
        regular: {
            price: '$297',
            subtitle: 'Precio lanzamiento (72 h)',
            ctaText: 'Quiero el Onboarding ahora'
        },
        credit50: {
            price: '$247',
            subtitle: 'Crédito $50 · Solo 72h',
            ctaText: 'Quiero el Onboarding ahora'
        }
    };

    // ========================================
    // TIMER COUNTDOWN (72 HOURS)
    // ========================================
    
    function initTimer() {
        const urlParams = new URLSearchParams(window.location.search);
        let deadline;

        const deadlineParam = urlParams.get('deadline');
        if (deadlineParam) {
            const parsedDate = new Date(deadlineParam);
            if (!isNaN(parsedDate.getTime())) {
                deadline = parsedDate.getTime();
            } else {
                deadline = Date.now() + (72 * 60 * 60 * 1000);
            }
        } else {
            deadline = Date.now() + (72 * 60 * 60 * 1000);
        }

        const storedDeadline = localStorage.getItem('ebookDeadline');
        if (storedDeadline) {
            deadline = parseInt(storedDeadline, 10);
        } else {
            localStorage.setItem('ebookDeadline', deadline.toString());
        }

        function updateTimer() {
            const now = Date.now();
            const remaining = Math.max(0, deadline - now);

            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remaining / (1000 * 60)) % 60);
            const seconds = Math.floor((remaining / 1000) % 60);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

            if (remaining === 0) {
                showExpiredMessage();
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    function showExpiredMessage() {
        const timerCard = document.querySelector('.timer-card');
        if (timerCard) {
            timerCard.innerHTML = '<div class="timer-label"><i class="fas fa-clock"></i> Oferta expirada</div><p style="text-align: center; color: var(--text-secondary); margin-top: 1rem;">La oferta de 72 horas ha expirado. Contacta a soporte si aún te interesa.</p>';
        }
    }

    // ========================================
    // VARIANT SELECTOR
    // ========================================
    
    let currentVariant = 'regular';

    function initVariantSelector() {
        const variantButtons = document.querySelectorAll('.variant-btn');
        const priceAmount = document.getElementById('priceAmount');
        const priceSubtitle = document.getElementById('priceSubtitle');
        const ctaText = document.getElementById('ctaText');

        variantButtons.forEach(button => {
            button.addEventListener('click', function() {
                const variant = this.getAttribute('data-variant');
                selectVariant(variant);
            });
        });

        function selectVariant(variant) {
            if (!VARIANT_CONFIG[variant]) return;

            currentVariant = variant;
            const config = VARIANT_CONFIG[variant];

            variantButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            document.getElementById('variant' + capitalizeFirst(variant)).classList.add('active');

            priceAmount.textContent = config.price;
            priceSubtitle.textContent = config.subtitle;
            ctaText.textContent = config.ctaText;

            updateCTALink();
        }
    }

    function capitalizeFirst(str) {
        const map = {
            'regular': 'Regular',
            'credit50': 'Credit'
        };
        return map[str] || str;
    }

    // ========================================
    // CTA LINK BUILDER
    // ========================================
    
    function updateCTALink() {
        const ctaButton = document.getElementById('ctaAccept');
        const baseUrl = STRIPE_LINKS[currentVariant];
        
        if (!baseUrl) {
            console.error('No Stripe link configured for variant:', currentVariant);
            return;
        }

        const finalUrl = buildTrackingUrl(baseUrl);
        ctaButton.href = finalUrl;
    }

    function buildTrackingUrl(baseUrl) {
        try {
            const url = new URL(baseUrl);
            const currentParams = new URLSearchParams(window.location.search);

            const trackingParams = [
                'utm_source',
                'utm_medium',
                'utm_campaign',
                'utm_content',
                'utm_term',
                'cid',
                'customer_id',
                'src'
            ];

            trackingParams.forEach(param => {
                const value = currentParams.get(param);
                if (value) {
                    url.searchParams.set(param, value);
                }
            });

            if (!url.searchParams.get('src')) {
                url.searchParams.set('src', 'ebook_thankyou_upsell');
            }

            url.searchParams.set('variant', currentVariant);

            return url.toString();
        } catch (error) {
            console.error('Error building tracking URL:', error);
            return baseUrl;
        }
    }

    // ========================================
    // ANALYTICS TRACKING
    // ========================================
    
    function trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Thank You - eBook',
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: 49.99,
                currency: 'USD',
                content_name: 'eBook CRYPTOCULTURA',
                content_category: 'Education'
            });
        }
    }

    function trackUpsellView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                currency: 'USD',
                value: 297,
                items: [{
                    item_id: 'onboarding_2x45',
                    item_name: 'Onboarding 2×45',
                    price: 297,
                    quantity: 1
                }]
            });
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Onboarding 2×45 Upsell',
                content_category: 'Upsell',
                value: 297,
                currency: 'USD'
            });
        }
    }

    function trackUpsellClick(variant) {
        const priceValue = variant === 'regular' ? 297 : 247;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: priceValue,
                items: [{
                    item_id: 'onboarding_2x45',
                    item_name: 'Onboarding 2×45',
                    price: priceValue,
                    quantity: 1,
                    variant: variant
                }]
            });
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
                content_name: 'Onboarding 2×45',
                content_category: 'Upsell',
                value: priceValue,
                currency: 'USD',
                variant: variant
            });
        }

        console.log('Upsell click tracked:', variant, priceValue);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    function initEventListeners() {
        const ctaButton = document.getElementById('ctaAccept');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                trackUpsellClick(currentVariant);
            });
        }

        const secondaryButtons = document.querySelectorAll('.btn-secondary');
        secondaryButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'upsell_reject', {
                        event_category: 'Engagement',
                        event_label: 'Rejected Onboarding Upsell'
                    });
                }
            });
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    function init() {
        console.log('CRYPTOCULTURA Thank You Page Initialized');
        
        initTimer();
        initVariantSelector();
        initEventListeners();
        trackPageView();
        setTimeout(trackUpsellView, 1000);
        updateCTALink();

        console.log('All systems ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
