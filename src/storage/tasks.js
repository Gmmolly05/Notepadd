import fs from 'fs';

export function loadTasks(dataPath) {
    try {
        const data = fs.readFileSync(dataPath, "utf-8");
        let parsedData = JSON.parse(data);

        if(!parsedData[0].version) return [];

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

