// ============================================
// 資料管理與 LocalStorage
// ============================================

class DataManager {
    constructor() {
        this.projects = this.loadData('projects') || [];
        this.tasks = this.loadData('tasks') || [];
        this.transactions = this.loadData('transactions') || [];
        this.holidays = this.initHolidays();
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // 初始化台灣節日
    initHolidays() {
        const year = new Date().getFullYear();
        return {
            [`${year}-01-01`]: '元旦',
            [`${year}-02-10`]: '農曆春節',
            [`${year}-02-28`]: '和平紀念日',
            [`${year}-04-04`]: '兒童節',
            [`${year}-04-05`]: '清明節',
            [`${year}-05-01`]: '勞動節',
            [`${year}-06-10`]: '端午節',
            [`${year}-09-17`]: '中秋節',
            [`${year}-10-10`]: '國慶日',
        };
    }

    // 專案相關
    addProject(project) {
        project.id = Date.now().toString();
        project.createdAt = new Date().toISOString();
        project.status = 'active';
        this.projects.push(project);
        this.saveData('projects', this.projects);
        return project;
    }

    getProjects(status = 'active') {
        return this.projects.filter(p => p.status === status);
    }

    getProject(id) {
        return this.projects.find(p => p.id === id);
    }

    updateProject(id, updates) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...updates };
            this.saveData('projects', this.projects);
            return this.projects[index];
        }
        return null;
    }

    deleteProject(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveData('projects', this.projects);
    }

    // 任務相關
    addTask(task) {
        task.id = Date.now().toString();
        task.createdAt = new Date().toISOString();
        task.completed = false;
        this.tasks.push(task);
        
        // 如果是重複任務，生成未來的任務實例
        if (task.recurring && task.recurring !== 'none') {
            this.generateRecurringTasks(task);
        }
        
        this.saveData('tasks', this.tasks);
        return task;
    }

    generateRecurringTasks(task) {
        const startDate = new Date(task.dueDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3); // 生成未來3個月的任務

        if (task.recurring === 'daily') {
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                if (d.getTime() !== startDate.getTime()) {
                    this.createRecurringTaskInstance(task, new Date(d));
                }
            }
        } else if (task.recurring === 'weekly') {
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
                if (d.getTime() !== startDate.getTime()) {
                    this.createRecurringTaskInstance(task, new Date(d));
                }
            }
        } else if (task.recurring === 'custom' && task.weekdays) {
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                if (task.weekdays.includes(d.getDay().toString())) {
                    if (d.getTime() !== startDate.getTime()) {
                        this.createRecurringTaskInstance(task, new Date(d));
                    }
                }
            }
        }
    }

    createRecurringTaskInstance(originalTask, date) {
        const newTask = {
            ...originalTask,
            id: `${originalTask.id}-${date.getTime()}`,
            dueDate: date.toISOString().split('T')[0],
            parentTaskId: originalTask.id,
            completed: false
        };
        this.tasks.push(newTask);
    }

    getTasks(date = null) {
        if (date) {
            return this.tasks.filter(t => t.dueDate === date);
        }
        return this.tasks;
    }

    getTasksForProject(projectId) {
        return this.tasks.filter(t => t.projectId === projectId);
    }

    getTodayTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.getTasks(today).filter(t => !t.completed);
    }

    completeTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks[index].completed = true;
            this.tasks[index].completedAt = new Date().toISOString();
            this.saveData('tasks', this.tasks);
            return this.tasks[index];
        }
        return null;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveData('tasks', this.tasks);
    }

    // 交易記錄相關
    addTransaction(transaction) {
        transaction.id = Date.now().toString();
        transaction.createdAt = new Date().toISOString();
        this.transactions.push(transaction);
        this.saveData('transactions', this.transactions);
        return transaction;
    }

    getTransactions(month = null) {
        if (month) {
            return this.transactions.filter(t => t.date.startsWith(month));
        }
        return this.transactions;
    }

    getMonthlyTransactions() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        return this.getTransactions(currentMonth);
    }

    calculateMonthlySummary() {
        const transactions = this.getMonthlyTransactions();
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        return {
            income,
            expense,
            profit: income - expense
        };
    }

    // 節日相關
    getHoliday(date) {
        return this.holidays[date] || null;
    }
}

// ============================================
// UI 控制器
// ============================================

