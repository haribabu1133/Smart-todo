import { FiFilter, FiX } from 'react-icons/fi';

const PRIORITIES = ['', 'High', 'Medium', 'Low'];
const STATUSES = ['', 'pending', 'completed'];
const CATEGORIES = ['', 'Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];

const FilterBar = ({ filters, onChange, onClear }) => {
    const hasActive = filters.priority || filters.status || filters.category;

    return (
        <div className="filter-bar">
            <span className="filter-label"><FiFilter size={12} /> Filters:</span>

            <select
                className="filter-select"
                value={filters.priority || ''}
                onChange={(e) => onChange('priority', e.target.value)}
                aria-label="Filter by priority"
            >
                <option value="">All Priorities</option>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
            </select>

            <select
                className="filter-select"
                value={filters.status || ''}
                onChange={(e) => onChange('status', e.target.value)}
                aria-label="Filter by status"
            >
                <option value="">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
            </select>

            <select
                className="filter-select"
                value={filters.category || ''}
                onChange={(e) => onChange('category', e.target.value)}
                aria-label="Filter by category"
            >
                <option value="">All Categories</option>
                {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {hasActive && (
                <button className="clear-filters-btn" onClick={onClear}>
                    <FiX size={11} /> Clear Filters
                </button>
            )}
        </div>
    );
};

export default FilterBar;
