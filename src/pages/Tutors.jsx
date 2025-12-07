import { useState, useEffect } from 'react';
import { tutorsAPI } from '../services/api';
import { Search, MessageCircle, X, Star } from 'lucide-react';
import './Tutors.css';

const Tutors = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTutor, setSelectedTutor] = useState(null);

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async (courseCode = null) => {
        try {
            setLoading(true);
            const data = await tutorsAPI.getTutors(courseCode);
            setTutors(data);
        } catch (error) {
            console.error('Failed to fetch tutors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTutors(searchQuery || null);
    };

    const handleWhatsAppClick = (phoneNumber) => {
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNumber}`, '_blank');
    };

    return (
        <div className="tutors-page">
            <div className="tutors-header">
                <div>
                    <h1>👨‍🏫 Tutor Discovery</h1>
                    <p>Find expert tutors for academic support</p>
                </div>
            </div>

            {/* Search */}
            <form className="tutors-search" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by course code (e.g., MTH 101, CSC 201)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button type="submit" className="search-btn">
                    Search
                </button>
                {searchQuery && (
                    <button
                        type="button"
                        className="clear-btn"
                        onClick={() => {
                            setSearchQuery('');
                            fetchTutors(null);
                        }}
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Tutors Grid */}
            <div className="tutors-container">
                {loading ? (
                    <div className="loading-state">Loading tutors...</div>
                ) : tutors.length === 0 ? (
                    <div className="empty-state">
                        <Search size={64} color="var(--color-secondary)" />
                        <h3>No tutors found</h3>
                        <p>Try searching for a different course code</p>
                    </div>
                ) : (
                    <div className="tutors-grid">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className="tutor-card"
                                onClick={() => setSelectedTutor(tutor)}
                            >
                                <div className="tutor-avatar">
                                    <span className="avatar-initial">
                                        {tutor.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <h3 className="tutor-name">{tutor.name}</h3>

                                {tutor.courses && tutor.courses.length > 0 && (
                                    <div className="tutor-courses">
                                        {tutor.courses.slice(0, 3).map((course, index) => (
                                            <span key={index} className="course-tag">
                                                {course}
                                            </span>
                                        ))}
                                        {tutor.courses.length > 3 && (
                                            <span className="course-tag more">
                                                +{tutor.courses.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {tutor.rating && (
                                    <div className="tutor-rating">
                                        <Star size={16} fill="var(--color-primary)" color="var(--color-primary)" />
                                        <span>{tutor.rating}/5</span>
                                    </div>
                                )}

                                <button
                                    className="whatsapp-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWhatsAppClick(tutor.whatsapp);
                                    }}
                                >
                                    <MessageCircle size={18} />
                                    Contact on WhatsApp
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedTutor && (
                <div className="modal-overlay" onClick={() => setSelectedTutor(null)}>
                    <div className="modal-content tutor-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="tutor-modal-header">
                                <div className="tutor-avatar large">
                                    <span className="avatar-initial">
                                        {selectedTutor.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2>{selectedTutor.name}</h2>
                                    {selectedTutor.rating && (
                                        <div className="tutor-rating">
                                            <Star size={18} fill="var(--color-primary)" color="var(--color-primary)" />
                                            <span>{selectedTutor.rating}/5</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedTutor(null)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {selectedTutor.bio && (
                                <div className="tutor-section">
                                    <h3>About</h3>
                                    <p>{selectedTutor.bio}</p>
                                </div>
                            )}

                            {selectedTutor.courses && selectedTutor.courses.length > 0 && (
                                <div className="tutor-section">
                                    <h3>Courses Taught</h3>
                                    <div className="tutor-courses">
                                        {selectedTutor.courses.map((course, index) => (
                                            <span key={index} className="course-tag">
                                                {course}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedTutor.experience && (
                                <div className="tutor-section">
                                    <h3>Experience</h3>
                                    <p>{selectedTutor.experience}</p>
                                </div>
                            )}

                            <button
                                className="whatsapp-btn-large"
                                onClick={() => handleWhatsAppClick(selectedTutor.whatsapp)}
                            >
                                <MessageCircle size={20} />
                                Contact on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tutors;
