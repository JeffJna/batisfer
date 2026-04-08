window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 700);
    }
});

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

            const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            if (!openedWindow) {
                const fallback = document.createElement('a');
                fallback.href = whatsappUrl;
                fallback.target = '_blank';
                fallback.rel = 'noopener noreferrer';
                document.body.appendChild(fallback);
                fallback.click();
                document.body.removeChild(fallback);
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

    // ==========================================================================
    // EFEITOS SURREAIS: CURSOR A LASER, FAÍSCAS E BOTÕES MAGNÉTICOS
    // ==========================================================================

    // Só aplica os efeitos visuais se o usuário estiver usando um mouse de verdade 
    // e não tiver ativado a opção de "Reduzir Movimentos" no sistema operacional.
    if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
        
        // 1. CRIANDO O CURSOR DE LASER
        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        document.body.appendChild(cursorDot);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX;
        let dotY = mouseY;

        // Animação suave (easing) para o cursor seguir o mouse com um leve atraso elegante
        function animateCursor() {
            dotX += (mouseX - dotX) * 0.25;
            dotY += (mouseY - dotY) * 0.25;
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // 2. CAPTURANDO MOVIMENTO E CLIQUES
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Solta faíscas aleatoriamente em movimentos rápidos (Simulando solda/corte)
            if (Math.random() > 0.92) createSpark(mouseX, mouseY);
        });

        window.addEventListener('mousedown', (e) => {
            // Explosão de faíscas ao clicar
            for(let i = 0; i < 8; i++) createSpark(e.clientX, e.clientY, true);
            // Efeito de "apertar" o laser
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) scale(0.6)`;
        });

        window.addEventListener('mouseup', () => {
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) scale(1)`;
        });

        // Muda a forma do cursor ao passar por elementos interativos
        const interactiveElements = document.querySelectorAll('a, button, input:not([type="text"]):not([type="email"]):not([type="tel"]), .file-label');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
        });

        // 3. LÓGICA DE FÍSICA DAS FAÍSCAS (Gravidade e Dissipação)
        function createSpark(x, y, isClick = false) {
            const spark = document.createElement('div');
            spark.classList.add('interactive-spark');
            document.body.appendChild(spark);

            const angle = Math.random() * Math.PI * 2;
            const velocity = isClick ? (Math.random() * 8 + 3) : (Math.random() * 4 + 1);
            let sparkX = x;
            let sparkY = y;
            let velX = Math.cos(angle) * velocity;
            let velY = Math.sin(angle) * velocity; // Vai cair por conta da gravidade
            let opacity = 1;

            function animateSpark() {
                sparkX += velX;
                sparkY += velY;
                velY += 0.25; // Peso da gravidade puxando a faísca para baixo
                opacity -= 0.025; // Dissipação da luz

                spark.style.transform = `translate(${sparkX}px, ${sparkY}px)`;
                spark.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animateSpark);
                } else {
                    spark.remove(); // Limpa o DOM para não pesar a memória
                }
            }
            requestAnimationFrame(animateSpark);
        }

        // 4. BOTÕES MAGNÉTICOS
        const magneticButtons = document.querySelectorAll('.btn-primary, .btn-primary-outline, .btn-secondary, .btn-overlay, .footer-cta');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                // Calcula a distância do mouse até o centro do botão
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Puxa o botão sutilmente (multiplicador 0.25 define a força do imã)
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
                btn.classList.add('magnet-active');
                
                // Efeito Parallax interno (move a setinha do botão um pouco mais rápido)
                const arrow = btn.querySelector('.arrow');
                if(arrow) arrow.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                // Efeito mola para voltar à posição original
                btn.style.transform = '';
                btn.classList.remove('magnet-active');
                
                const arrow = btn.querySelector('.arrow');
                if(arrow) arrow.style.transform = '';
            });
        });
    }

    // ==========================================================================
    // 5. SCROLL HORIZONTAL NÍVEL "CINEMA" GSAP (APENAS DESKTOP)
    // ==========================================================================
    if (window.gsap && window.ScrollTrigger && window.matchMedia("(min-width: 1025px)").matches) {
        gsap.registerPlugin(ScrollTrigger);
        const produtosSec = document.querySelector('.produtos');
        const prodGrid = document.querySelector('.prod-grid');
        
        if(produtosSec && prodGrid) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('produtos-overflow');
            prodGrid.parentNode.insertBefore(wrapper, prodGrid);
            wrapper.appendChild(prodGrid);
            prodGrid.classList.add('is-horizontal');

            const getScrollAmount = () => -(prodGrid.scrollWidth - window.innerWidth + 80);

            const tween = gsap.to(prodGrid, {
                x: getScrollAmount,
                ease: "power1.inOut" // suaviza no começo e fim
            });

            ScrollTrigger.create({
                trigger: wrapper,
                start: "center center",
                end: () => `+=${(getScrollAmount() * -1) + 200}`, // da um folego extra
                pin: true,
                animation: tween,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: () => {
                    // Ativa as animações dos cartões ao entrarem na tela horizontalmente
                    document.querySelectorAll('.prod-card[data-reveal]:not(.revealed)').forEach(card => {
                        const rect = card.getBoundingClientRect();
                        if (rect.left < window.innerWidth * 0.85) {
                            card.classList.add('revealed');
                        }
                    });
                }
            });
        }
    }

    // ==========================================================================
    // 6. CALCULADORA DE PESO TEÓRICO DE AÇO
    // ==========================================================================
    const espessuraInput = document.getElementById('calc-espessura');
    const larguraInput = document.getElementById('calc-largura');
    const comprimentoInput = document.getElementById('calc-comprimento');
    const qteInput = document.getElementById('calc-qte');
    const calcResultado = document.getElementById('calc-resultado');

    if (espessuraInput && larguraInput && comprimentoInput && qteInput && calcResultado) {
        function calculateWeight() {
            // Formula chapas (mm): (Espessura * Largura * Comprimento * 7.85) / 1,000,000 * qte
            const esp = parseFloat(espessuraInput.value) || 0;
            const larg = parseFloat(larguraInput.value) || 0;
            const comp = parseFloat(comprimentoInput.value) || 0;
            const qte = parseInt(qteInput.value) || 1;

            if (esp > 0 && larg > 0 && comp > 0) {
                const pesoUnico = (esp * larg * comp * 7.85) / 1000000;
                const pesoTotal = pesoUnico * qte;
                
                calcResultado.innerHTML = `${pesoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} <small>kg</small>`;
                
                // Feedback pulse
                calcResultado.style.transform = 'scale(1.03)';
                calcResultado.style.color = '#ff4d4d';
                setTimeout(() => {
                    calcResultado.style.transform = 'scale(1)';
                    calcResultado.style.color = 'var(--accent)';
                }, 200);
            } else {
                calcResultado.innerHTML = `0,00 <small>kg</small>`;
            }
        }

        [espessuraInput, larguraInput, comprimentoInput, qteInput].forEach(inp => {
            inp.addEventListener('input', calculateWeight);
        });
    }

    // ==========================================================================
    // 7. FORMULÁRIO CONVERSACIONAL (TYPEFORM STYLE)
    // ==========================================================================
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.step-next');
    const prevBtns = document.querySelectorAll('.step-prev');

    function updateFormSteps(stepNumber) {
        formSteps.forEach(step => {
            if (step.dataset.step == stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = btn.closest('.form-step');
            
            // Basic validation for current step fields before proceeding
            const requiredInputs = currentStep.querySelectorAll('input[required], textarea[required]');
            let allValid = true;
            requiredInputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    allValid = false;
                }
            });

            if (allValid) {
                const nextStep = btn.dataset.next;
                updateFormSteps(nextStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = btn.dataset.prev;
            updateFormSteps(prevStep);
        });
    });

    // ==========================================================================
    // 8. BACK TO TOP BUTTON
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
