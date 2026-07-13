import { createTask, deleteTask, createList } from '../logic/taskManager.js';

let lists = [];

window.storage.getTasks().then(loadedLists => {
    lists = loadedLists;
    loadLists();
    if (lists.length === 0) addList();
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

    let listSelect = document.querySelector('#list-select');
    listSelect.addEventListener('change', (e) => {
        swapLists(listSelect);
    });

    document.querySelector('#add-list-button').addEventListener('click', () => {
        addList();
        listSelect.value = lists[lists.length - 1].id;
        swapLists(listSelect);
    });

    document.querySelector('#delete-list').addEventListener('click', () => {
        deleteList();
        listSelect.value = lists[0].id;
        swapLists(listSelect);
    })

}

let checkNoTasks = () => {
    let id = document.querySelector('#list-select').value;
    if (lists.find(list => list.id === id).tasks.length === 0) showNoTasks();
    else hideNoTasks();
}

let showNoTasks = () => {
    let noTasks = document.querySelector('#no-tasks');
    noTasks.hidden = false;
    noTasks.display = "flex";
    let listElement = document.querySelector('#list')
    listElement.display = 'none';
    listElement.classList.add('empty');
}

let hideNoTasks = () => {
    let noTasks = document.querySelector('#no-tasks');
    noTasks.hidden = true;
    noTasks.display = "none";
    let listElement = document.querySelector('#list')
    listElement.display = 'flex';
    listElement.classList.remove('empty');
}

let deleteList = () => {
    let list = lists.find(list => list.id === document.querySelector('#list-select').value);
    lists = lists.filter(list => list.id !== document.querySelector('#list-select').value);
    saveTasks();
    document.querySelector('#list-select').removeChild(document.querySelector('#list-select').selectedOptions[0]);
}

let addList = () => {
    let newList = createList();
    lists.push(newList);
    saveTasks();
    let listElement = document.createElement('option');
    listElement.value = newList.id;
    listElement.textContent = newList.title;
    document.querySelector('#list-select').appendChild(listElement);
    showNoTasks();
}

let swapLists = (e) => {
    let list = lists.find(list => list.id === e.value);
    document.querySelector('#title').textContent = list.title;
    document.querySelectorAll('.list-item').forEach(element => {
        element.remove();
    })
    loadTaskElements(list);
    checkNoTasks();
}

// This adds a task from the UI and saves it
let addTask = () => {
    const itemInput = document.querySelector('#item-input');

    let newTask = createTask(itemInput.value, lists.length + 1);

    // find current list by select value 
    let list = lists.find(list => list.id === document.querySelector('#list-select').value);

    list.tasks.push(newTask);

    saveTasks();

    createTaskElement(newTask);
    itemInput.value = '';
}

function removeTask(task) {
    lists = deleteTask(lists, task.id);
    saveTasks();
}


function showInput(element, task) {

    element.querySelector('span').hidden = true;

    let input = element.querySelector('.name-input');
    input.hidden = false;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            task.title = input.value;
            saveTasks();
            element.innerHTML = buildTaskElementString(task);

            configureTaskElement(element, task);
        }
    });

    input.addEventListener('blur', () => {
        task.title = input.value;
        element.innerHTML = buildTaskElementString(task);
        configureTaskElement(element, task);
    });

}

function showTitleInput(element) {

    function handleChange() {
        element.textContent = input.value;
        input.hidden = true;
        element.hidden = false;
        let currentList = lists.find(list => list.id === document.querySelector('#list-select').value);
        currentList.title = input.value;

        document.querySelectorAll('option').forEach(option => {
            if (option.value === currentList.id) {
                option.textContent = currentList.title;
            }
        });

        saveTasks();
    }

    element.hidden = true;
    let input = document.querySelector('#title-input');
    input.hidden = false;
    input.value = element.textContent;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            handleChange();
        }
    });

    input.addEventListener('blur', () => {
        handleChange();
    });
}

let loadLists = () => {
    lists.map(list => {
        let listElement = document.createElement('option');
        listElement.value = list.id;
        listElement.textContent = list.title;
        document.querySelector('#list-select').appendChild(listElement);
        document.querySelector('#title').textContent = lists[0].title;
    });
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

    taskElement.querySelector('.completed').addEventListener('change', (e) => {
        task.completed = e.target.checked;
        saveTasks();
    });

}

function buildTaskElementString(task) {
    return `
            <input class="completed" type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.title}</span>
            <input class="name-input" hidden="true" type="text" value="${task.title}">
            <button class="delete-button">-</button>
    `;
}

function saveTasks() {
    window.storage.saveTasks(lists).then(() => {
        checkNoTasks();
    });
}