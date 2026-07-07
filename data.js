const list = [
    {
        id: 1,
        text: 'Hello Item 1'
    },
    {
        id: 2,
        text: 'Goodbye Item 2'
    },
    {
        id: 3,
        text: 'Spank me Item 3'
    }
];

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