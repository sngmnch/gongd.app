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
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedbackProgram, setSelectedFeedbackProgram] = useState(null);
  const [feedback, setFeedback] = useState({
    interest: 5,
    difficulty: 'normal',
    satisfaction: 'satisfied',
    comment: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
    // 생기부 파일 로드
    const savedPortfolio = localStorage.getItem('userPortfolio');
    if (savedPortfolio) {
      setPortfolioFile(JSON.parse(savedPortfolio));
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

  const handlePortfolioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toLocaleString(),
        };
        localStorage.setItem('userPortfolio', JSON.stringify(fileData));
        setPortfolioFile(fileData);
        alert('생기부가 업로드되었습니다.');
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!selectedFeedbackProgram) return;

    const feedbackData = {
      programId: selectedFeedbackProgram.id,
      programName: selectedFeedbackProgram.name,
      interest: feedback.interest,
      difficulty: feedback.difficulty,
      satisfaction: feedback.satisfaction,
      comment: feedback.comment,
      submittedAt: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem('programFeedback') || '[]');
    localStorage.setItem('programFeedback', JSON.stringify([...existing, feedbackData]));

    alert('후기가 저장되었습니다. 감사합니다!');
    setShowFeedbackModal(false);
    setFeedback({ interest: 5, difficulty: 'normal', satisfaction: 'satisfied', comment: '' });
    setSelectedFeedbackProgram(null);
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

        {/* 📄 생기부 관리 */}
        <section className="profile-card">
          <h2>📄 생기부 관리</h2>
          <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#1565c0' }}>
              📎 파일을 업로드하면 AI가 당신의 활동을 분석합니다.
            </p>
            {portfolioFile ? (
              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}>
                ✅ <strong>{portfolioFile.name}</strong> (업로드됨)<br/>
                <span style={{ fontSize: '0.85em', color: '#999' }}>
                  {portfolioFile.uploadedAt}
                </span>
              </div>
            ) : (
              <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>아직 업로드된 파일이 없습니다.</p>
            )}
          </div>
          <label style={{
            display: 'block',
            padding: '15px',
            background: '#f5f5f5',
            border: '2px dashed #667eea',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '15px'
          }}>
            📁 파일 선택 및 업로드 (PDF/JPG/PNG)
            <input
              type="file"
              onChange={handlePortfolioUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
          </label>
          <button
            className="btn-secondary"
            onClick={() => {
              if (portfolioFile) {
                if (window.confirm('생기부를 삭제하시겠습니까?')) {
                  localStorage.removeItem('userPortfolio');
                  setPortfolioFile(null);
                  alert('생기부가 삭제되었습니다.');
                }
              }
            }}
            style={{ width: '100%' }}
            disabled={!portfolioFile}
          >
            생기부 삭제
          </button>
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
                  {booking.status === '완료' && (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setSelectedFeedbackProgram({ id: booking.id, name: booking.program });
                        setShowFeedbackModal(true);
                      }}
                    >
                      후기 작성
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* 활동 후기 작성 모달 */}
      {showFeedbackModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 1000,
          }}
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            style={{
              width: '100%',
              background: 'white',
              borderRadius: '12px 12px 0 0',
              padding: '20px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '15px' }}>📝 활동 후기 작성</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              <strong>{selectedFeedbackProgram?.name}</strong>에 대한 후기를 남겨주세요.
            </p>

            {/* 흥미도 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                1️⃣ 흥미도
              </label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback({ ...feedback, interest: star })}
                    style={{
                      fontSize: '2em',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: star <= feedback.interest ? 1 : 0.3,
                      transition: 'all 0.2s',
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9em', margin: '8px 0 0 0' }}>
                {feedback.interest}점
              </p>
            </div>

            {/* 난이도 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                2️⃣ 난이도
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { value: 'easy', label: '쉬워요' },
                  { value: 'normal', label: '적당해요' },
                  { value: 'hard', label: '어려워요' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFeedback({ ...feedback, difficulty: opt.value })}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: feedback.difficulty === opt.value ? '2px solid #667eea' : '1px solid #ddd',
                      background: feedback.difficulty === opt.value ? '#667eea' : '#f5f5f5',
                      color: feedback.difficulty === opt.value ? 'white' : '#333',
                      cursor: 'pointer',
                      fontWeight: feedback.difficulty === opt.value ? '600' : '400',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 만족도 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                3️⃣ 만족도
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { value: 'very_satisfied', label: '매우 만족' },
                  { value: 'satisfied', label: '만족' },
                  { value: 'normal', label: '보통' },
                  { value: 'dissatisfied', label: '불만족' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFeedback({ ...feedback, satisfaction: opt.value })}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: feedback.satisfaction === opt.value ? '2px solid #667eea' : '1px solid #ddd',
                      background: feedback.satisfaction === opt.value ? '#667eea' : '#f5f5f5',
                      color: feedback.satisfaction === opt.value ? 'white' : '#333',
                      cursor: 'pointer',
                      fontWeight: feedback.satisfaction === opt.value ? '600' : '400',
                      fontSize: '0.9em',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 후기 텍스트 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                4️⃣ 후기 (선택)
              </label>
              <textarea
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                placeholder="이 프로그램에서 배운 점, 좋았던 점 등을 자유롭게 써주세요."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontFamily: 'inherit',
                  fontSize: '0.95em',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowFeedbackModal(false)}
                style={{ flex: 1 }}
              >
                취소
              </button>
              <button
                className="btn-primary"
                onClick={handleFeedbackSubmit}
                style={{ flex: 1 }}
              >
                후기 저장
              </button>
            </div>
          </div>
        </div>
      )}

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
