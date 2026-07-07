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
            createTaskUI();
        }
    });
}

document.querySelector('#add-button').addEventListener('click', () => {
    createTaskUI();
});

// loads tasks from storage
let loadTasks = () => {
    tasks.map(task => {
        createTaskElement(task);
    })
}

// This creates a task from the UI and saves it
let createTaskUI = () => {
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
    taskElement.textContent = task.title;
    document.querySelector('#todo-list').appendChild(taskElement);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    taskElement.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        taskElement.remove();
    });
}

