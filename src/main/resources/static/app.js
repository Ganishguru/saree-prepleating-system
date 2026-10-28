// DrapeCraft Studio - Saree Pre-Pleating Application Logic

// 1. Initial State & Configuration
const SERVICES = [
    {
        id: 'classic-pleating',
        name: 'Classic Pre-Pleating',
        price: 250,
        description: 'Steam ironed, 5-6 front pleats aligned with waist pin, and shoulder pallu pre-creased.',
        turnaround: '24-48 Hours',
        recommended: false
    },
    {
        id: 'box-folding',
        name: 'Box Folding & Pallu Setting',
        price: 150,
        description: 'Compact travel-ready box fold with pallu pinned. Slip straight onto hanger or suitcase.',
        turnaround: '24 Hours',
        recommended: false
    },
    {
        id: 'bridal-deluxe',
        name: 'Bridal Box Fold & Pleat',
        price: 450,
        description: 'Full bridal treatment for Kanjivaram/Banarasi. Custom waist fit, pinless micro-pleats & luxury box packaging.',
        turnaround: '48 Hours',
        recommended: true,
        badge: 'Most Popular'
    },
    {
        id: 'express-muhurtham',
        name: 'Express Muhurtham (Same Day)',
        price: 600,
        description: 'Emergency priority pre-pleating completed and dispatched within 6-12 hours.',
        turnaround: 'Same Day',
        recommended: false,
        badge: 'Emergency'
    }
];

const FABRIC_SURCHARGE = {
    'KANJIVARAM_SILK': 50,
    'BANARASI_SILK': 50,
    'SOFT_SILK': 0,
    'ORGANZA': 50,
    'GEORGETTE_CHIFFON': 0,
    'COTTON_LINEN': 0,
    'DESIGNER_HEAVY_WORK': 100
};

const ORDER_STAGES = [
    { key: 'CONFIRMED', label: 'Order Booked' },
    { key: 'SAREE_RECEIVED', label: 'Saree Received' },
    { key: 'IN_PROGRESS', label: 'Steam & Pleating' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { key: 'COMPLETED', label: 'Delivered' }
];

let selectedPackageId = 'bridal-deluxe';
let orders = [];

// 2. Lifecycle Initialization
document.addEventListener('DOMContentLoaded', () => {
    initMinDates();
    renderServicesGrid();
    renderPackageRadioOptions();
    loadOrdersFromStorage();
    updatePriceEstimate();
});

// Set minimum date for event/pickup to today
function initMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const eventDateInput = document.getElementById('eventDate');
    const pickupDateInput = document.getElementById('pickupDate');
    if (eventDateInput) eventDateInput.min = today;
    if (pickupDateInput) pickupDateInput.min = today;
}

// 3. Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabName}`);
    const targetLink = document.querySelector(`.nav-link[data-tab="${tabName}"]`);

    if (targetTab) targetTab.classList.add('active');
    if (targetLink) targetLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabName === 'admin') {
        refreshAdminOrders();
    }
}

