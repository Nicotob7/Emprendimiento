// Inicialización del carrusel
const swiper = new Swiper('.swiper-container', {
    // Configuración básica
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    
    // Autoplay
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    
    // Paginación
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    
    // Navegación
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    
    // Responsive breakpoints
    breakpoints: {
        480: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 30
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30
        },
    }
});

// Función utilitaria para manejar modales
function createModalHandler(modalId) {
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('.close-modal');
    
    const closeModal = () => {
        modal.classList.remove('active');
        modal.querySelector('.modal-content').style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });

    return {
        open: (content) => {
            if (content) {
                Object.entries(content).forEach(([key, value]) => {
                    const element = modal.querySelector(`#modal${key.charAt(0).toUpperCase() + key.slice(1)}`);
                    if (element) element.textContent = value;
                });
            }
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                modal.classList.add('active');
                modal.querySelector('.modal-content').style.opacity = '1';
                modal.querySelector('.modal-content').style.transform = 'translateY(0)';
            });
        },
        close: closeModal
    };
}

// Inicialización de todos los componentes cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    const closeMenu = () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        body.style.overflow = '';
    };
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && 
            !navLinks.contains(e.target) && 
            navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                if (window.innerWidth <= 768) closeMenu();
            }
        });
    });

    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => input.setAttribute('placeholder', ' '));

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            try {
                console.log('Datos del formulario:', Object.fromEntries(formData.entries()));
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                contactForm.reset();
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
            }
        });
    }

    // Galería
    const galleryHandler = (() => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const maxVisibleItems = 8;
        let currentIndex = 0;
        let carouselInterval;

        const showItem = (item, delay) => {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, delay);
        };

        const hideItem = (item) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => item.style.display = 'none', 300);
        };

        const showFilteredItems = (items, isCarousel = false) => {
            items.forEach((item, index) => {
                if (isCarousel && index >= maxVisibleItems) {
                    hideItem(item);
                } else {
                    showItem(item, index * 100);
                }
            });
        };

        const startCarousel = () => {
            if (carouselInterval) clearInterval(carouselInterval);
            carouselInterval = setInterval(() => {
                galleryItems.forEach(hideItem);
                setTimeout(() => {
                    currentIndex = (currentIndex + 4) % galleryItems.length;
                    showFilteredItems(Array.from(galleryItems).slice(currentIndex, currentIndex + maxVisibleItems));
                }, 400);
            }, 6000);
        };

        const stopCarousel = () => {
            if (carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = null;
            }
        };

        const defaultButton = document.querySelector('[data-filter="todos"]');
        if (defaultButton) {
            defaultButton.classList.add('active');
            showFilteredItems(Array.from(galleryItems).slice(0, maxVisibleItems), true);
            startCarousel();
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');
                stopCarousel();
                galleryItems.forEach(hideItem);
                setTimeout(() => {
                    if (filterValue === 'todos') {
                        currentIndex = 0;
                        showFilteredItems(Array.from(galleryItems).slice(0, maxVisibleItems), true);
                        startCarousel();
                    } else {
                        showFilteredItems(Array.from(galleryItems).filter(
                            item => item.getAttribute('data-category') === filterValue
                        ));
                    }
                }, 400);
            });
        });
    })();

    // Barra de navegación con scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    });

    // Contador de caracteres para el textarea
    const textarea = document.getElementById('mensaje');
    if (textarea) {
        const characterCount = document.createElement('div');
        characterCount.className = 'character-count';
        textarea.parentElement.appendChild(characterCount);
        
        const updateCharacterCount = () => {
            characterCount.textContent = `${1000 - textarea.value.length} caracteres restantes`;
        };
        
        updateCharacterCount();
        textarea.addEventListener('input', updateCharacterCount);
    }
});

// Manejo de las feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Agregar índices a los elementos de la lista para las animaciones
    featureCards.forEach(card => {
        const listItems = card.querySelectorAll('.feature-details li');
        listItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index + 1);
        });
    });
});

