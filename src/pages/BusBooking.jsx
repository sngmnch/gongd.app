import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLayout.css';

function BusBooking() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // localStorage에서 신청 내역 로드
    const saved = JSON.parse(localStorage.getItem('shuttleApplications') || '[]');
    setApplications(saved);
  }, []);

  // 24시간 뒤에 결과 확정
  const confirmResult = (index) => {
    const updated = [...applications];
    updated[index].status = 'confirmed';
    updated[index].shuttleTime = '09:00';
    updated[index].pickupLocation = updated[index].school;
    setApplications(updated);
    localStorage.setItem('shuttleApplications', JSON.stringify(updated));
  };

  return (
    <div className="page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <h1>🚌 내 셔틀 신청</h1>
      </header>

      <div className="page-content">
        {applications.length === 0 ? (
          <section className="section empty-state">
            <h2>아직 신청한 셔틀이 없습니다</h2>
            <p>홈 화면에서 "셔틀 신청하기" 버튼을 눌러 신청해주세요!</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              홈으로 돌아가기
            </button>
          </section>
        ) : (
          <section className="section">
            <h2>📋 신청 현황</h2>
            <div className="applications-list">
              {applications.map((app, index) => (
                <div key={app.id} className="application-card">
                  {/* 상태 배지 */}
                  <div className="card-header">
                    <h3>{app.studentName}님의 신청</h3>
                    <span className={`status-badge ${app.status}`}>
                      {app.status === 'pending' ? '⏳ 심사중' : '✅ 배정완료'}
                    </span>
                  </div>

                  {/* 신청 정보 */}
                  <div className="card-info">
                    <p>📍 <strong>학교:</strong> {app.school}</p>
                    <p>🎯 <strong>관심분야:</strong> {app.interests.join(', ')}</p>
                    <p>📝 <strong>신청 프로그램:</strong> {app.appliedProgram.name}</p>
                    <p>🚩 <strong>프로그램 위치:</strong> {app.appliedProgram.location}</p>
                    <p>🕐 <strong>신청일시:</strong> {app.appliedAtDisplay || new Date(app.appliedAt).toLocaleString()}</p>
                  </div>

                  {/* 상태별 UI */}
                  {app.status === 'pending' ? (
                    <div className="pending-state">
                      <div className="timer">
                        <p style={{ color: '#2196f3', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1em' }}>
                          ⏱️ 결과 발표까지의 남은 시간
                        </p>
                        <CountdownTimer appliedAt={app.appliedAt} onTimeUp={() => confirmResult(index)} />
                      </div>
                      <p className="info-text">
                        🤖 AI 알고리즘이 최적의 셔틀을 매칭 중입니다...
                      </p>
                    </div>
                  ) : (
                    <div className="confirmed-state">
                      <div className="success-box" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>✨ 셔틀 배정 완료!</h4>
                        <div className="shuttle-details" style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '6px' }}>
                          <p style={{ margin: '8px 0', fontSize: '1em' }}>
                            <strong>📍 픽업 위치</strong><br/>
                            {app.selectedPickupSchool || app.pickupLocation}
                          </p>
                          <p style={{ margin: '8px 0', fontSize: '1em' }}>
                            <strong>🕐 픽업 시간</strong><br/>
                            {app.shuttleTime || '결정 예정'}
                          </p>
                          <p style={{ margin: '8px 0', fontSize: '1em' }}>
                            <strong>🎯 목적지</strong><br/>
                            {app.appliedProgram.location}
                          </p>
                          <p style={{ margin: '8px 0', fontSize: '1em' }}>
                            <strong>📝 프로그램</strong><br/>
                            {app.appliedProgram.name}
                          </p>
                          <p style={{ margin: '8px 0', fontSize: '1em' }}>
                            <strong>📞 연락처</strong><br/>
                            {app.studentPhone}
                          </p>
                        </div>
                      </div>
                      <div className="reminder-box" style={{ background: '#fff3cd', padding: '12px', borderRadius: '8px', border: '1px solid #ffc107', color: '#333' }}>
                        ⏰ 신청하신 시간에 {app.selectedPickupSchool || app.pickupLocation}에서 대기해주세요!<br/>
                        📍 정확한 픽업 위치는 며칠 전에 안내됩니다.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <nav className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span>홈</span>
        </button>
        <button className="nav-btn active" onClick={() => navigate('/buses')}>
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
        <button className="nav-btn" onClick={() => navigate('/mypage')}>
          <span className="nav-icon">👤</span>
          <span>마이</span>
        </button>
      </nav>
    </div>
  );
}

// 카운트다운 타이머 컴포넌트
function CountdownTimer({ appliedAt, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState('계산중...');

  useEffect(() => {
    // appliedAt이 타임스탬프인 경우와 문자열인 경우 모두 처리
    let appliedTime;
    if (typeof appliedAt === 'number') {
      appliedTime = appliedAt;
    } else {
      // ISO 형식이나 로케일 형식 문자열을 타임스탬프로 변환
      appliedTime = new Date(appliedAt).getTime();
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = 24 * 60 * 60 * 1000 - (now - appliedTime);

      if (diff <= 0) {
        setTimeLeft('곧 발표됩니다!');
        onTimeUp();
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        setTimeLeft(`${hours}시간 ${minutes}분`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [appliedAt, onTimeUp]);

  return <p className="countdown">{timeLeft}</p>;
}

export default BusBooking;
