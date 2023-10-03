const value_form = document.getElementById('item');
const form = document.querySelector('.form');
const submit_btn = document.getElementById('submit');
const clear_btn = document.querySelector('.clear');
const list = document.querySelector('.list');
const alert_banner = document.querySelector('.alert-banner');

clear_btn.classList.add('hide');

// edit option
let edit_element;
let edit_flag = false;
let edit_id = '';

// functions
const addId = () => {
    return new Date().getTime().toString();
};

const displayAlert = (text, action) => {
    alert_banner.textContent = text;
    alert_banner.classList.add(`alert-${action}`);

    setTimeout(() => {
        alert_banner.textContent = '';
        alert_banner.classList.remove(`alert-${action}`);    
    }, 1000);
}

const resetToDefault = () => {
    value_form.value = '';
    edit_flag = false;
    edit_id = '';
    submit_btn.textContent = 'Submit';
}

const editItem = (e) => {
    submit_btn.textContent = 'Edit';

    const element = e.currentTarget.parentElement.parentElement;
    edit_element = e.currentTarget.parentElement.previousElementSibling;

    value_form.value = edit_element.textContent;
    edit_flag = true;
    edit_id = element.dataset.id;
}

const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);

    if(list.children.length > 0) {
        clear_btn.classList.add('visible');
        clear_btn.classList.remove('hide');
    } else {
        clear_btn.classList.remove('visible');
        clear_btn.classList.add('hide');
    }        
 
    displayAlert('Removed', 'error');
    resetToDefault();
    removeFromLocalStorage(id);
}

const clearItems = () => {
    const items = document.querySelectorAll('.todo-item');

    if(items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        })
    }

    clear_btn.classList.remove('visible');
    clear_btn.classList.add('hide');

    displayAlert('Success!', 'success');
    resetToDefault();
    localStorage.removeItem('list');
}

const setupItems = () => {
    const items = getLocalStorage();

    if(items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value);
        })

        if(list.children.length > 0) {
            clear_btn.classList.add('visible');
            clear_btn.classList.remove('hide');
        } else {
            clear_btn.classList.remove('visible');
            clear_btn.classList.add('hide');
        }        
    }
}

const createListItem = (id, value) => {
    const element = document.createElement('div');
    element.classList.add('todo-item');
    element.setAttribute('data-id', id);

    element.innerHTML = `<p>${value}</p>
    <div class="todo-button">
        <button id="edit" class="edit">&#9998;</button>
        <button id="remove" class="remove">-</button>    
    </div>`

    const edit_btn = element.querySelector('.edit');
    const remove_btn = element.querySelector('.remove');
    
    remove_btn.addEventListener('click', deleteItem);
    edit_btn.addEventListener('click', editItem);

    list.appendChild(element);
}

const addItem = (item) => {
    const value = item;
    const id = addId();

    if(value && !edit_flag) {
        createListItem(id, value);

        saveToLocalStorage(id, value);
        resetToDefault();

        if(list.children.length > 0) {
            clear_btn.classList.add('visible');
            clear_btn.classList.remove('hide');
        } else {
            clear_btn.classList.remove('visible');
            clear_btn.classList.add('hide');
        }        

        displayAlert('Success!', 'success');
    } else if (value && edit_flag) {
        edit_element.textContent = value;

        displayAlert('Edit Success!', 'success');
        editLocalStorage(edit_id, value);
        resetToDefault();
    } else {
        displayAlert('Please input a value!', 'error');
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    addItem(value_form.value);
});

clear_btn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);

// save to local storage
const saveToLocalStorage = (id, value) => {
    const item = {
        id, value
    };

    const items = getLocalStorage();

    items.push(item);

    localStorage.setItem('list', JSON.stringify(items));
}

const removeFromLocalStorage = (id) => {
    let items = getLocalStorage();

    items = items.filter((a) => (a.id != id));

    localStorage.setItem('list', JSON.stringify(items));
}

const editLocalStorage = (id, value) => {
    let items = getLocalStorage();

    items.map((a) => {
        if(a.id == id) {
            a.value = value;
        }

        return a;
    });
    
    localStorage.setItem('list', JSON.stringify(items));
}

const getLocalStorage = () => {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}