// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLYT2Z4S_kJWkTLIYuc2NuopcjCvxiyHw",
    authDomain: "fourskincare-72c68.firebaseapp.com",
    projectId: "fourskincare-72c68",
    storageBucket: "fourskincare-72c68.firebasestorage.app",
    messagingSenderId: "360655116411",
    appId: "1:360655116411:web:a523ff40ddd4129780eade"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// App State
let currentUser = null;
let currentPage = 'dashboard';
let realtimeListeners = [];
let charts = {};

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const adminContainer = document.getElementById('adminContainer');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const pageTitle = document.getElementById('pageTitle');
const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Auth state listener
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            showDashboard();
        } else {
            showLogin();
        }
    });
    
    // Event listeners
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('logoutDropdown').addEventListener('click', handleLogout);
    
    // Quick actions
    document.getElementById('viewAllOrders').addEventListener('click', () => navigateToPage('orders'));
    document.getElementById('viewAnalyticsBtn').addEventListener('click', () => navigateToPage('analytics'));
    document.getElementById('manageOrdersBtn').addEventListener('click', () => navigateToPage('orders'));
    
    // Notifications
    document.getElementById('notifications').addEventListener('click', toggleNotifications);
    document.getElementById('clearAllNotifications').addEventListener('click', clearAllNotifications);
    
    // User menu
    document.getElementById('userMenu').addEventListener('click', toggleUserMenu);
    
    // Filters
    document.getElementById('applyFilters').addEventListener('click', applyOrderFilters);
    document.getElementById('resetFilters').addEventListener('click', resetOrderFilters);
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#notifications')) {
            document.getElementById('notificationsDropdown').classList.remove('active');
        }
        if (!e.target.closest('#userMenu')) {
            document.getElementById('userDropdown').classList.remove('active');
        }
    });
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    showLoading();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast('Login successful', 'success');
        loginError.style.display = 'none';
    } catch (error) {
        console.error('Login error:', error);
        loginError.style.display = 'block';
        showToast('Login failed', 'error');
    }
    
    hideLoading();
}

function handleLogout() {
    // Clean up listeners
    realtimeListeners.forEach(unsubscribe => unsubscribe());
    realtimeListeners = [];
    
    auth.signOut().then(() => {
        showToast('Logged out successfully', 'info');
    }).catch(error => {
        console.error('Logout error:', error);
    });
}

// UI Functions
function showLogin() {
    loginContainer.style.display = 'flex';
    adminContainer.style.display = 'none';
}

function showDashboard() {
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'flex';
    
    // Update user info
    updateUserInfo();
    
    // Load initial data
    navigateToPage('dashboard');
}

function updateUserInfo() {
    if (currentUser) {
        const displayName = currentUser.displayName || currentUser.email.split('@')[0];
        document.getElementById('userName').textContent = displayName;
        document.getElementById('userAvatar').textContent = displayName.charAt(0).toUpperCase();
    }
}

function navigateToPage(page) {
    // Update active navigation
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).closest('.nav-item').classList.add('active');
    
    // Update page title
    const pageNames = {
        dashboard: 'Dashboard',
        orders: 'Order Management',
        analytics: 'Analytics',
        products: 'Products',
        customers: 'Customers',
        images: 'Media'
    };
    pageTitle.textContent = pageNames[page] || 'Dashboard';
    
    // Hide all page content
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${page}Content`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        
        // Load page-specific data
        loadPageData(page);
    }
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

// Data Loading Functions
async function loadPageData(page) {
    showLoading();
    
    try {
        switch (page) {
            case 'dashboard':
                await loadDashboardData();
                break;
            case 'orders':
                await loadOrdersData();
                break;
            case 'analytics':
                await loadAnalyticsData();
                break;
            case 'products':
                await loadProductsData();
                break;
            case 'customers':
                await loadCustomersData();
                break;
            case 'images':
                await loadMediaData();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${page} data:`, error);
        showToast(`Error loading ${page} data`, 'error');
    }
    
    hideLoading();
}

// Dashboard Data
async function loadDashboardData() {
    // Setup real-time listeners for dashboard stats
    setupDashboardListeners();
    
    // Load recent orders
    loadRecentOrders();
}

function setupDashboardListeners() {
    // Clean up existing listeners
    realtimeListeners.forEach(unsubscribe => unsubscribe());
    realtimeListeners = [];
    
    // Orders listener
    const ordersListener = db.collection('orders')
        .onSnapshot(snapshot => {
            updateDashboardStats(snapshot);
            updateNotifications(snapshot);
        });
    
    realtimeListeners.push(ordersListener);
}