// 4. Render Services in Pricing Tab & Booking Form
function renderServicesGrid() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = SERVICES.map(svc => `
        <div class="service-card ${svc.recommended ? 'recommended' : ''}">
            ${svc.badge ? `<span class="badge">${svc.badge}</span>` : ''}
            <div>
                <h3 class="service-card-title">${svc.name}</h3>
                <p class="service-card-desc">${svc.description}</p>
            </div>
            <div>
                <div class="service-card-price">₹${svc.price}</div>
                <button class="btn ${svc.recommended ? 'btn-gold' : 'btn-outline'} btn-block btn-sm" onclick="startBookingPackage('${svc.name}', ${svc.price}, '${svc.id}')">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

function renderPackageRadioOptions() {
    const container = document.getElementById('package-options-container');
    if (!container) return;

    container.innerHTML = SERVICES.map(svc => `
        <label class="package-option-label ${svc.id === selectedPackageId ? 'selected' : ''}" onclick="selectPackage('${svc.id}')">
            <div class="pkg-radio-header">
                <span class="pkg-radio-name">${svc.name}</span>
                <span class="pkg-radio-price">₹${svc.price}</span>
            </div>
            <p class="pkg-radio-desc">${svc.description}</p>
        </label>
    `).join('');
}

function selectPackage(packageId) {
    selectedPackageId = packageId;
    renderPackageRadioOptions();
    updatePriceEstimate();
}

function startBookingPackage(name, price, packageId) {
    if (packageId) selectedPackageId = packageId;
    renderPackageRadioOptions();
    updatePriceEstimate();
    switchTab('book');
}

// 5. Quantity Stepper & Price Calculation
function changeSareeCount(delta) {
    const input = document.getElementById('sareeCount');
    let val = parseInt(input.value || '1', 10) + delta;
    if (val < 1) val = 1;
    if (val > 15) val = 15;
    input.value = val;
    updatePriceEstimate();
}

function updatePriceEstimate() {
    const pkg = SERVICES.find(s => s.id === selectedPackageId) || SERVICES[0];
    const fabricSelect = document.getElementById('fabricType');
    const fabricVal = fabricSelect ? fabricSelect.value : 'KANJIVARAM_SILK';
    const surcharge = FABRIC_SURCHARGE[fabricVal] || 0;
    
    const countInput = document.getElementById('sareeCount');
    const count = parseInt(countInput ? countInput.value : '1', 10);

    const deliveryMode = document.getElementById('deliveryMode')?.value || 'STUDIO_DROP_PICKUP';
    const deliveryFee = deliveryMode === 'DOORSTEP_COURIER' ? 80 : 0;

    const unitPrice = pkg.price + surcharge;
    const totalPrice = (unitPrice * count) + deliveryFee;

    const displayAmount = document.getElementById('estimated-total-display');
    const displayBreakdown = document.getElementById('summary-breakdown-display');

    if (displayAmount) displayAmount.textContent = `₹${totalPrice}`;
    if (displayBreakdown) {
        let details = `${count} saree${count > 1 ? 's' : ''} × ₹${unitPrice}`;
        if (surcharge > 0) details += ` (incl. ₹${surcharge} fabric care)`;
        if (deliveryFee > 0) details += ` + ₹${deliveryFee} courier`;
        displayBreakdown.textContent = `(${details})`;
    }
}

function validateDates() {
    const eventDateInput = document.getElementById('eventDate');
    const pickupDateInput = document.getElementById('pickupDate');
    if (!eventDateInput || !pickupDateInput) return;

    if (eventDateInput.value && pickupDateInput.value) {
        if (pickupDateInput.value > eventDateInput.value) {
            alert('⚠️ Pickup / Delivery date cannot be after the Event date! Please select an earlier delivery date.');
            pickupDateInput.value = eventDateInput.value;
        }
    }
}

// 6. Booking Submission
async function handleBookingSubmit(event) {
    event.preventDefault();
    const pkg = SERVICES.find(s => s.id === selectedPackageId) || SERVICES[0];
    const fabricSelect = document.getElementById('fabricType');
    const count = parseInt(document.getElementById('sareeCount').value, 10);
    const fabric = fabricSelect.value;
    const surcharge = FABRIC_SURCHARGE[fabric] || 0;
    const deliveryMode = document.getElementById('deliveryMode').value;
    const deliveryFee = deliveryMode === 'DOORSTEP_COURIER' ? 80 : 0;
    const totalAmount = ((pkg.price + surcharge) * count) + deliveryFee;

    const orderNumber = `SPP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
        orderNumber,
        customerName: document.getElementById('customerName').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        customerEmail: document.getElementById('customerEmail')?.value.trim() || '',
        customerHeight: document.getElementById('customerHeight')?.value.trim() || '',
        packageName: pkg.name,
        fabricType: fabric,
        sareeCount: count,
        pleatStyle: document.getElementById('pleatStyle').value,
        sareeDescription: document.getElementById('sareeDescription')?.value.trim() || 'Traditional Saree',
        eventDate: document.getElementById('eventDate').value,
        pickupDate: document.getElementById('pickupDate').value,
        deliveryMode: deliveryMode,
        specialInstructions: document.getElementById('specialInstructions')?.value.trim() || '',
        totalAmount,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
    };

    // Try posting to backend API if live, else save to local store
    try {
        await fetch('/api/v1/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        });
    } catch (e) {
        console.log('Backend API not reachable; saving locally in browser storage.');
    }

    orders.unshift(newOrder);
    saveOrdersToStorage();

    // Show confirmation modal
    document.getElementById('modal-order-number').textContent = orderNumber;
    document.getElementById('modal-details-summary').innerHTML = `
        <strong>Customer:</strong> ${newOrder.customerName} (${newOrder.customerPhone})<br>
        <strong>Package:</strong> ${newOrder.packageName} (${newOrder.sareeCount} Saree)<br>
        <strong>Event Date:</strong> ${formatDate(newOrder.eventDate)}<br>
        <strong>Total Amount:</strong> ₹${newOrder.totalAmount}
    `;

    document.getElementById('confirmation-modal').style.display = 'flex';
    document.getElementById('saree-booking-form').reset();
    document.getElementById('sareeCount').value = '1';
    updatePriceEstimate();
}

function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
}

function closeModalAndTrack() {
    const code = document.getElementById('modal-order-number').textContent;
    closeModal();
    quickTrack(code);
}

