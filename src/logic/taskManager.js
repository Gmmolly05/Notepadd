
export function createList() {
    let list = {
        id: crypto.randomUUID(),
        title: 'New List',
        tasks: []
    };

    return list;
}

export function createTask(title) {
    let newTask = {
        id: crypto.randomUUID(),
        title: title
    };

    return newTask;
}

export function deleteTask(lists, id) {
    return lists.filter(list => list.tasks = list.tasks.filter(task => task.id !== id));
}