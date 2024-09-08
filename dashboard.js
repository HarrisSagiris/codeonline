// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // Toggle project management panel
    const pmIcon = document.getElementById('pm-icon');
    const pmPanel = document.getElementById('pm-panel');
    
    window.togglePMPanel = () => {
        if (pmPanel.style.display === 'none' || pmPanel.style.display === '') {
            pmPanel.style.display = 'block';
        } else {
            pmPanel.style.display = 'none';
        }
    };

    // Task management
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    addTaskBtn.addEventListener('click', () => {
        const task = prompt('Enter new task:');
        if (task) {
            const li = document.createElement('li');
            li.textContent = task;
            taskList.appendChild(li);
        }
    });

    // Milestone management
    const milestoneList = document.getElementById('milestone-list');
    const addMilestoneBtn = document.getElementById('add-milestone-btn');
    
    addMilestoneBtn.addEventListener('click', () => {
        const milestone = prompt('Enter new milestone:');
        if (milestone) {
            const li = document.createElement('li');
            li.textContent = milestone;
            milestoneList.appendChild(li);
        }
    });
});
