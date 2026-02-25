import { FiGrid, FiCheckSquare, FiBriefcase, FiUser, FiBook, FiZap } from 'react-icons/fi';

const navItems = [
    { id: 'dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { id: 'tasks', icon: <FiCheckSquare />, label: 'All Tasks' },
];

const categoryItems = [
    { id: 'work', icon: <FiBriefcase />, label: 'Work' },
    { id: 'personal', icon: <FiUser />, label: 'Personal' },
    { id: 'study', icon: <FiBook />, label: 'Study' },
];

import { useTheme } from '../../context/ThemeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const Sidebar = ({ activePage, setActivePage }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <FiZap size={18} />
                </div>
                <span>SmartTodo</span>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Main</div>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => setActivePage(item.id)}
                    >
                        <span className="link-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}

                <div className="sidebar-section-title" style={{ marginTop: '16px' }}>Categories</div>
                {categoryItems.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => setActivePage(item.id)}
                    >
                        <span className="link-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-link" onClick={toggleTheme} style={{ width: '100%' }}>
                    <span className="link-icon">
                        {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
                    </span>
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
