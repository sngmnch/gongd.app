import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLayout.css';

function MyPage() {
  const navigate = useNavigate();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    school: '',
    grade: '1',
    region: '',
    interests: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSaveProfile = () => {
    if (!profile.name || !profile.school || !profile.region) {
      alert('모든 항목을 입력해주세요');
      return;
    }
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('프로필이 저장되었습니다');
    setEditingProfile(false);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까? 프로필 정보가 삭제됩니다.')) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('shuttleApplications');
      alert('로그아웃되었습니다.');
      navigate('/');
    }
  };

  const myBookings = [
    { id: 1, program: '로봇 만들기', date: '7월 13일', time: '09:00', status: '예정', attended: false },
    { id: 2, program: 'AI 체험', date: '6월 22일', time: '10:00', status: '완료', attended: true },
    { id: 3, program: '과학관 투어', date: '6월 15일', time: '14:00', status: '완료', attended: true },
  ];

  const participationHours = myBookings.filter(b => b.attended).length * 2;
  const regions = ['동구', '중구', '서구', '유성구', '대덕구'];
  const interestOptions = ['로봇', 'AI', '과학', '화학', '기술', '수학', '물리', '생물'];

  return (
    <div className="page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <h1>👤 마이페이지</h1>
      </header>

      <div className="page-content">
        {/* 프로필 카드 */}
        <section className="profile-card">
          <h2>프로필</h2>
          {!editingProfile ? (
            <>
              <div className="profile-info">
                <p><strong>이름:</strong> {profile.name || '입력하지 않음'}</p>
                <p><strong>학교:</strong> {profile.school || '입력하지 않음'} ({profile.grade || '1'}학년)</p>
                <p><strong>구:</strong> {profile.region || '입력하지 않음'}</p>
                <p><strong>관심분야:</strong> {profile.interests?.join(', ') || '입력하지 않음'}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-secondary" onClick={() => setEditingProfile(true)} style={{ flex: 1 }}>프로필 수정</button>
                <button className="btn-primary" onClick={handleLogout} style={{ flex: 1, background: '#d32f2f' }}>로그아웃</button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-info">
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이름</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="이름"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>학교</label>
                  <input
                    type="text"
                    value={profile.school}
                    onChange={e => setProfile({ ...profile, school: e.target.value })}
                    placeholder="학교명"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>학년</label>
                  <select
                    value={profile.grade}
                    onChange={e => setProfile({ ...profile, grade: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="1">1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>구</label>
                  <select
                    value={profile.region}
                    onChange={e => setProfile({ ...profile, region: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">선택하세요</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>관심분야</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {interestOptions.map(interest => (
                      <button
                        key={interest}
                        onClick={() => {
                          const interests = profile.interests || [];
                          setProfile({
                            ...profile,
                            interests: interests.includes(interest)
                              ? interests.filter(i => i !== interest)
                              : [...interests, interest]
                          });
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          border: profile.interests?.includes(interest) ? '2px solid #667eea' : '1px solid #ddd',
                          background: profile.interests?.includes(interest) ? '#667eea' : '#f5f5f5',
                          color: profile.interests?.includes(interest) ? 'white' : '#333',
                          cursor: 'pointer',
                          fontSize: '0.85em',
                          fontWeight: '600',
                        }}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" onClick={handleSaveProfile} style={{ flex: 1 }}>저장</button>
                <button className="btn-secondary" onClick={() => setEditingProfile(false)} style={{ flex: 1 }}>취소</button>
              </div>
            </>
          )}
        </section>

        {/* 참여 현황 */}
        <section className="stats-section">
          <h2>📊 참여 현황</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <h3>{myBookings.length}</h3>
              <p>예약 횟수</p>
            </div>
            <div className="stat-box">
              <h3>{myBookings.filter(b => b.attended).length}</h3>
              <p>참여 완료</p>
            </div>
            <div className="stat-box">
              <h3>{participationHours}시간</h3>
              <p>참여 시간</p>
            </div>
          </div>
        </section>

        {/* 예약 현황 */}
        <section className="section">
          <h2>📅 예약된 프로그램</h2>
          <div className="bookings-list">
            {myBookings.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>예약된 프로그램이 없습니다.</p>
            ) : (
              myBookings.map(booking => (
                <div key={booking.id} className={`booking-item ${booking.status}`}>
                  <div className="booking-content">
                    <h3>{booking.program}</h3>
                    <p>📅 {booking.date}</p>
                    <p>⏰ {booking.time}</p>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                      {booking.attended && ' ✓'}
                    </span>
                  </div>
                  {booking.status === '예정' && (
                    <button className="btn-secondary">취소</button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <nav className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span>홈</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/buses')}>
          <span className="nav-icon">🚌</span>
          <span>내 신청</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/map')}>
          <span className="nav-icon">📍</span>
          <span>지도</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/statistics')}>
          <span className="nav-icon">📊</span>
          <span>통계</span>
        </button>
        <button className="nav-btn active" onClick={() => navigate('/mypage')}>
          <span className="nav-icon">👤</span>
          <span>마이</span>
        </button>
      </nav>
    </div>
  );
}

export default MyPage;
