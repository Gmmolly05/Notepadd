let tasks = [];

window.storage.getTasks().then(loadedTasks => {
    tasks = loadedTasks;
    loadTasks();
})

window.onload = () => {
    loadTasks();

    let input = document.querySelector('#item-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value !== '') {
            createTask();
        }
    });


}

document.querySelector('#add-button').addEventListener('click', () => {
    createTask();
});

let loadTasks = () => {
    tasks.map(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-item')
        listItem.textContent = task.title;
        document.querySelector('#todo-list').appendChild(listItem);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        listItem.appendChild(deleteButton);

        deleteButton.addEventListener('click', () => {
            listItem.remove();
        });
    })
}

let createTask = () => {
    const itemInput = document.querySelector('#item-input');
    const listItem = document.createElement('li');
    listItem.classList.add('list-item')
    listItem.textContent = itemInput.value;
    document.querySelector('#todo-list').appendChild(listItem);
    itemInput.value = '';

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    listItem.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        listItem.remove();
    });

    setListItem(itemInput.value);
}




