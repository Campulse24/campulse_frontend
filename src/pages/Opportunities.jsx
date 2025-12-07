import { useState, useEffect } from 'react';
import { opportunitiesAPI } from '../services/api';
import { Briefcase, GraduationCap, Tag, Bookmark, BookmarkCheck, X, ExternalLink } from 'lucide-react';
import './Opportunities.css';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

    useEffect(() => {
        fetchOpportunities();
    }, []);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredOpportunities(opportunities);
        } else {
            setFilteredOpportunities(
                opportunities.filter(opp => opp.category.toLowerCase() === filter)
            );
        }
    }, [filter, opportunities]);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const data = await opportunitiesAPI.getOpportunities();
            setOpportunities(data);
        } catch (error) {
            console.error('Failed to fetch opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = async (oppId) => {
        try {
            await opportunitiesAPI.bookmarkOpportunity(oppId);
            setBookmarkedIds(prev => {
                const newSet = new Set(prev);
                if (newSet.has(oppId)) {
                    newSet.delete(oppId);
                } else {
                    newSet.add(oppId);
                }
                return newSet;
            });
        } catch (error) {
            console.error('Failed to bookmark opportunity:', error);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'gig':
                return <Briefcase size={20} />;
            case 'scholarship':
                return <GraduationCap size={20} />;
            case 'deal':
                return <Tag size={20} />;
            default:
                return <Tag size={20} />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'gig':
                return '#f9dc5c';
            case 'scholarship':
                return '#bfd8fd';
            case 'deal':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="opportunities-page">
            <div className="opportunities-header">
                <div>
                    <h1>🚀 Opportunities Hub</h1>
                    <p>Discover gigs, scholarships, and exclusive deals</p>
                </div>
            </div>

            {/* Filters */}
            <div className="opportunities-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Opportunities
                </button>
                <button
                    className={`filter-btn ${filter === 'gig' ? 'active' : ''}`}
                    onClick={() => setFilter('gig')}
                >
                    <Briefcase size={18} />
                    Gigs
                </button>
                <button
                    className={`filter-btn ${filter === 'scholarship' ? 'active' : ''}`}
                    onClick={() => setFilter('scholarship')}
                >
                    <GraduationCap size={18} />
                    Scholarships
                </button>
                <button
                    className={`filter-btn ${filter === 'deal' ? 'active' : ''}`}
                    onClick={() => setFilter('deal')}
                >
                    <Tag size={18} />
                    Deals
                </button>
            </div>

            {/* Opportunities Grid */}
            <div className="opportunities-container">
                {loading ? (
                    <div className="loading-state">Loading opportunities...</div>
                ) : filteredOpportunities.length === 0 ? (
                    <div className="empty-state">
                        <Briefcase size={64} color="var(--color-secondary)" />
                        <h3>No opportunities found</h3>
                        <p>Check back later for new opportunities!</p>
                    </div>
                ) : (
                    <div className="opportunities-grid">
                        {filteredOpportunities.map((opp) => (
                            <div
                                key={opp.id}
                                className="opportunity-card"
                                onClick={() => setSelectedOpportunity(opp)}
                            >
                                <div className="opportunity-header">
                                    <span
                                        className="category-badge"
                                        style={{ backgroundColor: getCategoryColor(opp.category) }}
                                    >
                                        {getCategoryIcon(opp.category)}
                                        {opp.category}
                                    </span>
                                    <button
                                        className="bookmark-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBookmark(opp.id);
                                        }}
                                    >
                                        {bookmarkedIds.has(opp.id) ? (
                                            <BookmarkCheck size={20} />
                                        ) : (
                                            <Bookmark size={20} />
                                        )}
                                    </button>
                                </div>

                                <h3 className="opportunity-title">{opp.title}</h3>
                                <p className="opportunity-description">{opp.description}</p>

                                {opp.deadline && (
                                    <div className="opportunity-deadline">
                                        📅 Deadline: {formatDate(opp.deadline)}
                                    </div>
                                )}

                                <div className="opportunity-footer">
                                    <span className="view-details">View Details →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedOpportunity && (
                <div className="modal-overlay" onClick={() => setSelectedOpportunity(null)}>
                    <div className="modal-content opportunity-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span
                                    className="category-badge"
                                    style={{ backgroundColor: getCategoryColor(selectedOpportunity.category) }}
                                >
                                    {getCategoryIcon(selectedOpportunity.category)}
                                    {selectedOpportunity.category}
                                </span>
                                <h2>{selectedOpportunity.title}</h2>
                            </div>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedOpportunity(null)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <p className="full-description">{selectedOpportunity.description}</p>

                            {selectedOpportunity.deadline && (
                                <div className="detail-row">
                                    <strong>Deadline:</strong>
                                    <span>{formatDate(selectedOpportunity.deadline)}</span>
                                </div>
                            )}

                            {selectedOpportunity.link && (
                                <a
                                    href={selectedOpportunity.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="external-link"
                                >
                                    <ExternalLink size={18} />
                                    Visit Opportunity
                                </a>
                            )}

                            <button
                                className="bookmark-full-btn"
                                onClick={() => handleBookmark(selectedOpportunity.id)}
                            >
                                {bookmarkedIds.has(selectedOpportunity.id) ? (
                                    <>
                                        <BookmarkCheck size={20} />
                                        Bookmarked
                                    </>
                                ) : (
                                    <>
                                        <Bookmark size={20} />
                                        Bookmark
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Opportunities;
