// Enhanced JavaScript for Four Skincare Website
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 Four Skincare - Enhanced Experience Loading...');

  // ===== FIREBASE INITIALIZATION =====
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyDLYT2Z4S_kJWkTLIYuc2NuopcjCvxiyHw",
    authDomain: "fourskincare-72c68.firebaseapp.com",
    projectId: "fourskincare-72c68",
    storageBucket: "fourskincare-72c68.firebasestorage.app",
    messagingSenderId: "360655116411",
    appId: "1:360655116411:web:a523ff40ddd4129780eade"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // ===== PERFORMANCE OPTIMIZATION =====
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // ===== LOADING SCREEN =====
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }, 2000);
  }

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ===== THEME TOGGLE =====
  function updateThemeIcon(isDarkMode) {
    // Update hero theme toggle icon
    const heroThemeToggle = document.getElementById('heroThemeToggle');
    if (heroThemeToggle) {
      const icon = heroThemeToggle.querySelector('i');
      if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    // Update navbar theme toggle icon
    const navThemeToggle = document.getElementById('navThemeToggle');
    if (navThemeToggle) {
      const icon = navThemeToggle.querySelector('i');
      if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark-mode') {
    document.body.classList.add('dark-mode');
    updateThemeIcon(true);
  }

  // Add event listeners to both theme toggle buttons
  const heroThemeToggle = document.getElementById('heroThemeToggle');
  const navThemeToggle = document.getElementById('navThemeToggle');

  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
    updateThemeIcon(isDarkMode);
  }

  if (heroThemeToggle) {
    heroThemeToggle.addEventListener('click', toggleTheme);
  }

  if (navThemeToggle) {
    navThemeToggle.addEventListener('click', toggleTheme);
  }

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('header');
  let lastScrollTop = 0;

  function updateHeaderOnScroll() {
    if (header) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-2px)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    }
  }

  window.addEventListener('scroll', throttle(updateHeaderOnScroll, 100));

  // ===== SEARCH FUNCTIONALITY =====
  const searchInput = document.querySelector('.search-input');
  const searchIcon = document.querySelector('.search-icon');

  if (searchInput && searchIcon) {
    searchInput.addEventListener('focus', () => {
      searchIcon.style.transform = 'scale(1.2) rotate(10deg)';
    });

    searchInput.addEventListener('blur', () => {
      searchIcon.style.transform = 'scale(1) rotate(0deg)';
    });
  }

  // ===== PRODUCT DATA =====
  const products = [
    {
      id: 1,
      name: "Natural Cleanser",
      price: 25.00,
      category: "cleanser",
      image: "assets/0 (14).jpg",
      description: "Gentle cleansing for all skin types",
      rating: 4.8,
      badge: "new"
    },
    {
      id: 2,
      name: "Hydrating Serum",
      price: 45.00,
      category: "serum",
      image: "assets/0 (12).jpg",
      description: "Deep hydration for radiant skin",
      rating: 4.9,
      badge: "bestseller"
    },
    {
      id: 3,
      name: "Anti-Aging Cream",
      price: 65.00,
      category: "moisturizer",
      image: "assets/0 (13).jpg",
      description: "Restore youthful radiance",
      rating: 4.7,
      badge: ""
    },
    {
      id: 4,
      name: "Vitamin C Serum",
      price: 55.00,
      category: "serum",
      image: "assets/0 (2).jpg",
      description: "Brighten and even skin tone",
      rating: 4.9,
      badge: "bestseller"
    },
    {
      id: 5,
      name: "Detox Mask",
      price: 35.00,
      category: "mask",
      image: "assets/0 (8).jpg",
      description: "Deep cleansing treatment",
      rating: 4.6,
      badge: ""
    },
    {
      id: 6,
      name: "Night Moisturizer",
      price: 40.00,
      category: "moisturizer",
      image: "assets/0 (14).jpg",
      description: "Overnight rejuvenation",
      rating: 4.8,
      badge: "new"
    }
  ];

  // ===== PRODUCT DISPLAY =====
  const productGrid = document.getElementById('productGrid');
  const tabButtons = document.querySelectorAll('.tab-button');

  function displayProducts(category = 'all') {
    if (!productGrid) return;

    productGrid.innerHTML = '';

    const filteredProducts = category === 'all'
      ? products
      : products.filter(product => product.category === category);

    filteredProducts.forEach((product, index) => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">PKR ${product.price.toFixed(2)}</p>
          <p class="product-description">${product.description}</p>
          <div class="product-actions">
            <button class="shop-now-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Shop Now</button>
          </div>
        </div>
      `;

      productGrid.appendChild(productCard);

      // Animate product cards
      setTimeout(() => {
        productCard.classList.add('show');
      }, index * 100);
    });
  }

  // Tab functionality
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active tab
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Display products for selected category
      const category = button.dataset.category;
      displayProducts(category);
    });
  });

  // Initial product display
  displayProducts();

  // ===== ORDER FORM FUNCTIONALITY =====
  const orderModal = document.getElementById('orderModal');
  const orderForm = document.getElementById('orderForm');
  const closeOrderModal = document.getElementById('closeOrderModal');
  const cancelOrder = document.getElementById('cancelOrder');
  const submitOrder = document.getElementById('submitOrder');
  const successMessage = document.getElementById('successMessage');
  const closeSuccess = document.getElementById('closeSuccess');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.innerHTML = `
    <div class="spinner"></div>
    <p>Processing your order...</p>
  `;
  document.body.appendChild(loadingIndicator);

  // Product information
  let currentProduct = {};

  // Open order modal when "Shop Now" is clicked
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('shop-now-btn')) {
      const button = e.target.classList.contains('shop-now-btn') ? e.target : e.target.closest('.shop-now-btn');
      
      // Get product information
      if (button.dataset.name && button.dataset.price && button.dataset.image) {
        currentProduct = {
          id: Date.now(),
          name: button.dataset.name,
          price: parseFloat(button.dataset.price),
          image: button.dataset.image
        };
        
        // Populate form with product information
        document.getElementById('orderProductId').value = currentProduct.id;
        document.getElementById('orderProductName').textContent = currentProduct.name;
        document.getElementById('orderProductPrice').textContent = currentProduct.price.toFixed(2);
        document.getElementById('orderProductImage').src = currentProduct.image;
        document.getElementById('orderQuantity').value = 1;
        updateOrderTotal();
        
        // Reset form fields
        orderForm.reset();
        document.getElementById('orderProductId').value = currentProduct.id;
        document.getElementById('orderProductName').textContent = currentProduct.name;
        document.getElementById('orderProductPrice').textContent = currentProduct.price.toFixed(2);
        document.getElementById('orderProductImage').src = currentProduct.image;
        document.getElementById('orderQuantity').value = 1;
        updateOrderTotal();
        
        // Clear any previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
          el.textContent = '';
          el.style.display = 'none';
        });
        
        // Show order modal
        orderModal.classList.add('active');
      }
    }
  });

  // Close order modal
  function closeOrderModalFunc() {
    orderModal.classList.remove('active');
  }

  if (closeOrderModal) {
    closeOrderModal.addEventListener('click', closeOrderModalFunc);
  }

  if (cancelOrder) {
    cancelOrder.addEventListener('click', closeOrderModalFunc);
  }

  // Update order total when quantity changes
  function updateOrderTotal() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
    const price = parseFloat(currentProduct.price) || 0;
    const total = quantity * price;
    document.getElementById('orderTotal').textContent = total.toFixed(2);
  }

  document.getElementById('orderQuantity').addEventListener('input', updateOrderTotal);

  // Form validation
  function validateForm() {
    let isValid = true;
    
    // Validate name
    const name = document.getElementById('customerName').value.trim();
    const nameError = document.getElementById('nameError');
    if (name === '') {
      nameError.textContent = 'Please enter your full name';
      nameError.style.display = 'block';
      isValid = false;
    } else {
      nameError.style.display = 'none';
    }
    
    // Validate email
    const email = document.getElementById('customerEmail').value.trim();
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      emailError.textContent = 'Please enter your email address';
      emailError.style.display = 'block';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address';
      emailError.style.display = 'block';
      isValid = false;
    } else {
      emailError.style.display = 'none';
    }
    
    // Validate phone number
    const phone = document.getElementById('customerPhone').value.trim();
    const phoneError = document.getElementById('phoneError');
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (phone === '') {
      phoneError.textContent = 'Please enter your phone number';
      phoneError.style.display = 'block';
      isValid = false;
    } else if (!phoneRegex.test(phone) || phone.length < 10) {
      phoneError.textContent = 'Please enter a valid phone number';
      phoneError.style.display = 'block';
      isValid = false;
    } else {
      phoneError.style.display = 'none';
    }
    
    // Validate city
    const city = document.getElementById('customerCity').value.trim();
    const cityError = document.getElementById('cityError');
    if (city === '') {
      cityError.textContent = 'Please enter your city';
      cityError.style.display = 'block';
      isValid = false;
    } else {
      cityError.style.display = 'none';
    }
    
    // Validate address
    const address = document.getElementById('customerAddress').value.trim();
    const addressError = document.getElementById('addressError');
    if (address === '') {
      addressError.textContent = 'Please enter your delivery address';
      addressError.style.display = 'block';
      isValid = false;
    } else {
      addressError.style.display = 'none';
    }
    
    return isValid;
  }

  // Submit order to Firebase
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      // Show loading indicator
      loadingIndicator.classList.add('active');
      
      // Get form data
      const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
      const orderData = {
        productId: currentProduct.id,
        productName: currentProduct.name,
        productPrice: currentProduct.price,
        productImage: currentProduct.image,
        quantity: quantity,
        total: quantity * currentProduct.price,
        customerName: document.getElementById('customerName').value.trim(),
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        customerCity: document.getElementById('customerCity').value.trim(),
        customerAddress: document.getElementById('customerAddress').value.trim(),
        specialInstructions: document.getElementById('specialInstructions').value.trim(),
        orderDate: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending'
      };
      
      try {
        // Save order to Firestore
        const docRef = await db.collection('orders').add(orderData);
        console.log('Order written with ID: ', docRef.id);
        
        // Hide loading indicator and order modal
        loadingIndicator.classList.remove('active');
        orderModal.classList.remove('active');
        
        // Show success message
        successMessage.classList.add('active');
        
        // Reset form
        orderForm.reset();
      } catch (error) {
        console.error('Error adding order: ', error);
        
        // Hide loading indicator
        loadingIndicator.classList.remove('active');
        
        // Show error message
        alert('There was an error placing your order. Please try again.');
      }
    });
  }

  // Close success message
  if (closeSuccess) {
    closeSuccess.addEventListener('click', () => {
      successMessage.classList.remove('active');
    });
  }

  // ===== QUICK VIEW MODAL =====
  const quickViewModal = document.getElementById('quickViewModal');
  const closeModal = document.querySelector('.close-modal');
  const overlay = document.getElementById('overlay');


  function closeQuickView() {
    if (quickViewModal) {
      quickViewModal.classList.remove('active');
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  // Event listeners for quick view
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('shop-now-btn')) {
      const productId = e.target.dataset.id;
      if (productId) {
        openQuickView(productId);
      }
    }

    if (e.target === closeModal || e.target.classList.contains('close-modal')) {
      closeQuickView();
    }

    if (e.target === overlay) {
      closeQuickView();
    }
  });

  // ===== ROUTINE TABS =====
  const routineTabs = document.querySelectorAll('.routine-tab');
  const routinePanels = document.querySelectorAll('.routine-panel');

  routineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const routine = tab.dataset.routine;

      // Update active tab
      routineTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel
      routinePanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `${routine}-routine`);
      });
    });
  });

  // ===== SEARCH FUNCTIONALITY =====
  const searchResults = document.getElementById('searchResults');
  const searchResultsGrid = searchResults?.querySelector('.search-results-grid');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      const query = searchInput.value.toLowerCase().trim();

      if (query === '') {
        if (searchResults) searchResults.style.display = 'none';
        return;
      }

      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );

      if (searchResults && searchResultsGrid) {
        searchResults.style.display = 'block';
        searchResultsGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
          searchResultsGrid.innerHTML = '<p>No products found matching your search.</p>';
        } else {
          filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
              <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
              </div>
              <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">PKR ${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                  <button class="shop-now-btn" data-id="${product.id}">Shop Now</button>
                </div>
              </div>
            `;
            searchResultsGrid.appendChild(productCard);
          });
        }
      }
    }, 300));
  }

  // ===== CART FUNCTIONALITY =====
  let cart = [];
  const cartBtn = document.querySelector('.cart-btn');
  const cartCount = document.querySelector('.cart-count');

  function updateCartCount() {
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      if (totalItems > 0) {
        cartCount.classList.add('show');
      } else {
        cartCount.classList.remove('show');
      }
    }
  }

  function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
  }

  // Add to cart event listeners
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('shop-now-btn')) {
      const button = e.target.classList.contains('shop-now-btn') ? e.target : e.target.closest('.shop-now-btn');
      const productName = button.dataset.name;
      const productPrice = parseFloat(button.dataset.price);
      const productImage = button.dataset.image;

      if (productName && productPrice && productImage) {
        addToCart({
          id: Date.now(),
          name: productName,
          price: productPrice,
          image: productImage
        });
      }
    }
  });

  // ===== FORM HANDLING =====
  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;

      if (email) {
        console.log('Newsletter subscription:', email);
        showNotification('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
      }
    });
  }

  // Footer newsletter form
  const footerNewsletterForm = document.querySelector('.footer-newsletter-form');
  if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = footerNewsletterForm.querySelector('input').value;

      if (email) {
        console.log('Footer newsletter subscription:', email);
        showNotification('Thank you for subscribing to our newsletter!');
        footerNewsletterForm.reset();
      }
    });
  }

  // Comment form
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const comment = document.getElementById('comment').value;

      if (name && email && comment) {
        console.log('Comment submitted:', { name, email, comment });
        showNotification('Thank you for your comment!');
        commentForm.reset();

        // Add comment to comments list
        const commentsList = document.getElementById('commentsList');
        if (commentsList) {
          const newComment = document.createElement('div');
          newComment.className = 'comment';
          newComment.innerHTML = `
            <div class="comment-header">
              <div class="comment-avatar">
                <img src="https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70)}.jpg" alt="User Avatar">
              </div>
              <div class="comment-meta">
                <h4>${name}</h4>
                <span class="comment-date">Just now</span>
              </div>
            </div>
            <p class="comment-text">${comment}</p>
          `;

          // Insert after the "Recent Comments" heading
          const heading = commentsList.querySelector('h3');
          if (heading && heading.nextSibling) {
            commentsList.insertBefore(newComment, heading.nextSibling);
          } else {
            commentsList.appendChild(newComment);
          }

          // Animate the new comment
          setTimeout(() => {
            newComment.style.opacity = '1';
            newComment.style.transform = 'translateY(0)';
          }, 10);
        }
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const animatedElements = document.querySelectorAll('[data-scroll-animate]');

  function checkScrollAnimations() {
    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate');
      }
    });
  }

  // Initial check
  checkScrollAnimations();

  // Check on scroll
  window.addEventListener('scroll', throttle(checkScrollAnimations, 100));

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      if (backToTop) backToTop.classList.add('show');
    } else {
      if (backToTop) backToTop.classList.remove('show');
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', scrollToTop);
  }

  window.addEventListener('scroll', throttle(toggleBackToTop, 100));

  // ===== NOTIFICATION SYSTEM =====
  function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--gradient-primary);
      color: white;
      padding: 15px 25px;
      border-radius: 50px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
      notification.style.opacity = '1';
    }, 10);

    // Remove after duration
    setTimeout(() => {
      notification.style.transform = 'translateY(100px)';
      notification.style.opacity = '0';

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  // ===== COUNTER ANIMATION =====
  function animateCounter(element, target, duration = 2000) {
    if (!element) return;

    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format the number
      if (target > 1000) {
        element.textContent = Math.floor(current).toLocaleString();
      } else {
        element.textContent = Math.floor(current) + (element.dataset.suffix || '');
      }
    }, 16);
  }

  // Initialize counters when they come into view
  const counterElements = document.querySelectorAll('[data-count]');

  function checkCounters() {
    counterElements.forEach(counter => {
      const elementTop = counter.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        const target = parseInt(counter.dataset.count);
        animateCounter(counter, target);
      }
    });
  }

  // Initial check
  checkCounters();

  // Check on scroll
  window.addEventListener('scroll', throttle(checkCounters, 100));

  // ===== PARTICLE EFFECT =====
  function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: var(--primary-green);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999;
      opacity: 0.3;
    `;
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    document.body.appendChild(particle);
    const duration = Math.random() * 3000 + 2000;
    const finalX = Math.random() * 200 - 100;
    particle.animate([
      { transform: 'translateY(0px) translateX(0px)', opacity: 0.3 },
      { transform: `translateY(-${window.innerHeight + 100}px) translateX(${finalX}px)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'linear'
    }).onfinish = () => particle.remove();
  }

  setInterval(createParticle, 3000);

  // ===== FLOATING PRODUCTS ANIMATION =====
  const floatingProducts = document.querySelectorAll('.floating-product');
  floatingProducts.forEach((product, index) => {
    const delay = parseInt(product.dataset.delay) || 0;

    setTimeout(() => {
      product.style.animation = `productFloat 4s ease-in-out infinite`;
      product.style.animationDelay = `${index}s`;
    }, delay);
  });

  // ===== HERO STATS COUNTER =====
  const heroStats = document.querySelectorAll('.hero-stats-enhanced .stat-number');
  let statsAnimated = false;

  function animateHeroStats() {
    if (statsAnimated) return;

    heroStats.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      if (target) {
        animateCounter(stat, target, 2000);
      }
    });
    statsAnimated = true;
  }

  // Trigger stats animation when hero section is visible
  const heroSection = document.querySelector('.new-hero-section');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(animateHeroStats, 2000); // Delay to match other animations
        }
      });
    });
    observer.observe(heroSection);
  }

  // ===== TEXT ANIMATION =====
  // Animate text elements on page load
  const animateTextElements = () => {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li');

    textElements.forEach((element, index) => {
      // Skip elements inside modals or other specific containers
      if (element.closest('.modal, .loading-screen, .search-suggestions')) return;

      // Add animation class with staggered delay
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Trigger animation
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 50);
      }, index * 50);
    });
  };

  // Run text animation after loading screen
  setTimeout(animateTextElements, 2500);

  // ===== CARD ROTATION ANIMATION =====
  // Get the card elements
  const cardLeft = document.getElementById('card-left');
  const cardRight = document.getElementById('card-right');

  // Function to rotate the cards
  function rotateCards() {
    // Make sure both cards are visible initially
    if (cardLeft && cardRight) {
      // Initial positions - left card visible, right card hidden
      cardLeft.style.left = '0';
      cardRight.style.left = '100%';
      cardRight.style.transform = 'translateX(-100%)';

      // Step 1: Left card moves to right position (using right card's clip path)
      cardLeft.style.transition = 'all 1s ease-in-out';
      cardLeft.style.left = '100%';
      cardLeft.style.transform = 'translateX(-100%)';
      cardLeft.style.clipPath = 'path("M30 1.9C16.21 0.89 4.3 11.99 1.9 25.2L1.9 473.22C4.3 486.42 16.21 497.53 30 498.1L232 448.1C245.79 447.09 245.7 436 248.1 422.8L248.1 78.8C245.7 65.6 245.79 54.49 232 53.48L30 1.9Z")';

      // Step 2: Right card moves to left position (using left card's clip path)
      cardRight.style.transition = 'all 1s ease-in-out';
      cardRight.style.left = '0';
      cardRight.style.transform = 'translateX(0)';
      cardRight.style.clipPath = 'path("M18 53.48C4.21 54.49 4.3 65.6 1.9 78.8L1.9 421.2C4.3 434.4 4.21 445.51 18 446.52L220 496.52C233.79 497.53 245.7 486.42 248.1 473.22L248.1 28.8C245.7 15.6 233.79 4.49 220 3.48L18 53.48Z")';

      // After 3 seconds, reset for the next rotation
      setTimeout(() => {
        // Create temporary clones of the cards
        const tempLeft = cardLeft.cloneNode(true);
        const tempRight = cardRight.cloneNode(true);

        // Reset transitions and transforms
        [tempLeft, tempRight].forEach(card => {
          card.style.transition = 'none';
          card.style.transform = '';
        });

        // Replace the cards in the DOM
        const container = document.querySelector('.animated-cards-container');

        // Remove old cards
        cardLeft.remove();
        cardRight.remove();

        // Add new cards with updated IDs
        tempLeft.id = 'card-left';
        tempRight.id = 'card-right';

        // Position the cards
        tempLeft.style.left = '0';
        tempRight.style.left = '100%';
        tempRight.style.transform = 'translateX(-100%)';

        // Add cards to container
        container.appendChild(tempLeft);
        container.appendChild(tempRight);

        // Continue the rotation
        setTimeout(rotateCards, 100);
      }, 3000); // 3 seconds pause
    }
  }

  // Start the rotation after the initial card entry animation completes
  setTimeout(() => {
    rotateCards();
  }, 3000);

  // ===== INITIALIZATION =====
  console.log('🌿 Four Skincare - Enhanced Experience Loaded Successfully!');

  // Initialize cart count
  updateCartCount();
});

