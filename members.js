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

// Supabase setup
const eventsList = document.getElementById('events-list');

// fetch events
async function fetchEventsMember() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

    if (error) {
        console.error("fetchEventsMember:", error.message);
        eventsList.innerHTML = '<p class="no-events">Error loading events</p>';
        return;
    }

    displayEventsMember(data);
}

function displayEventsMember(events) {
    eventsList.innerHTML = '';

    if (!events || events.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No events currently</p>';
        return;
    }

    events.forEach((event) => {
        const div = document.createElement('div');
        div.className = 'event';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = event.title;

        const countdownSpan = document.createElement('span');
        countdownSpan.id = `countdown-${event.id}`;

        div.appendChild(titleSpan);
        div.appendChild(countdownSpan);
        eventsList.appendChild(div);

        // live countdown
        const eventTime = new Date(event.event_date).getTime();
        setInterval(() => {
            const now = Date.now();
            const diff = eventTime - now;
            const el = document.getElementById(`countdown-${event.id}`);

            if (diff <= 0) {
                el.textContent = 'Event started!';
            } else {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                el.textContent = `${d}d ${h}h ${m}m ${s}s`;
            }
        }, 1000);
    });
}

// initial load
fetchEventsMember();

// Page Switching (unchanged)
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
// Auto logout on tab close or inactivity (Supabase)

let lastActivity = Date.now();

["click", "mousemove", "keydown", "scroll"].forEach(event => {
  document.addEventListener(event, () => {
    lastActivity = Date.now();
  });
});

setInterval(async () => {
  const IDLE_LIMIT = 10 * 60 * 1000; // 10 minutes
  if (Date.now() - lastActivity > IDLE_LIMIT) {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  }
}, 60000);
