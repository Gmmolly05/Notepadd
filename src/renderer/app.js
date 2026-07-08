import {createTask, deleteTask} from '../logic/taskManager.js';

let tasks = [];

window.storage.getTasks().then(loadedTasks => {
    tasks = loadedTasks;
    loadTasks();
})

window.onload = () => {
    let input = document.querySelector('#item-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value !== '') {
            addTask();
        }
    });
}

document.querySelector('#add-button').addEventListener('click', () => {
    addTask();
});

// loads tasks from storage
let loadTasks = () => {
    tasks.map(task => {
        createTaskElement(task);
    })
}

// This adds a task from the UI and saves it
let addTask = () => {
    const itemInput = document.querySelector('#item-input');
    let newTask = createTask(itemInput.value, tasks.length + 1);

    tasks.push(newTask);

    window.storage.saveTasks(tasks);

    createTaskElement(newTask);
    itemInput.value = '';
}

// This generates the HTML for a task
function createTaskElement(task) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('list-item')
    taskElement.innerHTML = `<span>${task.title}</span>`;
    document.querySelector('#todo-list').appendChild(taskElement);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    taskElement.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        removeTask(task);
        taskElement.remove();
    });
}

function removeTask(task) {
    tasks = deleteTask(tasks, task.id);
    window.storage.saveTasks(tasks);
}