class UIController {
    constructor(dataManager) {
        this.dm = dataManager;
        this.currentWeekStart = this.getWeekStart(new Date());
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.renderWeekCalendar();
        this.renderSummary();
        this.renderProjects();
        this.renderReminders();
        
        // 每分鐘更新時間
        setInterval(() => this.updateDateTime(), 60000);
        
        // 每小時檢查提醒
        setInterval(() => this.checkReminders(), 3600000);
    }

    setupEventListeners() {
        // 週曆導航
        document.getElementById('prevWeek').addEventListener('click', () => {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            this.renderWeekCalendar();
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
            this.renderWeekCalendar();
        });

        // FAB 選單
        const fabBtn = document.getElementById('fabBtn');
        const fabMenu = document.getElementById('fabMenu');
        
        fabBtn.addEventListener('click', () => {
            fabMenu.classList.toggle('active');
        });

        // FAB 選單項目
        document.querySelectorAll('.fab-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                fabMenu.classList.remove('active');
                this.handleFabAction(action);
            });
        });

        // 新增專案按鈕
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.openModal('projectModal');
        });

        // 關閉按鈕
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                this.closeModal(modalId);
            });
        });

        // 取消按鈕
        document.querySelectorAll('[data-modal]').forEach(btn => {
            if (btn.type === 'button' && btn.textContent.includes('取消')) {
                btn.addEventListener('click', (e) => {
                    const modalId = e.target.dataset.modal;
                    this.closeModal(modalId);
                });
            }
        });

        // 模態背景點擊關閉
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // 表單提交
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProjectSubmit(e.target);
        });

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskSubmit(e.target);
        });

        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransactionSubmit(e.target);
        });

        // 重複設定變更
        document.getElementById('recurringSelect').addEventListener('change', (e) => {
            const customGroup = document.getElementById('customRecurringGroup');
            customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
    }

    // 日期時間更新
    updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        const timeStr = now.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit'
        });

        document.getElementById('currentDate').textContent = dateStr;
        document.getElementById('currentTime').textContent = timeStr;
    }

    // 週曆渲染
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    renderWeekCalendar() {
        const weekCalendar = document.getElementById('weekCalendar');
        const weekTitle = document.getElementById('weekTitle');
        
        const weekStart = new Date(this.currentWeekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        weekTitle.textContent = `${weekStart.getMonth() + 1}月 ${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月 ${weekEnd.getDate()}日`;

        let html = '';
        const today = new Date().toISOString().split('T')[0];
        const weekdays = ['一', '二', '三', '四', '五', '六', '日'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const dayTasks = this.dm.getTasks(dateStr);
            const holiday = this.dm.getHoliday(dateStr);

            const isToday = dateStr === today;
            const hasTasks = dayTasks.length > 0;
            const hasHoliday = !!holiday;

            html += `
                <div class="day-item ${isToday ? 'today' : ''} ${hasTasks ? 'has-tasks' : ''} ${hasHoliday ? 'has-holiday' : ''}" 
                     data-date="${dateStr}"
                     title="${holiday || ''}">
                    <div class="day-weekday">${weekdays[i]}</div>
                    <div class="day-number">${date.getDate()}</div>
                </div>
            `;
        }

        weekCalendar.innerHTML = html;

        // 添加日期點擊事件
        weekCalendar.querySelectorAll('.day-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const date = e.currentTarget.dataset.date;
                this.showDayDetail(date);
            });
        });
    }

    showDayDetail(date) {
        const tasks = this.dm.getTasks(date);
        const dateObj = new Date(date);
        const holiday = this.dm.getHoliday(date);

        let content = `
            <div class="detail-section">
                <h3>${dateObj.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}</h3>
                ${holiday ? `<p style="color: var(--accent-gold);">🎉 ${holiday}</p>` : ''}
            </div>
        `;

        if (tasks.length > 0) {
            content += `
                <div class="detail-section">
                    <h3>當日任務</h3>
                    <div class="detail-grid">
            `;
            tasks.forEach(task => {
                const project = this.dm.getProject(task.projectId);
                content += `
                    <div class="detail-item">
                        <span class="detail-label">${task.reminderTime || '全天'}</span>
                        <span class="detail-value">${task.title}${project ? ` (${project.name})` : ''}</span>
                    </div>
                `;
            });
            content += `
                    </div>
                </div>
            `;
        } else {
            content += `
                <div class="detail-section">
                    <p class="empty-message">這天沒有任務</p>
                </div>
            `;
        }

        document.getElementById('projectDetailTitle').textContent = '日期詳情';
        document.getElementById('projectDetailContent').innerHTML = content;
        this.openModal('projectDetailModal');
    }

    // 收支總覽渲染
    renderSummary() {
        const summary = this.dm.calculateMonthlySummary();
        
        document.getElementById('mainBalance').textContent = this.formatCurrency(summary.profit);
        document.getElementById('totalIncome').textContent = this.formatCurrency(summary.income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(summary.expense);

        const balanceChange = document.getElementById('balanceChange');
        const changePercent = summary.income > 0 ? ((summary.profit / summary.income) * 100).toFixed(1) : 0;
        balanceChange.textContent = `${changePercent > 0 ? '+' : ''}${changePercent}%`;
        balanceChange.className = `balance-change ${changePercent < 0 ? 'negative' : ''}`;
    }

    // 提醒渲染
    renderReminders() {
        const reminders = this.dm.getTodayTasks();
        const remindersList = document.getElementById('remindersList');

        if (reminders.length === 0) {
            remindersList.innerHTML = '<p class="empty-message">今天沒有待辦事項</p>';
            return;
        }

        let html = '';
        reminders.forEach(task => {
            const project = this.dm.getProject(task.projectId);
            html += `
                <div class="reminder-item">
                    <div class="reminder-time">${task.reminderTime || '全天'}</div>
                    <div class="reminder-text">
                        ${task.title}
                        ${project ? `<br><small style="color: var(--text-secondary);">${project.name}</small>` : ''}
                    </div>
                    <div class="reminder-check" data-task-id="${task.id}"></div>
                </div>
            `;
        });

        remindersList.innerHTML = html;

        // 添加完成任務事件
        remindersList.querySelectorAll('.reminder-check').forEach(check => {
            check.addEventListener('click', (e) => {
                const taskId = e.target.dataset.taskId;
                this.dm.completeTask(taskId);
                this.renderReminders();
                this.showToast('任務已完成！');
            });
        });
    }

    // 專案渲染
    renderProjects() {
        const projects = this.dm.getProjects('active');
        const projectsList = document.getElementById('projectsList');

        // 更新專案選擇下拉選單
        this.updateProjectSelects();

        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="empty-message">尚無進行中的專案</p>';
            return;
        }

        let html = '';
        projects.forEach(project => {
            const tasks = this.dm.getTasksForProject(project.id);
            const completedTasks = tasks.filter(t => t.completed).length;
            const progress = tasks.length > 0 ? (completedTasks / tasks.length * 100).toFixed(0) : 0;

            html += `
                <div class="project-card" data-project-id="${project.id}">
                    <div class="project-header">
                        <div>
                            <div class="project-name">${project.name}</div>
                            <div class="project-client">${project.client || '個人專案'}</div>
                        </div>
                        <div class="project-amount">${this.formatCurrency(project.contractAmount || 0)}</div>
                    </div>
                    ${tasks.length > 0 ? `
                        <div class="project-progress">
                            <div class="progress-label">
                                <span>進度</span>
                                <span>${completedTasks}/${tasks.length}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        projectsList.innerHTML = html;

        // 添加點擊事件
        projectsList.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const projectId = e.currentTarget.dataset.projectId;
                this.showProjectDetail(projectId);
            });
        });
    }

    updateProjectSelects() {
        const projects = this.dm.getProjects('active');
        const selects = ['taskProjectSelect', 'transactionProjectSelect'];

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            const currentValue = select.value;
            
            let options = selectId === 'transactionProjectSelect' 
                ? '<option value="">一般收支</option>' 
                : '<option value="">請選擇專案</option>';

            projects.forEach(project => {
                options += `<option value="${project.id}">${project.name}</option>`;
            });

            select.innerHTML = options;
            select.value = currentValue;
        });
    }

    showProjectDetail(projectId) {
        const project = this.dm.getProject(projectId);
        if (!project) return;

        const tasks = this.dm.getTasksForProject(projectId);
        const transactions = this.dm.transactions.filter(t => t.projectId === projectId);
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);

        let content = `
            <div class="detail-section">
                <h3>專案資訊</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">客戶</span>
                        <span class="detail-value">${project.client || '個人專案'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">類型</span>
                        <span class="detail-value">${this.getProjectTypeName(project.type)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">開始日期</span>
                        <span class="detail-value">${new Date(project.startDate).toLocaleDateString('zh-TW')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">簽約金額</span>
                        <span class="detail-value">${this.formatCurrency(project.contractAmount || 0)}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>財務狀況</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">收入</span>
                        <span class="detail-value" style="color: #4ade80;">${this.formatCurrency(income)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">支出</span>
                        <span class="detail-value" style="color: #f87171;">${this.formatCurrency(expense)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">淨利</span>
                        <span class="detail-value" style="color: var(--accent-gold);">${this.formatCurrency(income - expense)}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>任務狀態</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">總任務數</span>
                        <span class="detail-value">${tasks.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">已完成</span>
                        <span class="detail-value">${tasks.filter(t => t.completed).length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">進行中</span>
                        <span class="detail-value">${tasks.filter(t => !t.completed).length}</span>
                    </div>
                </div>
            </div>

            ${project.notes ? `
                <div class="detail-section">
                    <h3>備註</h3>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">${project.notes}</p>
                </div>
            ` : ''}
        `;

        document.getElementById('projectDetailTitle').textContent = project.name;
        document.getElementById('projectDetailContent').innerHTML = content;
        this.openModal('projectDetailModal');
    }

    // FAB 操作處理
    handleFabAction(action) {
        switch (action) {
            case 'add-project':
                this.openModal('projectModal');
                break;
            case 'add-task':
                this.openModal('taskModal');
                break;
            case 'add-transaction':
                this.openModal('transactionModal');
                break;
        }
    }

    // 表單提交處理
    handleProjectSubmit(form) {
        const formData = new FormData(form);
        const project = {
            name: formData.get('name'),
            client: formData.get('client'),
            contractAmount: parseFloat(formData.get('contractAmount')) || 0,
            startDate: formData.get('startDate'),
            type: formData.get('type'),
            notes: formData.get('notes')
        };

        this.dm.addProject(project);
        this.closeModal('projectModal');
        form.reset();
        this.renderProjects();
        this.renderSummary();
        this.showToast('專案已建立！');
    }

    handleTaskSubmit(form) {
        const formData = new FormData(form);
        const recurring = formData.get('recurring');
        
        const task = {
            title: formData.get('title'),
            projectId: formData.get('projectId'),
            dueDate: formData.get('dueDate'),
            reminderTime: formData.get('reminderTime'),
            recurring: recurring
        };

        if (recurring === 'custom') {
            task.weekdays = Array.from(formData.getAll('weekdays'));
        }

        this.dm.addTask(task);
        this.closeModal('taskModal');
        form.reset();
        document.getElementById('customRecurringGroup').style.display = 'none';
        this.renderReminders();
        this.renderWeekCalendar();
        this.showToast('任務已新增！');
    }

    handleTransactionSubmit(form) {
        const formData = new FormData(form);
        const transaction = {
            type: formData.get('type'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            item: formData.get('item'),
            projectId: formData.get('projectId') || null,
            notes: formData.get('notes')
        };

        this.dm.addTransaction(transaction);
        this.closeModal('transactionModal');
        form.reset();
        this.renderSummary();
        this.showToast('記帳成功！');
    }

    // 模態視窗控制
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // 提醒檢查
    checkReminders() {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const today = now.toISOString().split('T')[0];
        
        const tasks = this.dm.getTasks(today);
        tasks.forEach(task => {
            if (task.reminderTime === currentTime && !task.completed && !task.notified) {
                this.showNotification(task);
                task.notified = true;
            }
        });
    }

    showNotification(task) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const project = this.dm.getProject(task.projectId);
            new Notification('任務提醒', {
                body: `${task.title}${project ? ` - ${project.name}` : ''}`,
                icon: '/favicon.ico'
            });
        }
        this.showToast(`提醒：${task.title}`);
    }

    // Toast 提示
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            color: var(--text-primary);
            padding: 1rem 2rem;
            border-radius: var(--radius-xl);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            z-index: 3000;
            animation: slideUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 工具方法
    formatCurrency(amount) {
        return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0
        }).format(amount);
    }

    getProjectTypeName(type) {
        const types = {
            'social-media': '社群媒體',
            'design': '設計',
            'development': '開發',
            'consulting': '顧問',
            'other': '其他'
        };
        return types[type] || type;
    }
}

// ============================================
// 應用初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const dataManager = new DataManager();
    const uiController = new UIController(dataManager);

    // 請求通知權限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // 添加動畫樣式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slideDown {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, 20px); }
        }
    `;
    document.head.appendChild(style);

    console.log('🚀 SOHO專案管理系統已啟動');
});