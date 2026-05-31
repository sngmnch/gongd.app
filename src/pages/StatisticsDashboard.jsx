import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './StatisticsDashboard.css';

function StatisticsDashboard() {
  const navigate = useNavigate();
  const [giftedTrendData, setGiftedTrendData] = useState([]);
  const [clubData, setClubData] = useState([]);
  const [libraryData, setLibraryData] = useState([]);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    // 영재고 진학 5년 추이
    const giftedTrend = [
      { year: '2019', '서구': 156, '유성구': 189, '중구': 78, '동구': 64, '대덕구': 82 },
      { year: '2020', '서구': 162, '유성구': 201, '중구': 81, '동구': 68, '대덕구': 89 },
      { year: '2021', '서구': 174, '유성구': 218, '중구': 85, '동구': 72, '대덕구': 95 },
      { year: '2022', '서구': 189, '유성구': 241, '중구': 91, '동구': 78, '대덕구': 103 },
      { year: '2023', '서구': 204, '유성구': 268, '중구': 98, '동구': 85, '대덕구': 112 },
    ];
    setGiftedTrendData(giftedTrend);

    // 구별 학원 수
    const academy = [
      { name: '서구', academies: 14666 },
      { name: '유성구', academies: 7502 },
      { name: '중구', academies: 3845 },
      { name: '동구', academies: 2470 },
      { name: '대덕구', academies: 2431 },
    ];
    setClubData(academy);

    // 공공도서관 수
    const library = [
      { name: '유성구', libraries: 12 },
      { name: '서구', libraries: 8 },
      { name: '동구', libraries: 5 },
      { name: '대덕구', libraries: 4 },
      { name: '중구', libraries: 3 },
    ];
    setLibraryData(library);

  };

  return (
    <div className="stats-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <h1>📊 교육격차 분석</h1>
      </header>

      <div className="stats-content" style={{ paddingBottom: '40px' }}>
        {/* 1. 영재고 진학 5년 추이 */}
        <section className="chart-section">
          <div className="section-header">
            <h2>📈 영재고 진학 5년 추이</h2>
            <p className="source">📊 출처: 대전광역시교육청 공공데이터</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={giftedTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="유성구" stroke="#388e3c" strokeWidth={2} />
              <Line type="monotone" dataKey="서구" stroke="#1976d2" strokeWidth={2} />
              <Line type="monotone" dataKey="대덕구" stroke="#f57c00" strokeWidth={2} />
              <Line type="monotone" dataKey="중구" stroke="#d32f2f" strokeWidth={2} />
              <Line type="monotone" dataKey="동구" stroke="#c2185b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="insight-box">
            <strong>📌 발견:</strong> 유성구는 지속적으로 증가 추세 | 동구·중구는 절대 수가 부족
          </div>
        </section>

        {/* 2. 구별 학원 수 */}
        <section className="chart-section">
          <div className="section-header">
            <h2>🏢 구별 학원 및 교습소 수</h2>
            <p className="source">📊 출처: 동부·서부 교육지원청 학원 현황 (2026.04.30)</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clubData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="academies" fill="#8884d8" name="학원 수" />
            </BarChart>
          </ResponsiveContainer>
          <div className="insight-box">
            <strong>📌 발견:</strong> 서구 14,666개 (매우 많음) | 동구 2,470개 (5배 격차)
          </div>
        </section>

        {/* 3. 공공도서관 수 */}
        <section className="chart-section">
          <div className="section-header">
            <h2>📚 공공도서관 수</h2>
            <p className="source">📊 출처: 대전광역시 공공데이터포털</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={libraryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="libraries" fill="#ff7c7c" name="도서관 수" />
            </BarChart>
          </ResponsiveContainer>
          <div className="insight-box">
            <strong>📌 발견:</strong> 유성구 12개 (충분) | 중구 3개 (심각한 부족)
          </div>
        </section>

        {/* 4. 종합 지수 */}
        <section className="chart-section">
          <div className="section-header">
            <h2>🎯 종합 교육 자원 점수</h2>
            <p className="source">📊 학원(60%) + 영재고진학률(30%) + 도서관(10%) 종합 지수</p>
          </div>
          <div style={{ background: '#f0f4ff', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9em', color: '#1565c0' }}>
            <strong>📐 점수 계산식:</strong> 학원 정규화×60 + 영재고진학률×30 + 도서관×10
            <br/>
            <span style={{ fontSize: '0.85em' }}>
              (학원이 가장 중요한 교육 시장 지표, 도서관은 공공 인프라)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: '서구', score: 95 },
              { name: '유성구', score: 71 },
              { name: '중구', score: 35 },
              { name: '대덕구', score: 34 },
              { name: '동구', score: 30 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#2196f3" name="점수" />
            </BarChart>
          </ResponsiveContainer>
          <div className="insight-box">
            <strong>📌 결론:</strong> 서구 95점(학원 가장 많음) | 동구 30점(취약) - 65점 격차 심각
          </div>
        </section>

        {/* 결론 */}
        <section className="conclusion-section">
          <h2>🚨 교육격차의 현실</h2>
          <div className="conclusion-box">
            <p><strong>동구:</strong> 학원 2,470개 + 도서관 5개 → 가장 부족한 지역</p>
            <p><strong>중구:</strong> 도서관 3개 (인구 60,000명당 1개) → 공공 인프라 극심히 부족</p>
            <p><strong>유성구:</strong> 학원 7,502개 + 도서관 12개 → 최고의 교육 환경</p>
          </div>
          <div className="solution-box">
            <h3>💡 사이언스 셔틀의 역할</h3>
            <p>동구·중구 학생들이 유성구·서구의 프로그램에 쉽게 접근할 수 있도록 무료 셔틀 운영</p>
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
        <button className="nav-btn active" onClick={() => navigate('/statistics')}>
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

export default StatisticsDashboard;
