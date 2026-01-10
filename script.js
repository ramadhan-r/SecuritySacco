// Supabase Client
const SUPABASE_URL = 'https://sydynixecbokrttohcvr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Re78GtQWMIxAvz8z0kX3mA_hhL0TC60';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// Fetch events from Supabase
async function fetchEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
    if (error) {
        console.error('Error fetching events:', error);
        return;
    }
    events = data.map(ev => ({
        title: ev.title,
        date: new Date(ev.event_date)
    }));
    updateEvents();
}

// Add new event
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    if (!title || !date) return;

    // Convert to ISO for Supabase
    const eventDate = new Date(date).toISOString();

    const { data, error } = await supabase
        .from('events')
        .insert([{ title, event_date: eventDate }]);

    if (error) {
        alert('Failed to add event: ' + error.message);
        return;
    }

    document.getElementById('event-title').value = '';
    document.getElementById('event-date').value = '';
    fetchEvents(); // refresh
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
        if (!countdownEl) return;
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

// Initial fetch
fetchEvents();

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