// Manejo del modal de la galería
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    const closeModal = modal.querySelector('.close-modal');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Datos de los proyectos
    const projectData = {
        'ventanas-interiores': {
            title: 'Ventanas Interiores',
            description: 'Instalación de ventanas interiores con diseños modernos y eficientes que maximizan la iluminación natural y mejoran la ventilación del espacio.',
            features: [
                'Diseño personalizado según las necesidades del cliente',
                'Materiales de alta calidad y durabilidad',
                'Instalación profesional y limpia',
                'Optimización de la iluminación natural'
            ]
        },
        'puertas-vidrio': {
            title: 'Puertas de Vidrio',
            description: 'Instalación de puertas de vidrio elegantes que combinan funcionalidad y estética, perfectas para espacios modernos y contemporáneos.',
            features: [
                'Vidrio templado de seguridad',
                'Herrajes de alta calidad',
                'Diseños personalizados',
                'Instalación experta'
            ]
        },
        'puertas-correderas': {
            title: 'Puertas Correderas',
            description: 'Soluciones de puertas correderas que optimizan el espacio y añaden un toque de elegancia a cualquier ambiente.',
            features: [
                'Sistema de deslizamiento suave',
                'Ahorro de espacio',
                'Diseños modernos',
                'Fácil mantenimiento'
            ]
        },
        'divisiones-oficina': {
            title: 'Divisiones de Oficina',
            description: 'Creación de espacios de trabajo funcionales y modernos mediante divisiones de vidrio que mantienen la luminosidad y amplitud visual.',
            features: [
                'Optimización del espacio de trabajo',
                'Aislamiento acústico',
                'Diseños corporativos',
                'Versatilidad y adaptabilidad'
            ]
        },
        'terraza-vidrio': {
            title: 'Terrazas de Vidrio',
            description: 'Transformación de terrazas en espacios habitables todo el año mediante cerramientos de vidrio de alta calidad.',
            features: [
                'Protección contra inclemencias del tiempo',
                'Máximo aprovechamiento del espacio',
                'Sistemas de ventilación',
                'Vistas panorámicas'
            ]
        },
        'instalaciones-espejos': {
            title: 'Instalaciones de Espejos',
            description: 'Instalación profesional de espejos que amplían visualmente los espacios y añaden elegancia a cualquier ambiente.',
            features: [
                'Espejos de alta calidad',
                'Instalación segura',
                'Diseños personalizados',
                'Acabados profesionales'
            ]
        },
        'cierres-piscina': {
            title: 'Cierres de Piscina',
            description: 'Sistemas de cerramiento para piscinas que proporcionan seguridad y permiten el uso de la piscina durante todo el año.',
            features: [
                'Seguridad para niños y mascotas',
                'Mantenimiento del agua limpia',
                'Uso durante todo el año',
                'Fácil operación'
            ]
        },
        'vidrios': {
            title: 'Vidrios Especiales',
            description: 'Soluciones en vidrios especiales para diferentes necesidades, desde seguridad hasta eficiencia energética.',
            features: [
                'Vidrios templados y laminados',
                'Aislamiento térmico y acústico',
                'Variedad de acabados',
                'Certificaciones de calidad'
            ]
        }
    };

    // Abrir modal
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            const imgSrc = item.querySelector('img').src;
            const data = projectData[category];

            if (data) {
                modalImage.src = imgSrc;
                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                
                // Limpiar y agregar características
                modalFeatures.innerHTML = '';
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    modalFeatures.appendChild(li);
                });

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Añadir clase active para la animación
                requestAnimationFrame(() => {
                    modal.classList.add('active');
                    modal.querySelector('.modal-content').style.opacity = '1';
                    modal.querySelector('.modal-content').style.transform = 'translateY(0)';
                });
            }
        });
    });

    // Cerrar modal
    function closeModalHandler() {
        modal.classList.remove('active');
        modal.querySelector('.modal-content').style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    closeModal.addEventListener('click', closeModalHandler);

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
    });
});

