import { createTask, deleteTask } from '../logic/taskManager.js';

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

    document.querySelector('#add-button').addEventListener('click', () => {
        if(input.value === '') return;
        addTask();
    });

    document.querySelector('#close-button').addEventListener('click', () => {
        window.app.closeWindow();
    });

    document.querySelector('#minimize-button').addEventListener('click', () => {
        window.app.minimizeWindow();
    });

}


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
    taskElement.innerHTML = buildTaskElementString(task);
    document.querySelector('#todo-list').appendChild(taskElement);

    configureTaskElement(taskElement, task);
}

function showInput(element, task) {
    element.innerHTML = `<input type="text" id="item-input" value="${task.title}">`;

    let input = element.querySelector('input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value !== '') {
            task.title = input.value;
            window.storage.saveTasks(tasks);
            element.innerHTML = buildTaskElementString(task);

            configureTaskElement(element, task);
        }
    });

    input.addEventListener('blur', () => {
        element.innerHTML = buildTaskElementString(task);
        configureTaskElement(element, task);
    });

}

function removeTask(task) {
    tasks = deleteTask(tasks, task.id);
    window.storage.saveTasks(tasks);
}

function configureTaskElement(taskElement, task) {

    taskElement.querySelector('span').addEventListener('click', () => {
        showInput(taskElement, task);
    });

    taskElement.querySelector('.delete-button').addEventListener('click', () => {
        removeTask(task);
        taskElement.remove();
    });

}

function buildTaskElementString(task) {
    return `
            <span>${task.title}</span>
            <button class="delete-button">-</button>
    `;
}
