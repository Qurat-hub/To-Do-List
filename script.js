// Keys
const STORAGE_KEY = "todo-tasks";
const PRIORITY_STORAGE_KEY = "todo-priorities";

document.addEventListener("DOMContentLoaded", () => {
  // Load theme
  if (localStorage.getItem("mode") === "dark") {
    document.documentElement.classList.add("dark");
  }

  // Load background color
  const savedColor = localStorage.getItem("customBgColor");
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
    const colorPicker = document.getElementById("bgColorPicker");
    if (colorPicker) colorPicker.value = savedColor;
  }

  // Load saved tasks
  const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));

  // Load saved priorities
  const savedPriorities = JSON.parse(localStorage.getItem(PRIORITY_STORAGE_KEY)) || [];
  savedPriorities.forEach(p => addPriority(p.text, p.completed));

  // Start time update
  updateTime();
  setInterval(updateTime, 1000);
});

// Update time
function updateTime() {
  const timeElement = document.getElementById("current-time");
  if (!timeElement) return;

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Background color picker
const colorPicker = document.getElementById("bgColorPicker");
if (colorPicker) {
  colorPicker.addEventListener("input", function () {
    const color = this.value;
    document.body.style.backgroundColor = color;
    localStorage.setItem("customBgColor", color);
  });
}

// Toggle dark/light mode
function togglmode() {
  document.documentElement.classList.toggle("dark");
  const mode = document.documentElement.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("mode", mode);
}

// Add Task
function addTask(taskText, completed = false) {
  const ul = document.getElementById("todo-list");
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const span = document.createElement("span");
  span.textContent = taskText;
  if (completed) span.style.textDecoration = "line-through";

  checkbox.addEventListener("change", () => {
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
    saveTasks();
  });
  
const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.className = "edit-input";
    li.replaceChild(input, span);
    input.focus();

    input.addEventListener("blur", () => {
      span.textContent = input.value.trim();
      li.replaceChild(span, input);
      saveTasks();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        input.blur();
      }
    });
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editBtn);
  ul.appendChild(li);
}

// Add Priority
function addPriority(priorityText, completed = false) {
  const ul = document.getElementById("priority-list");
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const span = document.createElement("span");
  span.textContent = priorityText;
  if (completed) span.style.textDecoration = "line-through";

  checkbox.addEventListener("change", () => {
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
    savePriorities();
  });
const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.className = "edit-input";
    li.replaceChild(input, span);
    input.focus();

    input.addEventListener("blur", () => {
      span.textContent = input.value.trim();
      li.replaceChild(span, input);
      savePriorities();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        input.blur();
      }
    });
  });
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editBtn);
  ul.appendChild(li);
}

// Delete completed tasks
function deleteCompleted() {
  const list = document.getElementById("todo-list");
  list.querySelectorAll("li").forEach(task => {
    if (task.querySelector("input").checked) {
      task.remove();
    }
  });
  saveTasks();
}

// Delete completed priorities
function deleteCompletedPriorities() {
  const list = document.getElementById("priority-list");
  list.querySelectorAll("li").forEach(item => {
    if (item.querySelector("input").checked) {
      item.remove();
    }
  });
  savePriorities();
}

// Delete all tasks
// function deleteAllTasks() {
//   document.getElementById("todo-list").innerHTML = "";
//   saveTasks();
// }

// Delete all priorities
// function deleteAllPriorities() {
//   document.getElementById("priority-list").innerHTML = "";
//   savePriorities();
// }

function deleteAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    document.getElementById("todo-list").innerHTML = "";
    saveTasks();
  }
}

function deleteAllPriorities() {
  if (confirm("Are you sure you want to delete all priorities?")) {
    document.getElementById("priority-list").innerHTML = "";
    savePriorities();
  }
}

// Save tasks
function saveTasks() {
  const list = document.querySelectorAll("#todo-list li");
  const taskToSave = [];

  list.forEach(task => {
    const text = task.querySelector("span").textContent;
    const checked = task.querySelector("input").checked;
    taskToSave.push({ text, completed: checked });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskToSave));
}

// Save priorities
function savePriorities() {
  const list = document.querySelectorAll("#priority-list li");
  const prioritiesToSave = [];

  list.forEach(item => {
    const text = item.querySelector("span").textContent;
    const checked = item.querySelector("input").checked;
    prioritiesToSave.push({ text, completed: checked });
  });

  localStorage.setItem(PRIORITY_STORAGE_KEY, JSON.stringify(prioritiesToSave));
}

// Task input enter
document.getElementById("taskInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && this.value.trim() !== "") {
    addTask(this.value.trim());
    this.value = "";
    saveTasks();
  }
});

// Priority input enter
document.getElementById("priorityInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && this.value.trim() !== "") {
    addPriority(this.value.trim());
    this.value = "";
    savePriorities();
  }
});
