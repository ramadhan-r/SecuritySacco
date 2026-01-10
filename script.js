// Welcome Popup
window.addEventListener('load', () => {
    const popup = document.getElementById('welcome-popup');
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
            document.getElementById('dashboard-title').classList.remove('hidden');
        }, 500);
    }, 2000);
});

// Event Management
const form = document.getElementById('event-form');
const eventsList = document.getElementById('events-list');
let events = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    if (!title || !date) return;

    const event = { title, date: new Date(date) };
    events.push(event);
    document.getElementById('event-title').value = '';
    document.getElementById('event-date').value = '';
    updateEvents();
});

// Update Events Display
function updateEvents() {
    eventsList.innerHTML = '';
    if (events.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No events currently</p>';
        return;
    }

    events.forEach((event, index) => {
        const div = document.createElement('div');
        div.className = 'event';
        div.id = `event-${index}`;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = event.title;

        const countdownSpan = document.createElement('span');
        countdownSpan.id = `countdown-${index}`;
        countdownSpan.textContent = '';

        div.appendChild(titleSpan);
        div.appendChild(countdownSpan);
        eventsList.appendChild(div);
    });
}

// Countdown Timer
setInterval(() => {
    events.forEach((event, index) => {
        const now = new Date();
        const diff = event.date - now;
        const countdownEl = document.getElementById(`countdown-${index}`);
        if (diff <= 0) {
            countdownEl.textContent = 'Event started!';
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    });
}, 1000);

// Page Switching
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
        document.getElementById(`${page}-section`).classList.remove('hidden');

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});
