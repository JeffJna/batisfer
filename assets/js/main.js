document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const quoteForm = document.getElementById('quoteForm');
    const fileInput = document.getElementById('anexo');
    const fileNameDisplay = document.getElementById('file-name');
    const formStatus = document.getElementById('form-status');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const syncNavbar = () => {
        if (!navbar) {
            return;
        }

        navbar.classList.toggle('scrolled', window.scrollY > 24);
    };

    syncNavbar();
    window.addEventListener('scroll', syncNavbar, { passive: true });

    if (mobileMenuToggle && navLinks) {
        const setMenuState = (isOpen) => {
            mobileMenuToggle.classList.toggle('active', isOpen);
            navLinks.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
            mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        };

        const closeMenu = () => setMenuState(false);

        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = !navLinks.classList.contains('active');
            setMenuState(isOpen);
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        document.addEventListener('click', (event) => {
            if (!navLinks.classList.contains('active')) {
                return;
            }

            if (navLinks.contains(event.target) || mobileMenuToggle.contains(event.target)) {
                return;
            }

            closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function updateFileName() {
            fileNameDisplay.textContent = this.files && this.files.length > 0
                ? this.files[0].name
                : 'Nenhum arquivo escolhido';
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const headerOffset = navbar ? navbar.offsetHeight : 0;
            const top = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('[data-reveal]');

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -10% 0px'
        });

        revealElements.forEach((element, index) => {
            element.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
            revealObserver.observe(element);
        });
    } else {
        document.querySelectorAll('[data-reveal]').forEach((element) => {
            element.classList.add('revealed');
        });
    }

    if (quoteForm) {
        quoteForm.addEventListener('submit', function handleSubmit(event) {
            event.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            if (!submitButton) {
                return;
            }

            const formData = new FormData(this);
            const nome = String(formData.get('nome') || '').trim();
            const empresa = String(formData.get('empresa') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const telefone = String(formData.get('telefone') || '').trim();
            const mensagem = String(formData.get('mensagem') || '').trim();
            const anexo = fileInput && fileInput.files && fileInput.files.length > 0
                ? fileInput.files[0].name
                : '';

            const messageLines = [
                'Olá, gostaria de solicitar uma cotação na BATISFER.',
                '',
                `Nome: ${nome}`,
                empresa ? `Empresa: ${empresa}` : '',
                `E-mail: ${email}`,
                `Telefone: ${telefone}`,
                '',
                'Necessidade:',
                mensagem,
                anexo ? '' : '',
                anexo ? `Arquivo para envio posterior: ${anexo}` : ''
            ].filter(Boolean);

            const whatsappUrl = `https://wa.me/5511980976575?text=${encodeURIComponent(messageLines.join('\n'))}`;
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Abrindo WhatsApp...';
            submitButton.disabled = true;
            if (formStatus) {
                formStatus.textContent = 'Abrindo o atendimento comercial no WhatsApp com os dados preenchidos.';
                formStatus.classList.add('is-visible');
            }

            const openedWindow = window.open(whatsappUrl, '_blank', 'noopener');
            if (!openedWindow) {
                window.location.href = whatsappUrl;
            }

            window.setTimeout(() => {
                this.reset();
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = 'Nenhum arquivo escolhido';
                }

                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1200);
        });
    }
});