// Datos de los servicios
const serviceData = {
    ventanas: {
        title: 'Ventanas',
        icon: 'img/icons/window-icon.svg',
        description: 'Instalación y mantenimiento de ventanas de alta calidad con eficiencia energética, diseñadas para maximizar la luz natural y proporcionar un excelente aislamiento térmico y acústico.',
        features: [
            'Diseños personalizados según sus necesidades',
            'Materiales de primera calidad',
            'Instalación profesional',
            'Garantía extendida'
        ],
        services: [
            'Ventanas de PVC y Aluminio',
            'Ventanas Termopanel y Vidrio Monolítico',
            'Ventanas Proyectantes',
            'Ventanas de Abatir',
            'Ventanas Fijas'
        ]
    },
    puertas: {
        title: 'Puertas',
        icon: 'img/icons/door-icon.svg',
        description: 'Puertas de seguridad y diseño para interior y exterior, combinando estética y funcionalidad para satisfacer las necesidades de nuestros clientes más exigentes.',
        features: [
            'Alta seguridad y durabilidad',
            'Diseños modernos y clásicos',
            'Instalación experta',
            'Variedad de acabados'
        ],
        services: [
            'Puertas de Aluminio',
            'Puertas Protex',
            'Puertas de PVC',
            'Puertas Colgantes'
        ]
    },
    cerramientos: {
        title: 'Otros',
        icon: 'img/icons/enclosure-icon.svg',
        description: 'Soluciones integrales para terrazas y espacios exteriores, transformando áreas abiertas en espacios habitables durante todo el año con máximo confort y estética.',
        features: [
            'Diseños adaptados a su espacio',
            'Materiales resistentes a la intemperie',
            'Sistemas de ventilación',
            'Aislamiento térmico'
        ],
        services: [
            'Cierre de Piscinas con vidrio templado',
            'División de Oficinas',
            'Lucarnas',
            'Vidrios Blindados',
            'Espejos con o sin Biselado',
            'Muro Cortina',
            'ShowerDoor'
        ]
    }
};

// Manejo del modal de servicios
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('serviceModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalServices = document.getElementById('modalServices');
    const closeModal = modal.querySelector('.close-modal');
    const moreInfoButtons = document.querySelectorAll('.more-info-btn');

    function openModal(serviceType) {
        const data = serviceData[serviceType];
        if (!data) return;

        modalIcon.src = data.icon;
        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;

        // Limpiar y agregar características
        modalFeatures.innerHTML = '';
        data.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });

        // Limpiar y agregar servicios
        modalServices.innerHTML = '';
        data.services.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service;
            modalServices.appendChild(li);
        });

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Activar la animación
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    function closeModalFunction() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Event listeners
    moreInfoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const serviceType = button.getAttribute('data-service');
            openModal(serviceType);
        });
    });

    closeModal.addEventListener('click', closeModalFunction);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunction();
        }
    });
});

// Validación del formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const nameInput = document.querySelector('input[id="nombre"]');
    const emailInput = document.querySelector('input[id="email"]');
    const phoneInput = document.querySelector('input[id="telefono"]');
    const nextBtn = document.querySelector('.next-btn');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Validación de solo texto para el nombre
    nameInput.addEventListener('input', function(e) {
        const value = e.target.value;
        const onlyLetters = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        if (value !== onlyLetters) {
            e.target.value = onlyLetters;
        }
        // Remover clase de error al escribir
        this.classList.remove('error');
    });

    // Validación de email
    emailInput.addEventListener('input', function(e) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.classList.remove('error');
        if (!emailPattern.test(e.target.value)) {
            e.target.setCustomValidity('Por favor, ingrese un correo electrónico válido');
        } else {
            e.target.setCustomValidity('');
        }
    });

    // Manejo del campo de teléfono
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value;
        this.classList.remove('error');
        
        // Remover cualquier caracter que no sea número
        value = value.replace(/\D/g, '');
        
        // Limitar a 8 dígitos
        if (value.length > 8) {
            value = value.slice(0, 8);
        }
        
        e.target.value = value;
        
        // Validar que tenga exactamente 8 dígitos
        if (value.length !== 8) {
            e.target.setCustomValidity('El número debe tener 8 dígitos');
        } else {
            e.target.setCustomValidity('');
        }
    });

    // Validación al dar click en Siguiente
    nextBtn.addEventListener('click', function(e) {
        const step1Fields = step1.querySelectorAll('input[required]');
        let isValid = true;

        step1Fields.forEach(field => {
            // Remover clase de error primero
            field.classList.remove('error');
            
            // Validar campo
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else if (field.validity && !field.validity.valid) {
                isValid = false;
                field.classList.add('error');
            }
        });

        if (isValid) {
            // Actualizar indicadores de paso
            document.querySelectorAll('.step').forEach((step, index) => {
                if (index < 2) step.classList.add('active');
            });

            // Mostrar siguiente paso
            step1.style.display = 'none';
            step2.style.display = 'block';
        }
    });

    // Remover clase de error cuando el usuario comienza a escribir
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
});