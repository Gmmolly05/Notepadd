let getList = () => {
    return list;
}

let getListItem = (id) => {
    return list.find(item => item.id === id);
}

let setListItem = (text) => {
    let newTask = { id: list.length + 1, text: text };
    list.push(newTask);
    console.log(list);
}

export { getList, getListItem, setListItem };