// 7. Order Tracking
function quickTrack(orderId) {
    switchTab('track');
    const input = document.getElementById('tracker-order-id');
    if (input) input.value = orderId;
    handleTrackOrder(new Event('submit'));
}

async function handleTrackOrder(event) {
    if (event) event.preventDefault();
    const query = document.getElementById('tracker-order-id').value.trim().toUpperCase();
    const resultContainer = document.getElementById('tracker-result-container');

    if (!query) return;

    let order = orders.find(o => o.orderNumber.toUpperCase() === query);

    // If not found locally, query backend REST endpoint
    if (!order) {
        try {
            const resp = await fetch(`/api/v1/bookings/${query}`);
            if (resp.ok) {
                order = await resp.json();
            }
        } catch (e) {
            console.log('Backend search failed', e);
        }
    }

    if (!order) {
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <div class="card text-center" style="border-left: 4px solid var(--accent);">
                <h3>No Booking Found for "${query}"</h3>
                <p style="color: var(--text-secondary); margin-top: 8px;">
                    Please verify your Order Number (e.g., SPP-1001) or contact our studio on WhatsApp for live assistance.
                </p>
            </div>
        `;
        return;
    }

    // Determine current stage index
    const stageKeys = ORDER_STAGES.map(s => s.key);
    let currentIdx = stageKeys.indexOf(order.status);
    if (currentIdx === -1) currentIdx = 0;

    const daysToEvent = computeDaysToEvent(order.eventDate);
    const urgentBadge = daysToEvent <= 2 ? `<span class="urgent-badge">🚨 Muhurtham in ${daysToEvent} day(s)</span>` : '';

    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <div class="tracker-card">
            <div class="order-meta-header">
                <div>
                    <span class="order-code">${order.orderNumber}</span>
                    <h3 style="margin-top: 4px; color: var(--text-primary);">${order.packageName}</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Booked for ${order.customerName}</p>
                </div>
                <div style="text-align: right;">
                    <span class="order-status-badge status-${order.status}">${formatStatus(order.status)}</span>
                    <div style="margin-top: 6px;">${urgentBadge}</div>
                </div>
            </div>

            <!-- Timeline Stepper -->
            <div class="timeline">
                ${ORDER_STAGES.map((stg, i) => {
                    let stepClass = '';
                    if (i < currentIdx) stepClass = 'completed';
                    else if (i === currentIdx) stepClass = 'current';
                    return `
                        <div class="timeline-step ${stepClass}">
                            <div class="step-circle">${i < currentIdx ? '✓' : (i + 1)}</div>
                            <span class="step-label">${stg.label}</span>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Order Details -->
            <div class="order-details-grid">
                <div class="detail-block">
                    <label>Fabric & Saree Count</label>
                    <p>${formatFabric(order.fabricType)} (${order.sareeCount} Saree)</p>
                </div>
                <div class="detail-block">
                    <label>Event Date</label>
                    <p>🗓️ ${formatDate(order.eventDate)}</p>
                </div>
                <div class="detail-block">
                    <label>Target Pickup Date</label>
                    <p>📦 ${formatDate(order.pickupDate)}</p>
                </div>
                <div class="detail-block">
                    <label>Total Price</label>
                    <p style="color: var(--primary); font-weight: 700;">₹${order.totalAmount}</p>
                </div>
            </div>
            ${order.specialInstructions ? `
                <div style="margin-top: 16px; padding: 12px; background: #fffcf5; border: 1px dashed var(--gold); border-radius: 6px; font-size: 0.85rem;">
                    <strong>Special Instructions:</strong> ${order.specialInstructions}
                </div>
            ` : ''}
        </div>
    `;
}

// 8. Admin Studio Management
function refreshAdminOrders() {
    loadOrdersFromStorage();
    renderAdminTable(orders);
    updateAdminMetrics();
}

function updateAdminMetrics() {
    const total = orders.length;
    const urgent = orders.filter(o => computeDaysToEvent(o.eventDate) <= 2 && o.status !== 'COMPLETED').length;
    const inProgress = orders.filter(o => o.status === 'IN_PROGRESS').length;
    const ready = orders.filter(o => o.status === 'READY_FOR_PICKUP').length;

    document.getElementById('metric-total-orders').textContent = total;
    document.getElementById('metric-urgent-orders').textContent = urgent;
    document.getElementById('metric-in-progress').textContent = inProgress;
    document.getElementById('metric-ready').textContent = ready;
}

function renderAdminTable(orderList) {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;

    if (orderList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 24px; color: var(--text-muted);">No bookings match your filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = orderList.map(o => {
        const daysTo = computeDaysToEvent(o.eventDate);
        const isUrgent = daysTo <= 2 && o.status !== 'COMPLETED';
        return `
            <tr>
                <td><strong style="font-family: monospace; color: var(--primary);">${o.orderNumber}</strong></td>
                <td>
                    <div class="customer-cell">
                        <span class="customer-name">${o.customerName}</span>
                        <span class="customer-phone">📞 ${o.customerPhone}</span>
                    </div>
                </td>
                <td>
                    <strong>${formatFabric(o.fabricType)}</strong><br>
                    <small style="color: var(--text-muted);">${o.packageName} (${o.sareeCount})</small>
                </td>
                <td>
                    <span>${formatDate(o.eventDate)}</span>
                    ${isUrgent ? `<span class="urgent-badge">${daysTo <= 0 ? 'TODAY!' : daysTo + 'd left'}</span>` : ''}
                </td>
                <td>
                    <select class="status-select-sm" onchange="updateOrderStatus('${o.orderNumber}', this.value)">
                        <option value="CONFIRMED" ${o.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                        <option value="SAREE_RECEIVED" ${o.status === 'SAREE_RECEIVED' ? 'selected' : ''}>SAREE RECEIVED</option>
                        <option value="IN_PROGRESS" ${o.status === 'IN_PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
                        <option value="READY_FOR_PICKUP" ${o.status === 'READY_FOR_PICKUP' ? 'selected' : ''}>READY FOR PICKUP</option>
                        <option value="COMPLETED" ${o.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="quickTrack('${o.orderNumber}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateOrderStatus(orderNumber, newStatus) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (order) {
        order.status = newStatus;
        saveOrdersToStorage();
        updateAdminMetrics();
    }
}

function filterAdminOrders() {
    const search = document.getElementById('admin-search-input').value.toLowerCase();
    const status = document.getElementById('admin-status-filter').value;

    const filtered = orders.filter(o => {
        const matchesSearch = o.customerName.toLowerCase().includes(search) || 
                              o.customerPhone.includes(search) || 
                              o.orderNumber.toLowerCase().includes(search);
        const matchesStatus = status === 'ALL' || o.status === status;
        return matchesSearch && matchesStatus;
    });

    renderAdminTable(filtered);
}

// 9. Storage & Sample Seed Data
function loadOrdersFromStorage() {
    const stored = localStorage.getItem('drapecraft_orders');
    if (stored) {
        try {
            orders = JSON.parse(stored);
        } catch (e) {
            orders = [];
        }
    }
    if (orders.length === 0) {
        seedSampleData();
    }
}

function saveOrdersToStorage() {
    localStorage.setItem('drapecraft_orders', JSON.stringify(orders));
}

function seedSampleData() {
    orders = [
        {
            orderNumber: 'SPP-1001',
            customerName: 'Ananya Ramachandran',
            customerPhone: '9840123456',
            customerEmail: 'ananya.r@example.com',
            packageName: 'Bridal Box Fold & Pleat',
            fabricType: 'KANJIVARAM_SILK',
            sareeCount: 1,
            pleatStyle: 'CLASSIC',
            sareeDescription: 'Red & Gold Wedding Kanjivaram',
            eventDate: getOffsetDateString(1), // Tomorrow (Urgent)
            pickupDate: getOffsetDateString(0), // Today
            deliveryMode: 'STUDIO_DROP_PICKUP',
            totalAmount: 500,
            status: 'IN_PROGRESS',
            specialInstructions: 'Muhurtham is tomorrow at 6:30 AM; needs extra crisp pallu alignment.'
        },
        {
            orderNumber: 'SPP-1002',
            customerName: 'Deepa Venkat',
            customerPhone: '9789012345',
            customerEmail: 'deepa.v@example.com',
            packageName: 'Classic Pre-Pleating',
            fabricType: 'ORGANZA',
            sareeCount: 2,
            pleatStyle: 'SLEEK',
            sareeDescription: 'Powder Blue Floral Organza',
            eventDate: getOffsetDateString(4),
            pickupDate: getOffsetDateString(3),
            deliveryMode: 'DOORSTEP_COURIER',
            totalAmount: 680,
            status: 'SAREE_RECEIVED',
            specialInstructions: 'Delicate fabric - pinless folding requested.'
        }
    ];
    saveOrdersToStorage();
    if (document.getElementById('tab-admin').classList.contains('active')) {
        refreshAdminOrders();
    }
}

// 10. Utility Helpers
function getOffsetDateString(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
}

function computeDaysToEvent(eventDateStr) {
    if (!eventDateStr) return 999;
    const now = new Date();
    now.setHours(0,0,0,0);
    const event = new Date(eventDateStr);
    event.setHours(0,0,0,0);
    return Math.ceil((event - now) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatStatus(status) {
    return status.replace(/_/g, ' ');
}

function formatFabric(fabric) {
    if (!fabric) return 'Silk';
    return fabric.replace(/_/g, ' ');
}
