export function createTask(title, newID) {
    let newTask = {
        id: newID,
        title: title
    };

    return newTask;
}

export function deleteTask(tasks, id) {
    return tasks.filter(task => task.id !== id);
}