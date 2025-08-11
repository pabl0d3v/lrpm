// script.js
let currentUser = '';
let onboardings = JSON.parse(localStorage.getItem('onboardings')) || [];

const onboardingTemplateTasks = [
    { task: 'Rec Jasmin/Gigi', assigned: ['Jasmin', 'Gigi'], completed: false },
    { task: 'Interview Gigi', assigned: ['Gigi'], completed: false },
    { task: 'Sending package', assigned: ['Gigi', 'George'], completed: false },
    { task: 'Follow up on signing the package', assigned: ['George'], completed: false },
    { task: 'Charge the agent', assigned: ['Gigi'], completed: false },
    { task: 'Gigi to sign', assigned: ['Gigi'], completed: false },
    { task: 'Adding the agent to DBPR', assigned: ['Gigi'], completed: false },
    { task: 'Add the agent to my agent account', assigned: ['Gigi', 'George'], completed: false },
    { task: 'Following up on my agent account', assigned: ['George'], completed: false },
    { task: 'Welcome email/post', assigned: ['Yousef'], completed: false },
    { task: 'Follow up by Yousef', assigned: ['Yousef'], completed: false },
    { task: 'Gigi to get feedback from the agent', assigned: ['Gigi'], completed: false }
];

function login() {
    currentUser = document.getElementById('user-select').value;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    if (currentUser === 'Yousef') {
        document.getElementById('add-agent-btn').classList.remove('hidden');
    }
    renderCards();
}

function addAgent() {
    if (currentUser !== 'Yousef') return;
    const name = prompt('Enter the new agent\'s name:');
    if (name) {
        const newTasks = onboardingTemplateTasks.map(task => ({ ...task }));
        onboardings.push({ name, tasks: newTasks });
        saveData();
        renderCards();
    }
}

function removeAgent(index) {
    if (currentUser !== 'Yousef') return;
    if (confirm('Are you sure you want to remove this agent?')) {
        onboardings.splice(index, 1);
        saveData();
        renderCards();
    }
}

function updateTask(agentIndex, taskIndex, checked) {
    const task = onboardings[agentIndex].tasks[taskIndex];
    if (task.assigned.includes(currentUser)) {
        task.completed = checked;
        saveData();
        renderCards();
    } else {
        // Revert if somehow checked
        renderCards();
    }
}

function renderCards() {
    const cardsContainer = document.getElementById('onboarding-cards');
    cardsContainer.innerHTML = '';
    onboardings.forEach((onboarding, agentIndex) => {
        const card = document.createElement('div');
        card.className = 'mb-6 p-4 border rounded shadow bg-gray-50';
        
        const header = document.createElement('h2');
        header.className = 'text-xl font-semibold mb-4';
        header.textContent = `Agent: ${onboarding.name}`;
        if (currentUser === 'Yousef') {
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            removeBtn.className = 'float-right text-red-500 hover:text-red-700';
            removeBtn.onclick = () => removeAgent(agentIndex);
            header.appendChild(removeBtn);
        }
        card.appendChild(header);
        
        const tasksList = document.createElement('div');
        onboarding.tasks.forEach((task, taskIndex) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'flex items-center mb-2';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.className = 'mr-2';
            const isAssigned = task.assigned.includes(currentUser);
            if (!isAssigned) {
                checkbox.disabled = true;
                taskDiv.classList.add('task-disabled');
            }
            checkbox.onchange = (e) => updateTask(agentIndex, taskIndex, e.target.checked);
            
            const label = document.createElement('span');
            label.textContent = `${task.task} (Assigned to: ${task.assigned.join(', ')})`;
            if (task.completed) {
                label.classList.add('task-completed');
            }
            
            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(label);
            tasksList.appendChild(taskDiv);
        });
        card.appendChild(tasksList);
        cardsContainer.appendChild(card);
    });
}

function saveData() {
    localStorage.setItem('onboardings', JSON.stringify(onboardings));
}