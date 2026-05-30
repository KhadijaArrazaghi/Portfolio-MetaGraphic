// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const ham = document.getElementById('hamburger');
    menu.classList.toggle('open');
    ham.classList.toggle('open');
}
function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
}

// ===== BUBBLES =====
const bubbleContainer = document.getElementById('bubbleContainer');
for (let i = 0; i < 25; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 15 + 5 + 'px';
    b.style.cssText = `width:${size};height:${size};left:${Math.random()*100}%;animation-duration:${Math.random()*3+4}s;animation-delay:${Math.random()*5}s;`;
    bubbleContainer.appendChild(b);
}

// ===== LOCAL STORAGE — SAVED ACCOUNTS =====
function getSavedAccounts() {
    try { return JSON.parse(localStorage.getItem('savedAccounts') || '[]'); } catch { return []; }
}
function setSavedAccounts(arr) { localStorage.setItem('savedAccounts', JSON.stringify(arr)); }

function renderSavedAccounts() {
    const accounts = getSavedAccounts();
    const section = document.getElementById('savedAccountsSection');
    const list = document.getElementById('savedAccountsList');
    if (accounts.length === 0) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    list.innerHTML = '';
    accounts.forEach((acc, idx) => {
        const item = document.createElement('div');
        item.className = 'saved-account-item';
        item.innerHTML = `
            <div class="saved-account-info" onclick="loginAsAccount(${idx})">
                <span class="saved-account-name">${acc.username}</span>
                <span class="saved-account-email">${acc.email}</span>
            </div>
            <div class="saved-account-actions">
                <button class="sa-btn edit" onclick="openEditModal(${idx}, event)">Edit</button>
                <button class="sa-btn del" onclick="deleteAccount(${idx}, event)">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function loginAsAccount(idx) {
    const acc = getSavedAccounts()[idx];
    document.getElementById('usernameInput').value = acc.username;
    document.getElementById('emailInput').value = acc.email;
}

function handleLogin() {
    const username = document.getElementById('usernameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const pass = document.getElementById('passInput').value;

    if (!username || !email || !pass) { alert('Please fill all fields'); return; }

    // Save to localStorage
    const accounts = getSavedAccounts();
    const existing = accounts.findIndex(a => a.email === email);
    if (existing === -1) {
        accounts.push({ username, email, loginTime: new Date().toISOString() });
        setSavedAccounts(accounts);
    } else {
        accounts[existing].username = username;
        accounts[existing].loginTime = new Date().toISOString();
        setSavedAccounts(accounts);
    }
    // Save current session
    localStorage.setItem('currentUser', JSON.stringify({ username, email }));

    closeModal();
    showSuccessToast(`Welcome back, ${username}! ✓`);
    document.getElementById('usernameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('passInput').value = '';
}

function openEditModal(idx, event) {
    event.stopPropagation();
    const acc = getSavedAccounts()[idx];
    document.getElementById('editIndex').value = idx;
    document.getElementById('editUsername').value = acc.username;
    document.getElementById('editEmail').value = acc.email;
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    openModal();
}

function saveEdit() {
    const idx = parseInt(document.getElementById('editIndex').value);
    const newUsername = document.getElementById('editUsername').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    if (!newUsername || !newEmail) { alert('Please fill all fields'); return; }
    const accounts = getSavedAccounts();
    accounts[idx].username = newUsername;
    accounts[idx].email = newEmail;
    setSavedAccounts(accounts);
    closeEditModal();
    renderSavedAccounts();
}

function deleteAccount(idx, event) {
    event.stopPropagation();
    if (!confirm('Delete this saved account?')) return;
    const accounts = getSavedAccounts();
    accounts.splice(idx, 1);
    setSavedAccounts(accounts);
    renderSavedAccounts();
}

// ===== MODALS =====
function openModal() {
    document.getElementById('loginModal').style.display = 'flex';
    renderSavedAccounts();
}
function closeModal() { document.getElementById('loginModal').style.display = 'none'; }
function openForgot() { closeModal(); document.getElementById('forgotModal').style.display = 'flex'; }
function closeForgot() { document.getElementById('forgotModal').style.display = 'none'; }

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('loginModal')) closeModal();
    if (e.target === document.getElementById('forgotModal')) closeForgot();
    if (e.target === document.getElementById('editModal')) closeEditModal();
});

// ===== PASSWORD TOGGLE =====
function togglePass() {
    const inp = document.getElementById('passInput');
    const icon = document.getElementById('eyeIcon');
    inp.type = inp.type === 'password' ? 'text' : 'password';
    icon.className = inp.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// ===== TOAST =====
function requireAuth(e) { e.preventDefault(); openModal(); }
function showToast() {}
function hideToast() {}
function showSuccessToast(msg) { console.log(msg); }

// ===== SERVICES =====
function toggleService(card) {
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    if (!isActive) card.classList.add('active');
}

// ===== COUNTERS — triggered when visible =====
function animateCounter(el) {
    if (el.dataset.started === 'true') return;
    el.dataset.started = 'true';
    el.classList.add('animate-in');
    const target = +el.getAttribute('data-target');
    const duration = 2800; const steps = 70;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) { el.innerText = target + '+'; clearInterval(timer); }
        else { el.innerText = Math.floor(current); }
    }, stepTime);
}

// ===== PORTFOLIO CARDS =====
const stage = document.getElementById('cardsStage');
const allPCards = Array.from(stage.querySelectorAll('.pcard'));
const allCardHTML = allPCards.map(c => c.outerHTML);
const totalCards = allCardHTML.length;
let deck = [];
for (let i = 0; i < Math.min(5, totalCards); i++) deck.push(i);
while (deck.length < 5 && deck.length < totalCards) deck.push(deck.length);

const slotStyle = [
    { rotY:  22, tx:  55, scale: 0.76, mr: -75, ml:   0, opacity: 0.50, z: 1 },
    { rotY:  13, tx:  20, scale: 0.87, mr: -48, ml:   0, opacity: 0.78, z: 2 },
    { rotY:   0, tx:   0, scale: 1.12, mr:   0, ml:   0, opacity: 1.00, z: 5 },
    { rotY: -13, tx: -20, scale: 0.87, mr:   0, ml: -48, opacity: 0.78, z: 2 },
    { rotY: -22, tx: -55, scale: 0.76, mr:   0, ml: -75, opacity: 0.50, z: 1 },
];

let deckIndices = [];
for (let i = 0; i < totalCards; i++) deckIndices.push(i);
if (totalCards < 5) { deckIndices = deckIndices.slice(0, totalCards); }

function renderDeck() {
    stage.innerHTML = '';
    const numSlots = Math.min(5, totalCards);
    for (let slot = 0; slot < numSlots; slot++) {
        const dataIdx = deckIndices[slot % deckIndices.length];
        const wrapper = document.createElement('div');
        wrapper.innerHTML = allCardHTML[dataIdx % totalCards];
        const card = wrapper.firstElementChild;
        const s = slotStyle[slot + (5 - numSlots) / 2 | 0] || slotStyle[slot];
        const cs = numSlots === 5 ? slotStyle[slot] : slotStyle[Math.floor((5 - numSlots) / 2) + slot];
        card.style.transform   = `rotateY(${cs.rotY}deg) translateX(${cs.tx}px) scale(${cs.scale})`;
        card.style.opacity     = cs.opacity;
        card.style.zIndex      = cs.z;
        card.style.marginRight = cs.mr + 'px';
        card.style.marginLeft  = cs.ml + 'px';
        card.style.display     = 'block';
        if (slot === Math.floor(numSlots / 2)) {
            card.classList.add('is-center');
            card.style.boxShadow = '0 30px 80px rgba(0,0,0,0.7), 0 0 45px rgba(188,19,254,0.45)';
        }
        card.addEventListener('click', () => {
            const steps = slot - Math.floor(numSlots / 2);
            if (steps !== 0) rotateDeck(steps);
        });
        stage.appendChild(card);
    }
    updateDots();
}

function rotateDeck(steps) {
    if (steps > 0) { for (let i = 0; i < steps; i++) deckIndices.push(deckIndices.shift()); }
    else { for (let i = 0; i < Math.abs(steps); i++) deckIndices.unshift(deckIndices.pop()); }
    renderDeck();
}
function rotateCards(dir) { rotateDeck(dir); }

const dotsContainer = document.getElementById('portfolioDots');
for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot'; dot.dataset.target = i;
    // dot.addEventListener('click', () => {
    //     const numSlots = Math.min(5, totalCards);
    //     const centerSlot = Math.floor(numSlots / 2);
    //     const currentCenter = deckIndices[centerSlot];
    //     let steps = i - currentCenter;
    //     // Wrap around for shortest path
    //     if (steps > totalCards / 2) steps -= totalCards;
    //     if (steps < -totalCards / 2) steps += totalCards;
    //     if (steps !== 0) rotateDeck(steps);
    // });
    dotsContainer.appendChild(dot);
}

function updateDots() {
    const numSlots = Math.min(5, totalCards);
    const centerSlot = Math.floor(numSlots / 2);
    const centerIdx = deckIndices[centerSlot];
    document.querySelectorAll('.dot').forEach(d => d.classList.toggle('active', parseInt(d.dataset.target) === centerIdx));
}

// Touch/swipe
let touchStartX = 0, isDragging = false;
// stage.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; isDragging = true; }, { passive: true });
// stage.addEventListener('touchmove', (e) => { if (isDragging && Math.abs(e.touches[0].clientX - touchStartX) > Math.abs(e.touches[0].clientY - touchStartX)) e.preventDefault(); }, { passive: false });
// stage.addEventListener('touchend', (e) => {
//     if (!isDragging) return; isDragging = false;
//     const dx = e.changedTouches[0].clientX - touchStartX;
//     if (Math.abs(dx) > 40) rotateDeck(dx < 0 ? 1 : -1);
// }, { passive: true });
let mouseStartX = 0, mouseDown = false;
stage.addEventListener('mousedown', (e) => { mouseStartX = e.clientX; mouseDown = true; });
stage.addEventListener('mouseup', (e) => { if (!mouseDown) return; mouseDown = false; const dx = e.clientX - mouseStartX; if (Math.abs(dx) > 50) rotateDeck(dx < 0 ? 1 : -1); });
stage.addEventListener('mouseleave', () => { mouseDown = false; });

renderDeck();

// ===== CONTACT SECTION ANIMATION =====
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('contact-visible');
            const items = entry.target.querySelectorAll('.contact-item');
            items.forEach((item, i) => {
                setTimeout(() => item.classList.add('item-visible'), 150 + i * 100);
            });
            contactObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
const contactSection = document.querySelector('.contact-social');
if (contactSection) contactObserver.observe(contactSection);

// ===== SKILLS BAR =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.querySelectorAll('.bar-fill').forEach(fill => {
            fill.style.width = entry.isIntersecting ? fill.getAttribute('data-width') : '0';
        });
    });
}, { threshold: 0.3 });
const skillsSection = document.querySelector('.skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ===== SCROLL REVEAL + COUNTER TRIGGER =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger counters inside this element
            entry.target.querySelectorAll('.counter').forEach(animateCounter);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// Service cards animated reveal
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card');
            cards.forEach((card, i) => {
                setTimeout(() => card.classList.add('card-visible'), i * 120);
            });
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
const serviceGrid = document.querySelector('.service-grid');
if (serviceGrid) serviceObserver.observe(serviceGrid);

// Flip cards animated reveal
const flipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.flip-card');
            cards.forEach((card, i) => {
                setTimeout(() => card.classList.add('card-visible'), i * 180);
            });
            flipObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
const reviewsGrid = document.querySelector('.reviews-grid');
if (reviewsGrid) flipObserver.observe(reviewsGrid);

// Counters in hero — trigger when hero stats visible
const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.counter').forEach(animateCounter);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats').forEach(el => heroStatsObserver.observe(el));

// Hero reveals on load
setTimeout(() => {
    document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right').forEach(el => el.classList.add('visible'));
}, 300);
