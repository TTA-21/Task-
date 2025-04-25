// Inicializa Firebase (con la configuración adecuada en index.html)
const db = firebase.firestore();

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value;

    if (task) {
        db.collection('tasks').add({
            text: task,
            completed: false,  // Estado inicial de la tarea
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            taskInput.value = '';
            getTasks();
        });
    }
}

function toggleCompletion(taskId, currentStatus) {
    db.collection('tasks').doc(taskId).update({
        completed: !currentStatus
    }).then(() => {
        getTasks();
    });
}

function deleteTask(taskId) {
    db.collection('tasks').doc(taskId).delete().then(() => {
        getTasks();
    });
}

function getTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    db.collection('tasks').orderBy('createdAt').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const task = doc.data();
            const li = document.createElement('li');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');
            checkbox.checked = task.completed;
            checkbox.onclick = () => toggleCompletion(doc.id, task.completed);

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            if (task.completed) {
                taskText.classList.add('completed');
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTask(doc.id);

            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    });
}

getTasks();