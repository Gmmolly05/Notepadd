
export function createTask(title) {
    let newTask = {
        id: crypto.randomUUID(),
        title: title
    };

    return newTask;
}

export function deleteTask(tasks, id) {
    return tasks.filter(task => task.id !== id);
}