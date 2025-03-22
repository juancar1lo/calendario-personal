let currentDate = new Date();
let selectedDay = null;
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

function cleanPastEvents() {
    const today = new Date();
    for (let dateKey in events) {
        const [year, month, day] = dateKey.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        if (eventDate < today) {
            delete events[dateKey];
        }
    }
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function renderCalendar() {
    const monthYear = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    const eventList = document.getElementById('eventList');
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const today = new Date();

    // Limpiar eventos pasados
    cleanPastEvents();

    monthYear.textContent = `${currentDate.toLocaleString('es', { month: 'long' })} ${currentDate.getFullYear()}`;
    calendarDays.innerHTML = '';
    eventList.innerHTML = '';

    // Días de la semana
    const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    weekdays.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.style.fontWeight = 'bold';
        if (index === 5 || index === 6) { // Sábado (5) y Domingo (6)
            dayElement.classList.add('weekend-column');
        }
        calendarDays.appendChild(dayElement);
    });

    // Espacios vacíos antes del primer día (sin fondo rojo)
    for (let i = 0; i < (firstDay.getDay() + 6) % 7; i++) {
        calendarDays.appendChild(document.createElement('div'));
    }

    // Días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.classList.add('day');

        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayElement.classList.add('weekend-column');
        }

        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
        if (events[dateKey]) {
            dayElement.classList.add('event-day');
        }

        if (today.getDate() === i &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()) {
            dayElement.classList.add('current-day');
        }

        dayElement.onclick = () => selectDay(i, dayElement);
        calendarDays.appendChild(dayElement);
    }

    // Mostrar eventos en la agenda
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
        if (events[dateKey]) {
            const li = document.createElement('li');
            li.textContent = `${i} de ${currentDate.toLocaleString('es', { month: 'long' })}: ${events[dateKey]}`;
            eventList.appendChild(li);
        }
    }
}

function selectDay(day, element) {
    selectedDay = day;
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    document.getElementById('eventInput').value = events[dateKey] || '';
    document.getElementById('eventInput').focus();
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function prevYear() {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    renderCalendar();
}

function nextYear() {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    renderCalendar();
}

document.getElementById('eventInput').addEventListener('change', (e) => {
    if (selectedDay) {
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
        if (e.target.value) {
            events[dateKey] = e.target.value;
        } else {
            delete events[dateKey];
        }
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        renderCalendar();
    }
});

// Inicializar el calendario
renderCalendar();