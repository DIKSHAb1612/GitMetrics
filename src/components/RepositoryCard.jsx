// RepositoryCard.jsx — A single repository card with modal details and bookmark support

import { useGithub } from '../context/GithubContext';
import { useBookmarks } from '../context/BookmarksContext';
import { useToast } from '../context/ToastContext';
import './RepositoryCard.css';

// Map language to color dot (same as LanguageSection)
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572a5',
  Java: '#b07219', 'C++': '#f34b7d', Go: '#00add8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4f5d95', Swift: '#ffac45', Kotlin: '#a97bff',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', default: '#58a6ff',
};

function RepositoryCard({ repo, onSelect }) {
  const { setSelectedRepo } = useGithub();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { addToast } = useToast();

  const bookmarked = isBookmarked(repo.id);

  // Format dates nicely (e.g., "Jan 2023")
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  function handleOpenDetails(e) {
    e.stopPropagation();
    if (onSelect) {
      onSelect(repo);
    } else if (setSelectedRepo) {
      setSelectedRepo(repo);
    }
  }

  function handleToggleBookmark(e) {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(repo.id);
      addToast(`Removed "${repo.name}" from bookmarks`, 'info');
    } else {
      addBookmark(repo, '', 'Reference');
      addToast(`Bookmarked "${repo.name}"`, 'success');
    }
  }

  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;

  return (
    <div className="repo-card glass-card">
      {/* Header: name + stars + bookmark button */}
      <div className="repo-card-header">
        <h4
          className="repo-name"
          title={repo.name}
          onClick={handleOpenDetails}
          style={{ cursor: 'pointer' }}
        >
          📦 {repo.name}
        </h4>
        <div className="repo-header-actions">
          <button
            type="button"
            className={`repo-bookmark-btn ${bookmarked ? 'is-active' : ''}`}
            onClick={handleToggleBookmark}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this repository'}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark repository'}
          >
            {bookmarked ? '🔖' : '📑'}
          </button>
          <span className="repo-stars">⭐ {repo.stargazers_count?.toLocaleString() || 0}</span>
        </div>
      </div>

      {/* Description */}
      <p className="repo-description">
        {repo.description || 'No description available'}
      </p>

      {/* Meta info row */}
      <div className="repo-meta">
        {repo.language && (
          <span className="repo-language">
            <span
              className="repo-lang-dot"
              style={{ background: langColor }}
            />
            {repo.language}
          </span>
        )}
        <span className="repo-forks">🍴 {repo.forks_count || 0}</span>
      </div>

      {/* Dates */}
      <div className="repo-dates">
        <span>Created: {formatDate(repo.created_at)}</span>
        <span>Updated: {formatDate(repo.updated_at)}</span>
      </div>

      {/* Button actions row */}
      <div className="repo-card-actions">
        <button
          type="button"
          onClick={handleOpenDetails}
          className="btn-secondary repo-btn-details"
        >
          🔍 Details
        </button>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary repo-btn"
        >
          GitHub ↗
        </a>
      </div>
    </div>
  );
}

export default RepositoryCard;
