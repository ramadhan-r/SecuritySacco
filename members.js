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

// View-only Events (preloaded demo events)
const eventsList = document.getElementById('events-list');

// Example events for members to view
let events = [
    { title: "Annual SACCO Meeting", date: new Date(new Date().getTime() + 86400000) }, // +1 day
    { title: "Loan Disbursement", date: new Date(new Date().getTime() + 172800000) } // +2 days
];

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

// Initial display
updateEvents();

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
