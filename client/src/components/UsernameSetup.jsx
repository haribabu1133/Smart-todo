import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

const UsernameSetup = () => {
    const { saveUsername } = useUser();
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter your name');
            return;
        }
        if (trimmed.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        saveUsername(trimmed);
    };

    return (
        <div className="username-screen">
            <motion.div
                className="username-card"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
                <div className="icon">✨</div>
                <h1>Welcome to SmartTodo</h1>
                <p>Your personal productivity dashboard. Let's get started — what's your name?</p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="e.g. Hari"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            autoFocus
                        />
                        {error && (
                            <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>{error}</p>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
                        🚀 Let's Go!
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UsernameSetup;
