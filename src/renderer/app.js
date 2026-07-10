import { createTask, deleteTask, createList } from '../logic/taskManager.js';

let lists = [];

window.storage.getTasks().then(loadedLists => {
    lists = loadedLists;
    loadLists();
    loadTaskElements(lists[0]);
})

window.onload = () => {
    let input = document.querySelector('#item-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            addTask();
        }
    });

    let title = document.querySelector('#title');
    title.addEventListener('click', (e) => {
        showTitleInput(title);
    });

    document.querySelector('#add-button').addEventListener('click', () => {
        if (input.value.trim() === '') return;
        addTask();
    });

    document.querySelector('#close-button').addEventListener('click', () => {
        window.app.closeWindow();
    });

    document.querySelector('#minimize-button').addEventListener('click', () => {
        window.app.minimizeWindow();
    });

    document.querySelector('#list-select').addEventListener('change', (e) => {
        let list = lists.find(list => list.id === e.target.value);
        document.querySelector('#title').textContent = list.title;
        document.querySelectorAll('.list-item').forEach(element => {
            element.remove();
        })
        loadTaskElements(list);
    });
}




// This adds a task from the UI and saves it
let addTask = () => {
    const itemInput = document.querySelector('#item-input');
    
    let newTask = createTask(itemInput.value, lists.length + 1);

    // find current list by select value 
    let list = lists.find(list => list.id === document.querySelector('#list-select').value);

    list.tasks.push(newTask);

    window.storage.saveTasks(lists);

    createTaskElement(newTask);
    itemInput.value = '';
}

function removeTask(task) {
    lists = deleteTask(lists, task.id);
    window.storage.saveTasks(lists);
}


function showInput(element, task) {

    element.querySelector('span').hidden = true;

    let input = element.querySelector('input');
    input.hidden = false;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            task.title = input.value;
            window.storage.saveTasks(lists);
            element.innerHTML = buildTaskElementString(task);

            configureTaskElement(element, task);
        }
    });

    input.addEventListener('blur', () => {
        element.innerHTML = buildTaskElementString(task);
        configureTaskElement(element, task);
    });

}

function showTitleInput(element) {

    element.hidden = true;
    let input = document.querySelector('#title-input');
    input.hidden = false;
    input.value = element.textContent;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            element.textContent = input.value;
            input.hidden = true;
            element.hidden = false;
        }
    });

    input.addEventListener('blur', () => {
        element.textContent = input.value;
        input.hidden = true;
        element.hidden = false;
    });
}

let loadLists = () => {
    lists.map(list => {
        let listElement = document.createElement('option');
        listElement.value = list.id;
        listElement.textContent = list.title;
        document.querySelector('#list-select').appendChild(listElement);
        document.querySelector('#title').textContent = lists[0].title;
    })
}

// loads imported lists
let loadTaskElements = (list) => {
    list.tasks.map(task => {
        createTaskElement(task);
    });
}

// This generates the HTML for a task
function createTaskElement(task) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('list-item')
    taskElement.innerHTML = buildTaskElementString(task);
    document.querySelector('#todo-list').appendChild(taskElement);

    configureTaskElement(taskElement, task);
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
            <input hidden="true" type="text" value="${task.title}">
            <button class="delete-button">-</button>
    `;
}
