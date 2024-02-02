 // Array para almacenar las tareas
 let tasks = [];

 // Variables para guardar el índice de la tarea en edición y el estado de la edición
 let editingIndex = -1;
 let isEditing = false;

 function addTask() {
    
    const taskInput = document.getElementById('taskInput');
    const taskDeadlineInput = document.getElementById('taskDeadlineInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect'); // Nuevo elemento para seleccionar la categoría
    const task = taskInput.value.trim();
    const deadline = taskDeadlineInput.value ? new Date(taskDeadlineInput.value) : null;
    const priority = prioritySelect.value;
    const category = categorySelect.value; // Obtener el valor de categoría seleccionado

    if (task !== '') {
        // Mostrar una notificación al usuario
        const notificationTitle = 'Nueva tarea agregada';
        const notificationBody = 'Se ha agregado una nueva tarea: ' + task;

        // Solicitar permiso para notificaciones
        if ('Notification' in window) {
            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    // Mostrar la notificación
                    showNotification(notificationTitle, notificationBody);
                }
            });
        }

        // Asignar la misma fecha y hora de vencimiento como recordatorio
        const reminderTime = deadline;
        tasks.push({ text: task, completed: false, deadline: deadline, priority: priority, category: category, reminderTime: reminderTime  }); // Incluir la categoría en el objeto de tarea
        renderTasks();
        taskInput.value = '';
        taskDeadlineInput.value = '';
    } else {
        alert('Por favor ingresa una tarea válida.');
    }
}



// Verificar las tareas pendientes periódicamente
function checkReminders() {
    setInterval(() => {
        const now = new Date();
        tasks.forEach(task => {
            // Verificar si la tarea tiene una fecha de recordatorio y si es el momento de mostrarla
            if (task.deadline && task.reminderTime && now >= task.reminderTime) {
                showNotification('Recordatorio: ' + task.text, 'Recuerda completar la tarea: ' + task.text);
            }
        });
    }, 60000); // Verificar cada 60 segundos
}




function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.style.textDecoration = 'line-through';
        }
        const taskDateTime = document.createElement('span');
        taskDateTime.textContent = task.deadline ? ' - ' + task.deadline.toLocaleString() : '';
        const taskPriority = document.createElement('span');
        taskPriority.textContent = ' - ' + task.priority;
        const taskCategory = document.createElement('span'); // Elemento para mostrar la categoría
        taskCategory.textContent = ' - ' + task.category; // Mostrar la categoría
    
        li.appendChild(taskText);
        li.appendChild(taskDateTime);
        li.appendChild(taskPriority);
        li.appendChild(taskCategory); // Agregar el elemento de categoría
    
        const buttonContainer = document.createElement('div');
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteTask(index);
        buttonContainer.appendChild(deleteButton);
        
        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Marcar como no completada' : 'Marcar como completada';
        toggleButton.onclick = () => toggleTask(index);
        buttonContainer.appendChild(toggleButton);
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editTask(index);
        buttonContainer.appendChild(editButton);
    
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    });
    
}

//Función para eliminar una tarea
 function deleteTask(index) {
     tasks.splice(index, 1);
     renderTasks();
 }

 // Función para marcar una tarea como completada
 function toggleTask(index) {
     tasks[index].completed = !tasks[index].completed;
     renderTasks();
 }

 function editTask(index) {
    editingIndex = index;
    const editTaskInput = document.getElementById('editTaskInput');
    const newTaskInput = document.getElementById('newTaskInput'); // Cambiado el ID
    const taskDeadline = document.getElementById('taskDeadline');
    editTaskInput.value = tasks[index].text;
    taskDeadline.value = tasks[index].deadline ? tasks[index].deadline : '';
    newTaskInput.value = ''; // Limpiar el campo de nueva tarea
    editTaskInput.removeAttribute('readonly'); // Remover el atributo de solo lectura si está presente
    showEditor();
}



function saveTask() {
    const editTaskInput = document.getElementById('editTaskInput');
    const newTaskInput = document.getElementById('newTaskInput');
    const taskDeadline = document.getElementById('taskDeadline');
    const newText = editTaskInput.value.trim();
    const newDeadline = taskDeadline.value ? new Date(taskDeadline.value) : null;
    const newTask = newTaskInput.value.trim();

    if (newText !== '') {
        tasks[editingIndex].text = newText;
        tasks[editingIndex].deadline = newDeadline;

        // Eliminar la tarea anterior del array
        tasks.splice(editingIndex, 1);

        if (newTask !== '') {
            tasks.push({ text: newTask, completed: false, deadline: newDeadline });
        }

        hideEditor();
        renderTasks();
        editingIndex = -1;
    } else {
        alert('Por favor ingresa una tarea válida.');
    }
}




 // Función para cancelar la edición
 function cancelEdit() {
     hideEditor();
     editingIndex = -1;
 }

 

 // Función para mostrar el editor de tareas
 function showEditor() {
     const taskEditor = document.getElementById('taskEditor');
     taskEditor.style.display = 'block';
     const taskInput = document.getElementById('taskInput');
     taskInput.style.display = 'none';
     const taskButtons = document.getElementsByClassName('task-buttons');
     for (let i = 0; i < taskButtons.length; i++) {
         taskButtons[i].style.display = 'inline-block';
     }
     isEditing = true;
 }

 // Función para ocultar el editor de tareas
 function hideEditor() {
     const taskEditor = document.getElementById('taskEditor');
     taskEditor.style.display = 'none';
     const taskInput = document.getElementById('taskInput');
     taskInput.style.display = 'block';
     const taskButtons = document.getElementsByClassName('task-buttons');
     for (let i = 0; i < taskButtons.length; i++) {
         taskButtons[i].style.display = 'none';
     }
     isEditing = false;
 }
// Mostrar una notificación
function showNotification(title, body) {
    if ('Notification' in window) {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                new Notification(title, { body: body });
            }
        });
    }
}

// Iniciar la verificación periódica de tareas pendientes
checkReminders();
console.log(tasks);