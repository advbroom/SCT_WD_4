const titleInput = document.getElementById('task-title');
const noteInput = document.getElementById('task-note');
const datetimeInput = document.getElementById('task-datetime');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const calendarDates = document.getElementById('calendar-dates');
const selectedDateLabel = document.getElementById('selected-date-label');
const selectedDateTaskList = document.getElementById('selected-date-task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let selectedDate = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0]; // 'YYYY-MM-DD'
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    li.innerHTML = `
      <strong>${task.title}</strong>
      <br><small>${new Date(task.datetime).toLocaleString()}</small>
      <p>${task.note}</p>
      <div class="task-controls">
        <button onclick="toggleComplete(${index})">✅</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  renderCalendar();
  renderSelectedDateTasks();
}

function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendarDates.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    calendarDates.appendChild(document.createElement('div'));
  }

  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const dateStr = formatDate(date);

    const dateDiv = document.createElement('div');
    dateDiv.className = 'calendar-date';
    dateDiv.textContent = d;

    if (selectedDate === dateStr) {
      dateDiv.classList.add('active');
    }

    if (tasks.some(task => formatDate(task.datetime) === dateStr)) {
      dateDiv.classList.add('task-day');
    }

    dateDiv.onclick = () => {
      selectedDate = dateStr;
      selectedDateLabel.textContent = new Date(dateStr).toDateString();
      renderTasks();
    };

    calendarDates.appendChild(dateDiv);
  }
}

function renderSelectedDateTasks() {
  selectedDateTaskList.innerHTML = '';
  if (!selectedDate) return;

  const filtered = tasks.filter(task => formatDate(task.datetime) === selectedDate);
  if (filtered.length === 0) {
    selectedDateTaskList.innerHTML = '<li>No tasks on this day.</li>';
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${task.title}</strong><br><small>${task.note}</small>`;
    selectedDateTaskList.appendChild(li);
  });
}

function addTask() {
  const title = titleInput.value.trim();
  const note = noteInput.value.trim();
  const datetime = datetimeInput.value;

  if (!title || !datetime) {
    alert('Enter task and date/time!');
    return;
  }

  tasks.push({ title, note, datetime, completed: false });
  saveTasks();
  renderTasks();

  titleInput.value = '';
  noteInput.value = '';
  datetimeInput.value = '';
  titleInput.focus();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm('Delete task?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const newTitle = prompt('Edit title:', tasks[index].title);
  const newNote = prompt('Edit note:', tasks[index].note);
  if (newTitle !== null) tasks[index].title = newTitle;
  if (newNote !== null) tasks[index].note = newNote;
  saveTasks();
  renderTasks();
}

renderTasks();