// Enhanced Shape Animations with Random Positioning
const shapes = document.querySelectorAll('.shape');
shapes.forEach((shape, index) => {
  // Random starting positions
  const randomTop = Math.random() * 80 + 10;
  const randomLeft = Math.random() * 100;
  const randomDelay = Math.random() * 10;
  const randomDuration = 15 + Math.random() * 15;

  shape.style.top = `${randomTop}%`;
  shape.style.left = `${randomLeft}%`;
  shape.style.animationDelay = `${randomDelay}s`;
  shape.style.animationDuration = `${randomDuration}s`;

  // Add random rotation
  shape.style.transform = `rotate(${Math.random() * 360}deg)`;
});

// Glowing Orbs Random Movement
const glowOrbs = document.querySelectorAll('.glow-orb');
glowOrbs.forEach((orb, index) => {
  const randomDelay = Math.random() * 5;
  const randomDuration = 10 + Math.random() * 10;
  orb.style.animationDelay = `${randomDelay}s`;
  orb.style.animationDuration = `${randomDuration}s`;
});

// Interactive Mouse Effects
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  // Parallax effect for shapes
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - 0.5) * speed * 20;
    const y = (mouseY - 0.5) * speed * 20;
    shape.style.transform += ` translate(${x}px, ${y}px)`;
  });
});

// Particles.js Enhanced Configuration
document.addEventListener('DOMContentLoaded', () => {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles', {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: ['#15803d', '#22c55e', '#D4F4E2', '#FF6B6B'] },
        shape: {
          type: ['circle', 'triangle', 'polygon'],
          polygon: { nb_sides: 6 }
        },
        opacity: {
          value: 0.6,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1 }
        },
        size: {
          value: 8,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1 }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#15803d',
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 3,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'bounce',
          bounce: true,
          attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: ['repulse', 'bubble'] },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          bubble: { distance: 200, size: 15, duration: 2, opacity: 0.8 },
          push: { particles_nb: 6 }
        }
      },
      retina_detect: true
    });
  }
});

// Dynamic Color Changes
setInterval(() => {
  const hue = Math.floor(Math.random() * 360);
  document.documentElement.style.setProperty('--accent-color', `hsl(${hue}, 70%, 60%)`);
}, 10000);

// Performance optimization
let ticking = false;
function updateAnimations() {
  // Batch DOM updates
  if (!ticking) {
    requestAnimationFrame(() => {
      ticking = false;
    });
    ticking = true;
  }
}