function updateDashboardStats(ordersSnapshot) {
    let totalOrders = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let totalRevenue = 0;
    
    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        totalOrders++;
        totalRevenue += order.total || 0;
        
        switch (order.status) {
            case 'pending':
            case 'processing':
                pendingOrders++;
                break;
            case 'delivered':
                completedOrders++;
                break;
        }
    });
    
    // Update UI
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('completedOrders').textContent = completedOrders;
    document.getElementById('totalRevenue').textContent = `PKR ${totalRevenue.toLocaleString()}`;
    
    // Update badge
    document.getElementById('pendingOrdersBadge').textContent = pendingOrders;
    
    // Calculate changes (mock data for demo)
    document.getElementById('ordersChange').textContent = '+12%';
    document.getElementById('pendingChange').textContent = '-8%';
    document.getElementById('completedChange').textContent = '+15%';
    document.getElementById('revenueChange').textContent = '+23%';
}

async function loadRecentOrders() {
    try {
        const snapshot = await db.collection('orders')
            .orderBy('orderDate', 'desc')
            .limit(5)
            .get();
        
        const tbody = document.getElementById('recentOrdersTable');
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #6b7280;">
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }
        
        snapshot.forEach(doc => {
            const order = doc.data();
            const row = createOrderRow(doc.id, order, true);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent orders:', error);
        showToast('Error loading recent orders', 'error');
    }
}

// Orders Data
async function loadOrdersData() {
    try {
        const snapshot = await db.collection('orders')
            .orderBy('orderDate', 'desc')
            .get();
        
        const tbody = document.getElementById('ordersTable');
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #6b7280;">
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }
        
        snapshot.forEach(doc => {
            const order = doc.data();
            const row = createOrderRow(doc.id, order, false);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Error loading orders', 'error');
    }
}

function createOrderRow(orderId, order, isRecent = false) {
    const row = document.createElement('tr');
    
    const orderDate = order.orderDate ? formatDate(order.orderDate.toDate()) : 'N/A';
    const modifiedDate = order.modifiedDate ? formatDate(order.modifiedDate.toDate()) : 'N/A';
    
    const columns = [
        `#${orderId.substring(0, 8)}`,
        order.customerName || 'N/A',
        order.productName || 'N/A',
        `PKR ${(order.total || 0).toLocaleString()}`,
        `<span class="status-badge ${order.status || 'pending'}">${order.status || 'pending'}</span>`,
        orderDate,
    ];
    
    if (!isRecent) {
        columns.push(order.modifiedBy || 'N/A');
    }
    
    columns.push(`
        <div class="action-buttons">
            <button class="btn btn-icon btn-secondary" onclick="viewOrder('${orderId}')" title="View">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-icon btn-primary" onclick="editOrder('${orderId}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
        </div>
    `);
    
    row.innerHTML = columns.map(col => `<td>${col}</td>`).join('');
    return row;
}

// Analytics Data
async function loadAnalyticsData() {
    try {
        const snapshot = await db.collection('orders').get();
        
        // Calculate analytics
        const analytics = calculateAnalytics(snapshot);
        
        // Update UI
        updateAnalyticsUI(analytics);
        
        // Create charts
        createAnalyticsCharts(analytics);
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        showToast('Error loading analytics', 'error');
    }
}

function calculateAnalytics(ordersSnapshot) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    let totalRevenue = 0;
    let totalOrders = 0;
    const orderValues = [];
    const statusCounts = {};
    const productSales = {};
    const dailySales = {};
    
    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const orderDate = order.orderDate ? order.orderDate.toDate() : new Date();
        
        // Only include recent orders
        if (orderDate >= thirtyDaysAgo) {
            totalRevenue += order.total || 0;
            totalOrders++;
            orderValues.push(order.total || 0);
            
            // Status distribution
            const status = order.status || 'pending';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            
            // Product sales
            const productName = order.productName || 'Unknown';
            productSales[productName] = (productSales[productName] || 0) + 1;
            
            // Daily sales
            const dateKey = orderDate.toDateString();
            dailySales[dateKey] = (dailySales[dateKey] || 0) + (order.total || 0);
        }
    });
    
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = 3.2; // Mock conversion rate
    const newCustomers = Math.floor(totalOrders * 0.6); // Mock new customers
    
    return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        conversionRate,
        newCustomers,
        statusCounts,
        productSales,
        dailySales
    };
}

