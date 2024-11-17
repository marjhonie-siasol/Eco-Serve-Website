const elements = {
    navbar: {
        menu: document.querySelector('.nav-bar'),
        links: document.querySelectorAll('.nav-bar a'),
        menuBar: document.querySelector('#menu-bar'),
    },
    header: document.querySelector('.header-3'),
    scrollTop: document.querySelector('.scroll-top'),
    cart: {
        container: document.querySelector('.cart-items-container'),
        button: document.querySelector('#cart-btn'),
    },
    login: {
        container: document.querySelector('.login-form-container'),
        button: document.querySelector('#login-btn'),
        closeButton: document.querySelector('#close-login-btn'),
    },
    search: {
        bar: document.querySelector('#search-bar'),
        form: document.querySelector('.serach-bar-container'),
    },
    sections: document.querySelectorAll('section[id]'),
    products: document.querySelectorAll('.product .box'),
};

const PRODUCT_CATEGORIES = [
    'Succulents-Cacti',
    'Herbs',
    'Flowers',
    'Air-Purifying',
    'Bonsai',
    'Aquatic',
    'Trees-Shrubs',
    'Fruits-Veges',
    'Climbing-Trailing',
    'Rare-Exotic'
];

function createNoResultsMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'no-results-message';

    messageDiv.style.display = 'none';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.padding = '20px';
    messageDiv.style.fontSize = '2rem';
    messageDiv.style.color = '#666';
    messageDiv.style.width = '100%';
    messageDiv.style.margin = '20px 0';
    messageDiv.style.fontWeight = '700';

    const firstProductSection = document.querySelector('.product');
    if (firstProductSection) {
        firstProductSection.parentNode.insertBefore(messageDiv, firstProductSection);
    }
    return messageDiv;
}

function setupSearch() {
    if (!elements.search.bar) return;

    const noResultsMessage = createNoResultsMessage();

    function filterProducts(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        let hasResults = false;

        noResultsMessage.style.display = 'none';

        elements.products.forEach(box => {
            const productName = box.querySelector('h3').textContent.toLowerCase();
            const productSection = box.closest('section');
            const sectionTitle = productSection?.querySelector('.heading')?.textContent.toLowerCase() || '';

            const isMatch = productName.includes(searchTerm) ||
                sectionTitle.includes(searchTerm);

            box.style.display = isMatch || searchTerm === '' ? '' : 'none';

            if (isMatch) {
                hasResults = true;
            }

            if (productSection) {
                const visibleProducts = Array.from(productSection.querySelectorAll('.box'))
                    .some(b => b.style.display !== 'none');
                productSection.style.display = visibleProducts ? '' : 'none';
            }
        });

        if (!hasResults && searchTerm !== '') {
            noResultsMessage.style.display = 'block';
            noResultsMessage.textContent = `No "${searchTerm}" product found`;
        }
    }

    elements.search.bar.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });

    if (elements.search.form) {
        elements.search.form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    function clearSearch() {
        elements.search.bar.value = '';
        filterProducts('');
    }

    window.addEventListener('load', clearSearch);
    window.addEventListener('popstate', clearSearch);
}

function setupSmoothScroll() {
    elements.navbar.links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (!href.startsWith('#')) return;

            e.preventDefault();

            elements.navbar.links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            closeMenu();
        });
    });
}

function closeMenu() {
    if (!elements.navbar.menuBar) return;
    elements.navbar.menuBar.classList.remove('fa-times');
    elements.navbar.menu.classList.remove('active');
}

function toggleCart() {
    if (!elements.cart.container) return;
    elements.cart.container.classList.toggle('active');
    closeMenu();
}

function toggleLogin() {
    if (!elements.login.container) return;
    elements.login.container.classList.toggle('active');
    closeMenu();
    if (elements.cart.container) {
        elements.cart.container.classList.remove('active');
    }
}

function handleScroll() {
    closeMenu();

    if (elements.header) {
        elements.header.classList.toggle('active', window.scrollY > 250);
    }

    if (elements.scrollTop) {
        elements.scrollTop.style.display = window.scrollY > 250 ? 'initial' : 'none';
    }
}

function initializeSwiper() {
    const slider = document.querySelector(".home-slider");
    if (!slider) return;

    return new Swiper(slider, {
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
    });
}

function initializeCountdown() {
    const countdownElements = {
        day: document.getElementById('day'),
        hour: document.getElementById('hour'),
        minute: document.getElementById('minute'),
        second: document.getElementById('second')
    };

    if (!Object.values(countdownElements).every(Boolean)) return;

    const countDate = new Date('november 31, 2024 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const gap = countDate - now;

        const timeUnits = {
            day: Math.floor(gap / (1000 * 60 * 60 * 24)),
            hour: Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minute: Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60)),
            second: Math.floor((gap % (1000 * 60)) / 1000)
        };

        Object.entries(timeUnits).forEach(([unit, value]) => {
            countdownElements[unit].innerText = value;
        });
    }

    setInterval(updateCountdown, 1000);
}

function setupEventListeners() {
    window.addEventListener('scroll', handleScroll);

    window.addEventListener('load', () => {
        if (elements.cart.container) elements.cart.container.classList.remove('active');
        if (elements.login.container) elements.login.container.classList.remove('active');
        closeMenu();

        const hash = window.location.hash;
        if (hash) {
            const activeLink = document.querySelector(`.nav-bar a[href="${hash}"]`);
            if (activeLink) {
                elements.navbar.links.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }
        }
    });

    if (elements.navbar.menuBar) {
        elements.navbar.menuBar.addEventListener('click', () => {
            elements.navbar.menuBar.classList.toggle('fa-times');
            elements.navbar.menu.classList.toggle('active');
            if (elements.cart.container) elements.cart.container.classList.remove('active');
        });
    }

    if (elements.login.button) {
        elements.login.button.addEventListener('click', toggleLogin);
    }

    if (elements.login.closeButton) {
        elements.login.closeButton.addEventListener('click', () => {
            elements.login.container.classList.remove('active');
        });
    }

    if (elements.cart.button) {
        elements.cart.button.addEventListener('click', toggleCart);
    }
}

function createSectionObserver() {
    const options = {
        root: null,
        rootMargin: '-50% 0px',
        threshold: 0
    };

    function callback(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const id = entry.target.getAttribute('id');
            updateActiveNavLink(id, entry.target);
        });
    }

    return new IntersectionObserver(callback, options);
}

function updateActiveNavLink(id, target) {
    elements.navbar.links.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href').substring(1);

        const isProductCategory = href === id ||
            (PRODUCT_CATEGORIES.includes(href) &&
                id === 'Product' &&
                target.querySelector(`#${href}`));

        if (isProductCategory) {
            link.classList.add('active');
        }
    });
}

function initializeApp() {
    const observer = createSectionObserver();
    elements.sections.forEach(section => observer.observe(section));

    setupSearch();
    setupSmoothScroll();
    setupEventListeners();
    initializeSwiper();
    initializeCountdown();
}

initializeApp();