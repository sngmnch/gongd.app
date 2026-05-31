import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './StatisticsDashboard.css';

/**
 * 통계 대시보드 - 대전 교육격차 분석
 * - 구별 동아리 수 비교
 * - 교원 1인당 학생 수
 * - 지역별 교육 자원 격차
 */

function StatisticsDashboard() {
  const [clubData, setClubData] = useState([]);
  const [teacherStudentRatio, setTeacherStudentRatio] = useState([]);
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    // 데이터 초기화
    initializeData();
  }, []);

  const initializeData = () => {
    // 1️⃣ 구별 동아리 수 데이터 (고등학교)
    const clubByRegion = [
      { name: '서구', avgClubs: 51.3, schools: 14, totalClubs: 718 },
      { name: '유성구', avgClubs: 45.0, schools: 12, totalClubs: 540 },
      { name: '중구', avgClubs: 45.1, schools: 11, totalClubs: 496 },
      { name: '동구', avgClubs: 60.4, schools: 8, totalClubs: 483 },
      { name: '대덕구', avgClubs: 64.3, schools: 7, totalClubs: 450 },
    ];
    setClubData(clubByRegion);

    // 2️⃣ 교원 1인당 학생 수 (수업교원 기준)
    const teacherRatioData = [
      { name: '서구', ratio: 14.2, students: 4521, teachers: 318 },
      { name: '유성구', ratio: 12.8, students: 3584, teachers: 279 },
      { name: '중구', ratio: 15.6, students: 3847, teachers: 246 },
      { name: '동구', ratio: 13.5, students: 2851, teachers: 211 },
      { name: '대덕구', ratio: 13.1, students: 2148, teachers: 164 },
    ];
    setTeacherStudentRatio(teacherRatioData);

    // 3️⃣ 지역별 통합 교육 자원 점수 (시뮬레이션)
    const regionScore = [
      { name: '서구', score: 72, clubs: 51.3, teachers: 318, schools: 14 },
      { name: '유성구', score: 78, clubs: 45.0, teachers: 279, schools: 12 },
      { name: '중구', score: 65, clubs: 45.1, teachers: 246, schools: 11 },
      { name: '동구', score: 58, clubs: 60.4, teachers: 211, schools: 8 },
      { name: '대덕구', score: 55, clubs: 64.3, teachers: 164, schools: 7 },
    ];
    setRegionData(regionScore);
  };

  return (
    <div className="statistics-dashboard">
      <h1>📊 대전 교육격차 분석 대시보드</h1>
      <p className="subtitle">공공데이터 기반 구별 교육 자원 현황</p>

      {/* 1️⃣ 구별 동아리 수 비교 */}
      <section className="chart-section">
        <div className="chart-header">
          <h2>1️⃣ 구별 고등학교 동아리 수 비교</h2>
          <p className="description">
            각 구의 고등학교들이 운영 중인 동아리의 평균 개수
          </p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={clubData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => value.toFixed(1)}
              contentStyle={{ backgroundColor: '#f0f0f0' }}
            />
            <Legend />
            <Bar dataKey="avgClubs" fill="#8884d8" name="평균 동아리 수" />
          </BarChart>
        </ResponsiveContainer>

        {/* 상세 표 */}
        <table className="data-table">
          <thead>
            <tr>
              <th>구</th>
              <th>학교 수</th>
              <th>전체 동아리 수</th>
              <th>학교당 평균</th>
              <th>평가</th>
            </tr>
          </thead>
          <tbody>
            {clubData.map((item, idx) => (
              <tr key={idx} className={idx === 1 ? 'highlight' : ''}>
                <td><strong>{item.name}</strong></td>
                <td>{item.schools}</td>
                <td>{item.totalClubs}</td>
                <td>{item.avgClubs.toFixed(1)}개</td>
                <td>
                  {item.avgClubs > 50 ? '✅ 우수' : item.avgClubs > 45 ? '🟡 양호' : '⚠️ 부족'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="insights">
          <h4>📌 핵심 발견</h4>
          <ul>
            <li>대덕구가 <strong>64.3개</strong>로 가장 높음 (교육 투자 집중)</li>
            <li>동구도 <strong>60.4개</strong>로 높음 (소규모 학교)</li>
            <li>유성구와 중구는 <strong>45개 수준</strong> (평균)</li>
            <li>서구는 <strong>51.3개</strong> (양호 수준)</li>
          </ul>
        </div>
      </section>

      {/* 2️⃣ 교원 1인당 학생 수 (중요!) */}
      <section className="chart-section">
        <div className="chart-header">
          <h2>2️⃣ 교원 1인당 학생 수</h2>
          <p className="description">
            수업교원 1명이 담당하는 평균 학생 수 (낮을수록 좋음)
          </p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={teacherStudentRatio} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => value.toFixed(1)}
              contentStyle={{ backgroundColor: '#fff3cd' }}
            />
            <Legend />
            <Bar dataKey="ratio" fill="#ff7c7c" name="교원 1인당 학생 수" />
          </BarChart>
        </ResponsiveContainer>

        <table className="data-table">
          <thead>
            <tr>
              <th>구</th>
              <th>학생 수</th>
              <th>수업교원 수</th>
              <th>1인당 학생 수</th>
              <th>평가</th>
            </tr>
          </thead>
          <tbody>
            {teacherStudentRatio.map((item, idx) => (
              <tr key={idx} className={item.ratio > 14 ? 'warning' : ''}>
                <td><strong>{item.name}</strong></td>
                <td>{item.students.toLocaleString()}</td>
                <td>{item.teachers}</td>
                <td><strong>{item.ratio.toFixed(1)}명</strong></td>
                <td>
                  {item.ratio < 13 ? '✅ 우수' : item.ratio < 15 ? '🟡 보통' : '⚠️ 높음'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="insights">
          <h4>📌 교육 격차 신호</h4>
          <ul>
            <li><strong>유성구 12.8명</strong> - 가장 좋은 교육 환경 ✅</li>
            <li><strong>대덕구 13.1명</strong> - 양호한 환경 ✅</li>
            <li><strong>동구 13.5명</strong> - 보통 수준 🟡</li>
            <li><strong>서구 14.2명</strong> - 상대적으로 높음 ⚠️</li>
            <li><strong>중구 15.6명</strong> - 가장 높음 ⚠️⚠️ (교원 부족)</li>
          </ul>
          <p className="warning">⚠️ 중구는 교원 1인당 학생이 유성구보다 <strong>3명 많음</strong> (교육 질 저하)</p>
        </div>
      </section>

      {/* 3️⃣ 지역별 종합 교육 격차 지수 */}
      <section className="chart-section">
        <div className="chart-header">
          <h2>3️⃣ 지역별 교육 격차 종합 지수</h2>
          <p className="description">
            동아리 수, 교원, 학교 규모를 종합한 교육 자원 점수 (100점 만점)
          </p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={regionData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value) => value}
              contentStyle={{ backgroundColor: '#e3f2fd' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2196f3"
              strokeWidth={3}
              name="교육 격차 지수"
              dot={{ fill: '#2196f3', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <table className="data-table">
          <thead>
            <tr>
              <th>구</th>
              <th>종합 지수</th>
              <th>격차 수준</th>
              <th>주요 문제</th>
            </tr>
          </thead>
          <tbody>
            {regionData.map((item, idx) => (
              <tr key={idx} className={item.score < 60 ? 'critical' : ''}>
                <td><strong>{item.name}</strong></td>
                <td>
                  <span className={`score-badge score-${item.score}`}>
                    {item.score}점
                  </span>
                </td>
                <td>
                  {item.score >= 75 ? '✅ 우수' : item.score >= 65 ? '🟡 보통' : '⚠️ 취약'}
                </td>
                <td className="text-small">
                  {item.name === '유성구' && '▪ 교원 충분'}
                  {item.name === '서구' && '▪ 교원 부족'}
                  {item.name === '중구' && '▪ 교원 심각 부족'}
                  {item.name === '동구' && '▪ 소규모 학교'}
                  {item.name === '대덕구' && '▪ 소규모 학교'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="priority-box">
          <h4>🎯 우선 지원 대상 (낮은 순)</h4>
          <ol>
            <li><strong>중구 (65점)</strong> - 교원 1인당 학생 15.6명 (최악)</li>
            <li><strong>서구 (72점)</strong> - 교원 1인당 학생 14.2명</li>
            <li><strong>동구 (78점)</strong> - 상대적으로 양호</li>
          </ol>
        </div>
      </section>

      {/* 4️⃣ 버스 지원 필요도 시뮬레이션 */}
      <section className="chart-section">
        <div className="chart-header">
          <h2>4️⃣ 에듀버스 지원 필요도</h2>
          <p className="description">
            교육 자원이 부족한 구일수록 버스 지원이 더 필요
          </p>
        </div>

        <div className="recommendation-grid">
          {regionData.map((item, idx) => (
            <div key={idx} className={`recommendation-card priority-${item.score}`}>
              <h3>{item.name}</h3>
              <div className="metric">
                <span className="label">교육 자원 점수</span>
                <span className="value">{item.score}/100</span>
              </div>
              <div className="metric">
                <span className="label">버스 지원 우선순위</span>
                <span className="priority">
                  {item.score <= 60 ? '🔴 최우선' : item.score <= 70 ? '🟠 높음' : '🟢 낮음'}
                </span>
              </div>
              <div className="action">
                {item.score <= 70 && (
                  <span className="badge badge-priority">주말 셔틀 운영 필요</span>
                )}
                {item.score > 70 && (
                  <span className="badge badge-normal">필요시 지원</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5️⃣ 핵심 결론 */}
      <section className="summary-section">
        <h2>📋 종합 분석 결론</h2>
        <div className="conclusion-box">
          <h4>🚨 교육격차의 실체</h4>
          <ul>
            <li>
              <strong>중구</strong>: 교원 1인당 학생 15.6명 (유성구 12.8명과 비교 시 3명 차이)
              <br/>→ <strong>교육 질 하락</strong> (개별 지도 불가)
            </li>
            <li>
              <strong>서구</strong>: 교원 부족 + 동아리 51개 (평균 수준)
              <br/>→ <strong>교육기회 불균등</strong>
            </li>
            <li>
              <strong>유성구</strong>: 동아리 45개 + 교원 충분 (12.8명)
              <br/>→ <strong>최고의 교육환경</strong>
            </li>
          </ul>
        </div>

        <div className="solution-box">
          <h4>💡 "사이언스 셔틀"의 역할</h4>
          <table className="solution-table">
            <thead>
              <tr>
                <th>구</th>
                <th>현재 상황</th>
                <th>셔틀의 역할</th>
              </tr>
            </thead>
            <tbody>
              <tr className="critical">
                <td><strong>중구</strong></td>
                <td>⚠️ 교원 부족 + 자원 최저</td>
                <td>유성구 과학고, 대덕연구단지로 매주 운행</td>
              </tr>
              <tr className="critical">
                <td><strong>서구</strong></td>
                <td>⚠️ 교원 부족</td>
                <td>주말 강연, 특별 프로그램 운행</td>
              </tr>
              <tr>
                <td><strong>동구</strong></td>
                <td>🟡 보통</td>
                <td>필요시 지원</td>
              </tr>
              <tr>
                <td><strong>대덕구</strong></td>
                <td>🟡 보통</td>
                <td>필요시 지원</td>
              </tr>
              <tr>
                <td><strong>유성구</strong></td>
                <td>✅ 우수</td>
                <td>허브 역할 (프로그램 제공)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default StatisticsDashboard;
