// Welcome Popup
window.addEventListener('load', () => {
    const popup = document.getElementById('welcome-popup');
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
            document.getElementById('dashboard-title').classList.remove('hidden');
        }, 500);
    }, 2002);
});

// Supabase client setup
const eventsList = document.getElementById('events-list');
const form = document.getElementById('event-form');

let events = []; // ⚠ declare globally

// Load events on admin page
async function fetchEventsAdmin() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

    if (error) {
        console.error("fetchEventsAdmin:", error.message);
        eventsList.innerHTML = '<p class="no-events">Error loading events</p>';
        return;
    }
    events = data; // ✅ assign, don't use `let`
    displayEventsAdmin();
}


// display/admin events
function displayEventsAdmin() {
    eventsList.innerHTML = '';

    if (!events || events.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No events currently</p>';
        return;
    }

    events.forEach((event) => {
        const div = document.createElement('div');
        div.className = 'event';
        div.id = `event-${event.id}`;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = event.title;

        const dateSpan = document.createElement('span');
        const d = new Date(event.event_date);
        dateSpan.textContent = ` — ${d.toDateString()}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '12px';
        deleteBtn.addEventListener('click', async () => {
            await deleteEvent(event.id);
        });

        div.appendChild(titleSpan);
        div.appendChild(dateSpan);
        div.appendChild(deleteBtn);
        eventsList.appendChild(div);
    });
}

// ADD event
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;

    if (!title || !date) return;

    const { error } = await supabase
        .from('events')
        .insert({ title: title, event_date: new Date(date).toISOString() });

    if (error) {
        console.error("add event error:", error.message);
    } else {
        document.getElementById('event-title').value = '';
        document.getElementById('event-date').value = '';
        fetchEventsAdmin();
    }
});

// DELETE event
async function deleteEvent(id) {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("delete event error:", error.message);
    } else {
        fetchEventsAdmin();
    }
}

// initial load
events = [];

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
