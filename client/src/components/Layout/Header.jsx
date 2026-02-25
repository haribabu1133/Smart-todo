import { FiSearch } from 'react-icons/fi';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ search, setSearch }) => {
    const { username, getGreeting } = useUser();
    const { theme, toggleTheme } = useTheme();

    const greeting = getGreeting();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const getEmoji = () => {
        const hour = now.getHours();
        if (hour >= 5 && hour < 12) return '🌅';
        if (hour >= 12 && hour < 17) return '☀️';
        if (hour >= 17 && hour < 21) return '🌆';
        return '🌙';
    };

    return (
        <header className="app-header">
            <div className="greeting-block">
                <h2>{greeting}, {username} {getEmoji()}</h2>
                <p>{dateStr}</p>
            </div>

            <div className="header-actions">
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search tasks"
                    />
                </div>

                <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
                    {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
                </button>

                <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--accent-gradient)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0,
                    boxShadow: 'var(--shadow-accent)'
                }}>
                    {username.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
};

export default Header;
