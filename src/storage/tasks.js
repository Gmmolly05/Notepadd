import fs from 'fs';

export function loadTasks(dataPath) {
    try {
        const data = fs.readFileSync(dataPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export function saveTasks(dataPath, tasks) {
    fs.writeFileSync(
        dataPath,
        JSON.stringify(tasks, null, 2)
    );
}

