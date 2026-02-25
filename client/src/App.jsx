import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import UsernameSetup from './components/UsernameSetup';

function AppContent() {
    const { username } = useUser();
    const [activePage, setActivePage] = useState('dashboard');
    const [search, setSearch] = useState('');

    if (!username) {
        return <UsernameSetup />;
    }

    return (
        <div className="app-layout">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="app-main">
                <Header search={search} setSearch={setSearch} activePage={activePage} />
                <main className="page-content">
                    {activePage === 'dashboard' && <Dashboard />}
                    {activePage === 'tasks' && <TasksPage search={search} />}
                    {activePage === 'work' && <TasksPage search={search} category="Work" />}
                    {activePage === 'personal' && <TasksPage search={search} category="Personal" />}
                    {activePage === 'study' && <TasksPage search={search} category="Study" />}
                </main>
            </div>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
