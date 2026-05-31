import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HomeMap.css';
import { schoolsByDistrict } from '../data/schools';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [setupProfile, setSetupProfile] = useState({
    name: '',
    school: '',
    grade: '1',
    region: '',
  });
  const [setupSelectedDistrict, setSetupSelectedDistrict] = useState('');

  React.useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (!saved) {
      setShowProfileSetup(true);
    }
  }, []);

  const setupSchools = setupSelectedDistrict ? schoolsByDistrict[setupSelectedDistrict] || [] : [];

  const handleProfileSetupComplete = () => {
    if (!setupProfile.name || !setupProfile.school || !setupProfile.region) {
      alert('모든 항목을 입력해주세요');
      return;
    }
    localStorage.setItem('userProfile', JSON.stringify(setupProfile));
    setShowProfileSetup(false);
    setSetupStep(1);
    setSetupSelectedDistrict('');
  };

  // 13개 프로그램 (각 프로그램별 픽업 학교 포함)
  const programs = [
    { id: 1, name: '로봇 만들기', location: '대전과학고', lat: 36.3512, lng: 127.3815, tag: '로봇',
      pickupSchools: ['대전중학교', '대전고등학교', '과학고등학교', '한밭중학교', '과학중학교'] },
    { id: 2, name: 'AI 및 미래기술 체험', location: '대전시립과학관', lat: 36.3332, lng: 127.4243, tag: 'AI',
      pickupSchools: ['중앙중학교', '중앙고등학교', '영신중학교', '중앙여고', '동문고등학교'] },
    { id: 3, name: 'ETRI 정보통신 투어', location: '한국전자통신연구원(ETRI)', lat: 36.3660, lng: 127.4090, tag: '과학',
      pickupSchools: ['유성중학교', '유성고등학교', '대덕중학교', '과학영재고', '서구중학교'] },
    { id: 4, name: '화학 실험실 및 분석', location: '한국화학연구원', lat: 36.3625, lng: 127.4100, tag: '화학',
      pickupSchools: ['한밭중학교', '한밭고등학교', '대전과학고', '화학고등학교', '실험중학교'] },
    { id: 5, name: '기계공학 체험', location: '한국기계연구원', lat: 36.3645, lng: 127.4080, tag: '기술',
      pickupSchools: ['대덕중학교', '대덕고등학교', '기술중학교', '공학고등학교', '동구중학교'] },
    { id: 6, name: '생명공학 기초 이해', location: '한국생명공학연구원', lat: 36.3610, lng: 127.4120, tag: '과학',
      pickupSchools: ['과학중학교', '생명과학고', '자연중학교', '녹색중학교', '산업고등학교'] },
    { id: 7, name: '신재생에너지와 미래', location: '에너지 연구소', lat: 36.3640, lng: 127.4050, tag: '과학',
      pickupSchools: ['에너지중학교', '에너지고등학교', '미래중학교', '친환경중학교', '녹색고등학교'] },
    { id: 8, name: '원자력 에너지 이해', location: '한국원자력연구원', lat: 36.3655, lng: 127.4110, tag: '과학',
      pickupSchools: ['과학중학교', '원자력고등학교', '실험중학교', '대덕중학교', '과학고등학교'] },
    { id: 9, name: '나노기술 세상', location: '한국표준과학연구원', lat: 36.3630, lng: 127.4070, tag: '과학',
      pickupSchools: ['나노중학교', '나노고등학교', '표준과학중', '기술중학교', '미래고등학교'] },
    { id: 10, name: 'KIST 다양성 체험', location: '한국과학기술연구원(KIST)', lat: 36.3620, lng: 127.3980, tag: '과학',
      pickupSchools: ['KIST중학교', 'KIST고등학교', '과학중학교', '기술고등학교', '미래중학교'] },
    { id: 11, name: '3D 프린팅 및 설계', location: '대전시 기술혁신지원센터', lat: 36.3690, lng: 127.3700, tag: '기술',
      pickupSchools: ['기술중학교', '3D고등학교', '설계중학교', '디자인중학교', '공학고등학교'] },
    { id: 12, name: '로봇공학 심화 과정', location: '대전로봇산업클러스터', lat: 36.3550, lng: 127.3900, tag: '로봇',
      pickupSchools: ['로봇중학교', '로봇고등학교', '공학중학교', '산업중학교', '기술고등학교'] },
    { id: 13, name: '환경 및 수처리 기술', location: '물 연구센터', lat: 36.3700, lng: 127.3800, tag: '과학',
      pickupSchools: ['환경중학교', '환경고등학교', '녹색중학교', '친환경고', '수처리중학교'] },
  ];

  // 5개 구의 정확한 중심 좌표 (중학교 데이터 기반) - 새로운 점수 공식 적용
  const districts = [
    { name: '동구', lat: 36.3350, lng: 127.4500, score: 30 },
    { name: '중구', lat: 36.3240, lng: 127.4150, score: 35 },
    { name: '서구', lat: 36.3200, lng: 127.3700, score: 95 },
    { name: '유성구', lat: 36.3819, lng: 127.3492, score: 71 },
    { name: '대덕구', lat: 36.3855, lng: 127.4267, score: 34 },
  ];

  // 프로그램 아이콘
  const programIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: #2196f3; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">📍</div>`,
    iconSize: [40, 40],
  });

  // 점수별 색상 지정
  const getColor = (score) => {
    if (score >= 90) return '#388e3c';      // 초록색 (90~100)
    if (score >= 70) return '#2196f3';      // 파랑색 (70~89)
    if (score >= 50) return '#ffc107';      // 노랑색 (50~69)
    if (score >= 30) return '#ff9800';      // 주황색 (30~49)
    return '#d32f2f';                       // 빨강색 (~29)
  };

  // 구 아이콘
  const getDistrictIcon = (score) => {
    const color = getColor(score);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.25); opacity: 0.8; text-align: center; padding: 5px;"></div>`,
      iconSize: [50, 50],
    });
  };

  return (
    <div className="home-map">
      {/* 헤더 */}
      <header className="header">
        <h1>🚌 사이언스 셔틀</h1>
        <p>대전 교육격차 해소 프로젝트</p>
      </header>

      {/* 지도 */}
      <section className="map-section">
        <div style={{ height: '350px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          <MapContainer
            bounds={[
              [36.30, 127.33],
              [36.37, 127.44]
            ]}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 5개 구 표시 */}
            {districts.map((d, idx) => (
              <Marker key={`district-${idx}`} position={[d.lat, d.lng]} icon={getDistrictIcon(d.score)}>
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong>{d.name}</strong>
                    <br />
                    점수: {d.score}점
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 5개 프로그램 표시 */}
            {programs.map(p => (
              <Marker key={`program-${p.id}`} position={[p.lat, p.lng]} icon={programIcon}>
                <Popup>
                  <div>
                    <strong>{p.name}</strong>
                    <br />
                    {p.location}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* 범례 */}
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ddd',
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '0.9em', color: '#333' }}>범례</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85em' }}>
            <div>✅ 🔵 파란색 마커: 과학 프로그램</div>
            <div>🟢 초록색 (90~100): 최우수 지역</div>
            <div>🔵 파란색 (70~79): 교육 양호</div>
            <div>🟠 주황색 (30~49): 교육 부족</div>
            <div>🔴 빨강색 (~29): 교육 취약</div>
          </div>
        </div>

        {/* 프로그램 목록 */}
        <div className="programs-list">
          <h3>📍 운영 중인 프로그램 ({programs.length}개)</h3>
          <div className="program-items">
            {programs.map(program => (
              <div key={program.id} className="program-item">
                <span className="tag">{program.tag}</span>
                <div>
                  <p className="name">{program.name}</p>
                  <p className="location">📍 {program.location}</p>
                  <p style={{ fontSize: '0.8em', color: '#2196f3', margin: '3px 0 0 0' }}>
                    {program.lat.toFixed(3)}°N, {program.lng.toFixed(3)}°E
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 셔틀 신청 버튼 */}
      <button className="shuttle-request-btn" onClick={() => setShowModal(true)}>
        <span className="btn-icon">🚌</span>
        <span className="btn-text">셔틀 신청하기</span>
        <span className="btn-subtext">지금 신청하면 24시간 뒤 결과 확인!</span>
      </button>

      {/* 모달 - 프로필 설정 */}
      {showProfileSetup && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="application-form" style={{ padding: '30px 20px' }}>
              {setupStep === 1 && (
                <>
                  <h2 style={{ color: '#1a237e', textAlign: 'center', marginBottom: '20px' }}>👤 기본 정보</h2>
                  <p style={{ color: '#666', textAlign: 'center', marginBottom: '20px' }}>
                    이름, 학년, 구를 입력하세요.
                  </p>

                  <div className="form-group">
                    <label>이름</label>
                    <input
                      type="text"
                      value={setupProfile.name}
                      onChange={e => setSetupProfile({ ...setupProfile, name: e.target.value })}
                      placeholder="이름을 입력하세요"
                    />
                  </div>

                  <div className="form-group">
                    <label>학년</label>
                    <select
                      value={setupProfile.grade}
                      onChange={e => setSetupProfile({ ...setupProfile, grade: e.target.value })}
                    >
                      <option value="1">1학년</option>
                      <option value="2">2학년</option>
                      <option value="3">3학년</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>구</label>
                    <select
                      value={setupProfile.region}
                      onChange={e => {
                        setSetupProfile({ ...setupProfile, region: e.target.value, school: '' });
                        setSetupSelectedDistrict(e.target.value);
                      }}
                    >
                      <option value="">선택하세요</option>
                      <option value="동구">동구</option>
                      <option value="중구">중구</option>
                      <option value="서구">서구</option>
                      <option value="유성구">유성구</option>
                      <option value="대덕구">대덕구</option>
                    </select>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => setSetupStep(2)}
                    disabled={!setupProfile.name || !setupProfile.region}
                    style={{ width: '100%' }}
                  >
                    다음
                  </button>
                </>
              )}

              {setupStep === 2 && (
                <>
                  <h2 style={{ color: '#1a237e', textAlign: 'center', marginBottom: '20px' }}>🏫 학교 선택</h2>
                  <p style={{ color: '#666', textAlign: 'center', marginBottom: '15px', fontSize: '0.9em' }}>
                    {setupProfile.region}에서 다니는 학교를 선택하세요.
                  </p>

                  <div style={{
                    maxHeight: '350px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    marginBottom: '20px'
                  }}>
                    {setupSchools.map(school => (
                      <button
                        key={school.id}
                        className={`school-btn ${setupProfile.school === school.name ? 'selected' : ''}`}
                        onClick={() => setSetupProfile({ ...setupProfile, school: school.name })}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          marginBottom: '8px',
                          padding: '12px',
                          borderRadius: '8px',
                          border: setupProfile.school === school.name ? '2px solid #667eea' : '1px solid #ddd',
                          background: setupProfile.school === school.name ? '#667eea' : '#f5f5f5',
                          color: setupProfile.school === school.name ? 'white' : '#333',
                          cursor: 'pointer',
                          fontWeight: setupProfile.school === school.name ? '600' : '400'
                        }}
                      >
                        {school.name} <span style={{ fontSize: '0.85em', opacity: 0.8 }}>({school.type})</span>
                      </button>
                    ))}
                  </div>

                  {setupProfile.school && (
                    <div style={{ background: '#f0f4ff', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                      ✅ <strong>{setupProfile.school}</strong>이 선택되었습니다.
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => setSetupStep(1)}
                      style={{ flex: 1 }}
                    >
                      이전
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleProfileSetupComplete}
                      disabled={!setupProfile.school}
                      style={{ flex: 1 }}
                    >
                      시작하기
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 모달 - 셔틀 신청 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            <ShuttleApplicationForm onClose={() => setShowModal(false)} programs={programs} />
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <nav className="bottom-nav">
        <button className="nav-btn active" onClick={() => navigate('/')}>
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
        <button className="nav-btn" onClick={() => navigate('/mypage')}>
          <span className="nav-icon">👤</span>
          <span>마이</span>
        </button>
      </nav>
    </div>
  );
}

// 셔틀 신청 폼 컴포넌트
function ShuttleApplicationForm({ onClose, programs }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const [formData, setFormData] = useState({
    name: savedProfile.name || '',
    phone: '',
    school: savedProfile.school || '',
    grade: savedProfile.grade || '1',
    region: savedProfile.region || '',
    interests: savedProfile.interests || [],
    location: { lat: 36.33, lng: 127.39 },
    selectedProgram: null,
    selectedPickupSchool: null,
  });

  // 학교 리스트는 선택된 구별로 필터링
  const schools = selectedDistrict ? schoolsByDistrict[selectedDistrict] || [] : [];

  const interestOptions = ['로봇', 'AI', '과학', '화학', '기술', '수학', '물리', '생물'];

  const handleSchoolSelect = (school) => {
    setFormData({
      ...formData,
      school: school.name,
      region: school.district,
      location: { lat: school.lat, lng: school.lng },
    });
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.school || !formData.selectedProgram || !formData.selectedPickupSchool) {
      alert('모든 항목을 입력해주세요');
      return;
    }

    // 프로필 정보 저장
    const userProfile = {
      name: formData.name,
      phone: formData.phone,
      school: formData.school,
      grade: formData.grade,
      region: formData.region,
      interests: formData.interests,
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    // 결과 저장
    const applicationResult = {
      id: Date.now(),
      studentName: formData.name,
      studentPhone: formData.phone,
      school: formData.school,
      interests: formData.interests,
      appliedProgram: formData.selectedProgram,
      selectedPickupSchool: formData.selectedPickupSchool,
      appliedAt: new Date().toLocaleString(),
      resultDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
      status: 'pending', // pending -> confirmed/rejected
      shuttleTime: null,
      pickupLocation: formData.selectedPickupSchool,
    };

    // localStorage에 저장
    const existing = JSON.parse(localStorage.getItem('shuttleApplications') || '[]');
    localStorage.setItem('shuttleApplications', JSON.stringify([...existing, applicationResult]));

    alert(`신청이 완료되었습니다!\n\n신청 프로그램: ${formData.selectedProgram.name}\n픽업 위치: ${formData.selectedPickupSchool}\n결과는 24시간 뒤 확인하세요.`);

    onClose();
    navigate('/buses');
  };

  return (
    <div className="application-form">
      {step === 1 && (
        <div className="form-step">
          <h2>📋 휴대폰 입력</h2>

          {/* 저장된 프로필 정보 표시 */}
          <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ margin: '5px 0', fontSize: '0.95em' }}>
              <strong>이름:</strong> {formData.name}
            </p>
            <p style={{ margin: '5px 0', fontSize: '0.95em' }}>
              <strong>학년:</strong> {formData.grade}학년
            </p>
            {formData.school && (
              <p style={{ margin: '5px 0', fontSize: '0.95em' }}>
                <strong>학교:</strong> {formData.school}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>휴대폰</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="010-0000-0000"
            />
          </div>
          <button className="btn-primary" onClick={() => setStep(2)}>다음</button>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <h2>🏫 학교 선택</h2>
          <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
            먼저 구를 선택한 후 학교를 선택하면 픽업 위치가 결정됩니다.
          </p>

          {/* 구 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
              구 선택
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {Object.keys(schoolsByDistrict).map(district => (
                <button
                  key={district}
                  className={`school-btn ${selectedDistrict === district ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDistrict(district);
                    setFormData({ ...formData, school: '' });
                  }}
                  style={{ padding: '12px', fontSize: '0.95em' }}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>

          {/* 학교 선택 */}
          {selectedDistrict && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
                학교 선택 ({schoolsByDistrict[selectedDistrict].length}개)
              </label>
              <div className="school-list" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                {schools.map(school => (
                  <button
                    key={school.id}
                    className={`school-btn ${formData.school === school.name ? 'selected' : ''}`}
                    onClick={() => handleSchoolSelect(school)}
                    style={{ width: '100%', marginBottom: '8px', textAlign: 'left' }}
                  >
                    {school.name} <span style={{ fontSize: '0.85em', color: '#999' }}>({school.type})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '15px', background: '#f0f4ff', borderRadius: '8px' }}>
            {formData.school && (
              <p>✅ <strong>{formData.school}</strong>에서 픽업됩니다</p>
            )}
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setStep(1)}>이전</button>
            <button className="btn-primary" onClick={() => setStep(3)} disabled={!formData.school}>다음</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-step">
          <h2>🎯 관심분야 선택</h2>
          <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
            관심분야를 선택하면 최적의 프로그램을 추천합니다. (최소 1개)
          </p>
          <div className="interests-grid">
            {interestOptions.map(interest => (
              <button
                key={interest}
                className={`interest-btn ${formData.interests.includes(interest) ? 'selected' : ''}`}
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setStep(2)}>이전</button>
            <button className="btn-primary" onClick={() => setStep(4)} disabled={formData.interests.length === 0}>
              다음
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="form-step">
          <h2>📍 프로그램 선택</h2>
          <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
            관심분야에 맞는 프로그램을 선택하고 픽업 위치를 지정해주세요.
          </p>

          {/* 필터링된 프로그램 목록 */}
          <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '20px' }}>
            {programs
              .filter(p => formData.interests.includes(p.tag))
              .map(program => (
                <div
                  key={program.id}
                  className="program-card"
                  style={{
                    padding: '12px',
                    marginBottom: '12px',
                    border: formData.selectedProgram?.id === program.id ? '2px solid #667eea' : '1px solid #ddd',
                    borderRadius: '8px',
                    background: formData.selectedProgram?.id === program.id ? '#f0f4ff' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => {
                    setFormData({ ...formData, selectedProgram: program, selectedPickupSchool: null });
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{program.name}</h4>
                  <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#666' }}>
                    📍 {program.location}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '0.85em', color: '#999' }}>
                    분야: <strong>{program.tag}</strong>
                  </p>

                  {/* 픽업 학교 선택 (프로그램 선택 후에만 표시) */}
                  {formData.selectedProgram?.id === program.id && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ddd' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#333' }}>
                        📍 픽업 위치 선택:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {program.pickupSchools.map((school, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, selectedPickupSchool: school });
                            }}
                            style={{
                              padding: '8px',
                              borderRadius: '6px',
                              border: formData.selectedPickupSchool === school ? '2px solid #667eea' : '1px solid #ddd',
                              background: formData.selectedPickupSchool === school ? '#667eea' : '#f5f5f5',
                              color: formData.selectedPickupSchool === school ? 'white' : '#333',
                              cursor: 'pointer',
                              fontSize: '0.85em',
                              fontWeight: formData.selectedPickupSchool === school ? '600' : '400',
                            }}
                          >
                            {school}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* 선택 요약 */}
          {formData.selectedProgram && formData.selectedPickupSchool && (
            <div style={{ background: '#f0f4ff', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              ✅ <strong>{formData.selectedProgram.name}</strong> 선택<br/>
              📍 픽업: <strong>{formData.selectedPickupSchool}</strong>
            </div>
          )}

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setStep(3)}>이전</button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!formData.selectedProgram || !formData.selectedPickupSchool}
            >
              신청 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 알고리즘: 거리 + 관심분야 매칭
function findBestProgram(student, programs) {
  const scores = programs.map(program => {
    // 거리 계산 (Haversine)
    const distance = calculateDistance(
      student.location.lat,
      student.location.lng,
      program.lat,
      program.lng
    );

    // 관심분야 매칭
    const interestMatch = student.interests.includes(program.tag) ? 100 : 50;

    // 최종 점수: 거리가 가까울수록, 관심분야가 일치할수록 높음
    const score = interestMatch * 2 - distance;

    return { program, score };
  });

  // 가장 높은 점수의 프로그램 선택
  return scores.sort((a, b) => b.score - a.score)[0].program;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default Home;
