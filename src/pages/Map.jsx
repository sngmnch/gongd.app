import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PageLayout.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function Map() {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // 대전의 5개 구 좌표 및 점수 (새로운 공식: 학원60% + 영재고30% + 도서관10%)
  const districts = [
    { id: 1, name: '동구', score: 30, academies: 2470, libraries: 5, giftedRate: 4.8, lat: 36.3350, lng: 127.4500 },
    { id: 2, name: '중구', score: 35, academies: 3845, libraries: 3, giftedRate: 5.1, lat: 36.3240, lng: 127.4150 },
    { id: 3, name: '서구', score: 95, academies: 14666, libraries: 8, giftedRate: 8.5, lat: 36.3200, lng: 127.3700 },
    { id: 4, name: '유성구', score: 71, academies: 7502, libraries: 12, giftedRate: 9.2, lat: 36.3819, lng: 127.3492 },
    { id: 5, name: '대덕구', score: 34, academies: 2431, libraries: 4, giftedRate: 6.2, lat: 36.3855, lng: 127.4267 },
  ];

  const getColor = (score) => {
    if (score >= 90) return '#388e3c';    // 초록색 (90~100)
    if (score >= 70) return '#2196f3';    // 파랑색 (70~89)
    if (score >= 50) return '#ffc107';    // 노랑색 (50~69)
    if (score >= 30) return '#ff9800';    // 주황색 (30~49)
    return '#d32f2f';                     // 빨강색 (~29)
  };

  const getDistrictIcon = (color, name) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); text-align: center; padding: 5px;">${name}</div>`,
    iconSize: [50, 50],
  });

  return (
    <div className="page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <h1>📍 지역 자원 지도</h1>
      </header>

      <div className="page-content">
        <section className="section">
          <h2>📍 대전 교육 자원 분포 지도</h2>
          <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
            대전의 5개 구 위치를 실제 좌표로 표시합니다. 색상이 밝을수록 교육 자원이 풍부합니다.
          </p>

          {/* Leaflet Map */}
          <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
            <MapContainer center={[36.33, 127.39]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 5개 구 마커 */}
              {districts.map(d => (
                <Marker key={d.id} position={[d.lat, d.lng]} icon={getDistrictIcon(getColor(d.score), d.name)} onClick={() => setSelectedDistrict(d)}>
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{d.name}</strong>
                      <br />
                      점수: {d.score}점
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* 범례 */}
          <div className="legend">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#388e3c' }}></span>
              <span>90~100점 (최우수 - 학원 최다)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#2196f3' }}></span>
              <span>70~89점 (양호)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#ff9800' }}></span>
              <span>30~49점 (부족)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#d32f2f' }}></span>
              <span>~29점 (취약)</span>
            </div>
          </div>
        </section>

        {/* 구별 상세 정보 */}
        <section className="section">
          <h2>구별 교육 자원 현황</h2>
          <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9em', color: '#1565c0' }}>
            💡 <strong>점수 계산 공식:</strong> (학원 수 × 0.3 + 도서관 수 × 3 + 영재고 진학률 × 2) / 최댓값 × 100
            <br/>
            <span style={{ fontSize: '0.85em', color: '#0277bd', marginTop: '5px', display: 'block' }}>
              → 학원(사설교습소)과 공공도서관, 영재고 진학률의 교육자원을 종합 평가합니다.
            </span>
          </div>
          <div className="districts-grid">
            {districts.map(d => (
              <div
                key={d.id}
                className={`district-card ${selectedDistrict?.id === d.id ? 'selected' : ''}`}
                style={{ borderTopColor: getColor(d.score) }}
                onClick={() => setSelectedDistrict(d)}
              >
                <h3>{d.name}</h3>
                <div className="score-display">
                  <span className="score" style={{ color: getColor(d.score), fontWeight: 'bold', fontSize: '1.3em' }}>
                    {d.score}점
                  </span>
                </div>
                <ul className="district-stats">
                  <li>학원: {d.academies.toLocaleString()}개</li>
                  <li>도서관: {d.libraries}개</li>
                  <li>영재고 진학: {d.giftedRate}%</li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 선택된 구 상세 정보 */}
        {selectedDistrict && (
          <section className="section detail-section" style={{ borderLeft: `5px solid ${getColor(selectedDistrict.score)}` }}>
            <h2>{selectedDistrict.name} 상세 정보</h2>
            <div className="detail-content">
              <p>📍 <strong>좌표:</strong> {selectedDistrict.lat.toFixed(3)}°N, {selectedDistrict.lng.toFixed(3)}°E</p>
              <p>📊 <strong>종합 점수:</strong> {selectedDistrict.score}점</p>
              <p>🏢 <strong>학원 및 교습소:</strong> {selectedDistrict.academies.toLocaleString()}개 (실제 데이터)</p>
              <p>📚 <strong>공공도서관:</strong> {selectedDistrict.libraries}개</p>
              <p>🎓 <strong>영재고 진학률:</strong> {selectedDistrict.giftedRate}%</p>
              <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #ddd' }} />
              <p style={{ fontSize: '0.85em', color: '#999' }}>
                📊 데이터 출처: 대전광역시교육청 공공데이터, 공공데이터포털
              </p>

              <div className="recommendation">
                {selectedDistrict.score <= 60 && (
                  <>
                    <h3>🔴 우선 지원 대상</h3>
                    <p>교육 자원이 부족한 지역입니다. 사이언스 셔틀의 매주 운행 대상입니다.</p>
                  </>
                )}
                {selectedDistrict.score > 60 && selectedDistrict.score < 75 && (
                  <>
                    <h3>🟡 보통 지역</h3>
                    <p>교육 자원이 적당한 편입니다. 주말 특별 프로그램 지원 대상입니다.</p>
                  </>
                )}
                {selectedDistrict.score >= 75 && (
                  <>
                    <h3>🟢 우수 지역</h3>
                    <p>교육 자원이 풍부합니다. 다른 지역의 학생들을 수용할 수 있는 허브 역할을 합니다.</p>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      <nav className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span>홈</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/buses')}>
          <span className="nav-icon">🚌</span>
          <span>셔틀</span>
        </button>
        <button className="nav-btn active" onClick={() => navigate('/map')}>
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

export default Map;
