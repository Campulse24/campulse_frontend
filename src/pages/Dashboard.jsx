```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: '📚',
      title: 'Academic Planner',
      description: 'Manage your classes, assignments, and exams',
      path: '/planner',
      color: '#f9dc5c'
    },
    {
      icon: '🎯',
      title: 'Opportunities Hub',
      description: 'Find gigs, scholarships, and deals',
      path: '/opportunities',
      color: '#bfd8fd'
    },
    {
      icon: '👨‍🏫',
      title: 'Tutor Discovery',
      description: 'Connect with tutors for academic support',
      path: '/tutors',
      color: '#10b981'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="welcome-section animate-fadeIn">
          <h2>Welcome back, {user?.fullName || user?.full_name || 'Student'}! 👋</h2>
          <p className="user-school">{user?.school}</p>
          <p className="user-details">{user?.department} • {user?.level}</p>
        </div>

        <div className="dashboard-grid">
          {features.map((feature, index) => (
            <div
              key={feature.path}
              className="dashboard-card animate-slideInLeft"
              style={{ animationDelay: `${ index * 0.1 } s` }}
              onClick={() => navigate(feature.path)}
            >
              <div className="card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button className="card-btn" style={{ background: feature.color }}>
                Get Started <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```