function updateAnalyticsUI(analytics) {
    document.getElementById('analyticsRevenue').textContent = `PKR ${analytics.totalRevenue.toLocaleString()}`;
    document.getElementById('conversionRate').textContent = `${analytics.conversionRate}%`;
    document.getElementById('avgOrderValue').textContent = `PKR ${analytics.avgOrderValue.toLocaleString()}`;
    document.getElementById('newCustomers').textContent = analytics.newCustomers;
}

function createAnalyticsCharts(analytics) {
    // Sales Chart
    createSalesChart(analytics.dailySales);
    
    // Status Chart
    createStatusChart(analytics.statusCounts);
    
    // Products Chart
    createProductsChart(analytics.productSales);
    
    // Revenue Chart (same as sales for now)
    createRevenueChart(analytics.dailySales);
}

function createSalesChart(dailySales) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (charts.salesChart) {
        charts.salesChart.destroy();
    }
    
    const labels = Object.keys(dailySales).slice(-7); // Last 7 days
    const data = labels.map(date => dailySales[date] || 0);
    
    charts.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(date => new Date(date).toLocaleDateString()),
            datasets: [{
                label: 'Sales',
                data: data,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'PKR ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function createStatusChart(statusCounts) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    if (charts.statusChart) {
        charts.statusChart.destroy();
    }
    
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    
    charts.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#f59e0b', // warning
                    '#3b82f6', // info  
                    '#8b4513', // shipped
                    '#10b981', // success
                    '#ef4444', // danger
                    '#a855f7'  // purple
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createProductsChart(productSales) {
    const ctx = document.getElementById('productsChart');
    if (!ctx) return;
    
    if (charts.productsChart) {
        charts.productsChart.destroy();
    }
    
    const sortedProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const labels = sortedProducts.map(([name]) => name);
    const data = sortedProducts.map(([,count]) => count);
    
    charts.productsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales',
                data: data,
                backgroundColor: '#10b981',
                borderColor: '#059669',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createRevenueChart(dailySales) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    if (charts.revenueChart) {
        charts.revenueChart.destroy();
    }
    
    const labels = Object.keys(dailySales).slice(-30); // Last 30 days
    const data = labels.map(date => dailySales[date] || 0);
    
    charts.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(date => new Date(date).toLocaleDateString()),
            datasets: [{
                label: 'Revenue',
                data: data,
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: '#10b981',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'PKR ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Products Data
async function loadProductsData() {
    try {
        const snapshot = await db.collection('products').get();
        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #6b7280;">
                        No products found
                    </td>
                </tr>
            `;
            return;
        }
        
        snapshot.forEach(doc => {
            const product = doc.data();
            const row = createProductRow(doc.id, product);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

function createProductRow(productId, product) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div class="product-image">
                <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=50&h=50&fit=crop'}" alt="${product.name}">
            </div>
        </td>
        <td>${product.name || 'N/A'}</td>
        <td>${product.category || 'N/A'}</td>
        <td>PKR ${(product.price || 0).toLocaleString()}</td>
        <td>${product.stock || 0}</td>
        <td><span class="status-badge ${product.status || 'active'}">${product.status || 'active'}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-icon btn-secondary" onclick="viewProduct('${productId}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-icon btn-primary" onclick="editProduct('${productId}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Customers Data
async function loadCustomersData() {
    try {
        const snapshot = await db.collection('customers').get();
        const tbody = document.getElementById('customersTable');
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #6b7280;">
                        No customers found
                    </td>
                </tr>
            `;
            return;
        }
        
        snapshot.forEach(doc => {
            const customer = doc.data();
            const row = createCustomerRow(doc.id, customer);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
        showToast('Error loading customers', 'error');
    }
}

function createCustomerRow(customerId, customer) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${customer.name || 'N/A'}</td>
        <td>${customer.email || 'N/A'}</td>
        <td>${customer.phone || 'N/A'}</td>
        <td>${customer.city || 'N/A'}</td>
        <td>${customer.orderCount || 0}</td>
        <td>PKR ${(customer.totalSpent || 0).toLocaleString()}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-icon btn-secondary" onclick="viewCustomer('${customerId}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-icon btn-primary" onclick="editCustomer('${customerId}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Media Data
async function loadMediaData() {
    try {
        const listRef = storage.ref().child('images');
        const res = await listRef.listAll();
        
        const mediaGrid = document.getElementById('mediaGrid');
        mediaGrid.innerHTML = '';
        
        if (res.items.length === 0) {
            mediaGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6b7280;">
                    No media files found
                </div>
            `;
            return;
        }
        
        for (const itemRef of res.items) {
            const url = await itemRef.getDownloadURL();
            const metadata = await itemRef.getMetadata();
            
            const mediaItem = createMediaItem(url, metadata);
            mediaGrid.appendChild(mediaItem);
        }
    } catch (error) {
        console.error('Error loading media:', error);
        showToast('Error loading media', 'error');
    }
}

function createMediaItem(url, metadata) {
    const item = document.createElement('div');
    item.className = 'media-item';
    
    const name = metadata.name || 'Unknown';
    const size = formatFileSize(metadata.size || 0);
    const date = metadata.timeCreated ? new Date(metadata.timeCreated).toLocaleDateString() : 'Unknown';
    
    item.innerHTML = `
        <div class="media-image">
            <img src="${url}" alt="${name}" onclick="viewMedia('${url}', '${name}')">
        </div>
        <div class="media-info">
            <div class="media-name">${name}</div>
            <div class="media-meta">${size} • ${date}</div>
        </div>
    `;
    
    return item;
}

// Notification Functions
function updateNotifications(ordersSnapshot) {
    const notifications = [];
    
    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const orderDate = order.orderDate ? order.orderDate.toDate() : new Date();
        const isRecent = (new Date() - orderDate) < (24 * 60 * 60 * 1000); // Last 24 hours
        
        if (isRecent) {
            notifications.push({
                id: doc.id,
                title: getNotificationTitle(order.status),
                message: `Order #${doc.id.substring(0, 8)} from ${order.customerName}`,
                time: formatTimeAgo(orderDate),
                type: order.status
            });
        }
    });
    
    // Update notification count
    document.getElementById('notificationCount').textContent = notifications.length;
    
    // Update notifications list
    updateNotificationsList(notifications.slice(0, 10)); // Show only 10 most recent
}

function getNotificationTitle(status) {
    const titles = {
        'pending': 'New Order',
        'processing': 'Order Processing',
        'shipped': 'Order Shipped',
        'delivered': 'Order Delivered',
        'cancelled': 'Order Cancelled',
        'return': 'Return Request'
    };
    return titles[status] || 'Order Update';
}

function updateNotificationsList(notifications) {
    const list = document.getElementById('notificationsList');
    
    if (notifications.length === 0) {
        list.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #6b7280;">
                <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                No new notifications
            </div>
        `;
        return;
    }
    
    list.innerHTML = notifications.map(notification => `
        <div class="notification-item" onclick="viewOrder('${notification.id}')">
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        </div>
    `).join('');
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.classList.toggle('active');
}

function clearAllNotifications() {
    document.getElementById('notificationCount').textContent = '0';
    document.getElementById('notificationsList').innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #6b7280;">
            <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
            No new notifications
        </div>
    `;
    document.getElementById('notificationsDropdown').classList.remove('active');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Order Filter Functions
function applyOrderFilters() {
    const status = document.getElementById('statusFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // TODO: Implement filtering logic
    showToast('Filters applied', 'info');
}

function resetOrderFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    
    // Reload orders
    loadOrdersData();
}

// Modal Functions
function viewOrder(orderId) {
    // TODO: Implement order viewing modal
    showToast('Order details modal not implemented yet', 'info');
}

function editOrder(orderId) {
    // TODO: Implement order editing modal
    showToast('Order editing modal not implemented yet', 'info');
}

function viewProduct(productId) {
    showToast('Product details modal not implemented yet', 'info');
}

function editProduct(productId) {
    showToast('Product editing modal not implemented yet', 'info');
}

function viewCustomer(customerId) {
    showToast('Customer details modal not implemented yet', 'info');
}

function editCustomer(customerId) {
    showToast('Customer editing modal not implemented yet', 'info');
}

function viewMedia(url, name) {
    // Open image in a new tab or modal
    window.open(url, '_blank');
}

// Utility Functions
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    
    const icons = {
        success: 'fas fa-check',
        error: 'fas fa-times',
        warning: 'fas fa-exclamation',
        info: 'fas fa-info'
    };
    
    toast.innerHTML = `
        <div class="toast-icon ${type}">
            <i class="${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else {
        return `${diffInDays}d ago`;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Chart.js global settings
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = '#6b7280';
});