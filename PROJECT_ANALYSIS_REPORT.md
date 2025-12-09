# 4beans MOA 프로젝트 분석 보고서

## 📋 프로젝트 개요

**MOA (모아)** 는 OTT 구독 서비스를 공유하는 파티 매칭 플랫폼입니다.
사용자들이 넷플릭스, 유튜브 프리미엄 등의 구독 서비스를 함께 이용하여 비용을 절감할 수 있도록 지원합니다.

### 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | React 18, Vite, Zustand, TailwindCSS, Axios |
| **Backend** | Spring Boot 3.x, MyBatis, MySQL |
| **인증** | JWT (Access/Refresh Token), OAuth 2.0 (카카오, 구글) |
| **결제** | Toss Payments (빌링키 기반 자동결제) |
| **금융** | 오픈뱅킹 API (계좌 등록, 1원 인증, 정산 이체) |

---

## 🏗️ 시스템 아키텍처

### 백엔드 구조
```
com.moa/
├── auth/           # JWT 인증 필터, 핸들러
├── config/         # Security, OAuth, OpenBanking 설정
├── domain/         # 도메인 모델 (User, Party, Payment 등)
├── dao/            # MyBatis Mapper 인터페이스
├── dto/            # 요청/응답 DTO
├── service/        # 비즈니스 로직
├── web/            # REST Controller
├── scheduler/      # 결제/정산 스케줄러
└── common/         # 공통 유틸, 예외 처리
```

### 프론트엔드 구조
```
src/
├── api/            # API 클라이언트 (httpClient, authApi 등)
├── components/     # 공통 컴포넌트 (Header, Footer, UI)
├── pages/          # 페이지 컴포넌트
├── store/          # Zustand 상태 관리
├── services/       # 비즈니스 로직
└── hooks/          # 커스텀 훅
```

---

## 📊 기능별 분석

### 1. 회원 관리 (User)

#### ✅ 잘된 부분
- **이메일 회원가입**: 이메일 인증 토큰 기반 검증 구현
- **OAuth 로그인**: 카카오, 구글 소셜 로그인 완벽 지원
- **JWT 인증**: Access/Refresh Token 분리, 자동 갱신 로직 구현
- **본인인증**: PASS 인증 연동 (CI 기반 중복 가입 방지)
- **비밀번호 정책**: 규칙 검증, 재설정 토큰 기반 복구

#### ⚠️ 수정 필요
- **LoginPage.jsx**: Password 필드가 `<form>` 태그 안에 없음 (브라우저 경고)
- **loginPageLogic.js**: Google OAuth client_id 중복 선언 (라인 26-27)
```javascript
// 수정 전
client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,  // 중복!

// 수정 후
client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
```

---

### 2. 로그인/인증 (Auth)

#### ✅ 잘된 부분
- **토큰 관리**: Zustand persist로 localStorage 저장
- **자동 갱신**: 401 에러 시 Refresh Token으로 자동 재발급
- **요청 큐잉**: 토큰 갱신 중 다른 요청 대기 처리
- **로그아웃**: 서버/클라이언트 토큰 동시 무효화

#### ⚠️ 수정 필요
- **CORS 설정**: `192.168.*:5173` 패턴이 두 번 설정됨 (SecurityConfig.java)
```java
// 중복 설정 제거 필요
config.setAllowedOriginPatterns(origins);  // 첫 번째
config.setAllowedOriginPatterns(List.of(...));  // 두 번째 (덮어씀)
```

---

### 3. 마이페이지 (MyPage)

#### ✅ 잘된 부분
- **프로필 관리**: 닉네임, 프로필 이미지 업로드
- **비밀번호 변경**: 현재 비밀번호 확인 후 변경
- **회원 탈퇴**: 탈퇴 사유 입력, 소프트 삭제 처리
- **계정 복구**: 탈퇴 후 일정 기간 내 복구 가능

#### ⚠️ 수정 필요
- **ProtectedRoute**: 일부 관리자 페이지에 권한 체크 미구현
```jsx
// TODO 주석만 있고 실제 구현 없음
<Route path="/product/add" element={<ProtectedRoute element={<AddProduct />} />}
  // TODO: Add role check for ADMIN
/>
```

---

### 4. 구독 상품 (Product/Subscription)

#### ✅ 잘된 부분
- **상품 CRUD**: 관리자 전용 상품 등록/수정/삭제
- **카테고리 분류**: OTT 서비스별 분류
- **구독 관리**: 사용자별 구독 내역 조회

#### ⚠️ 수정 필요
- **ProductRestController2.java**: 중복 컨트롤러 존재 (정리 필요)
- **권한 분리**: 상품 등록/수정은 ADMIN만 가능하도록 프론트에서도 체크 필요

---

### 5. 파티 (Party)

#### ✅ 잘된 부분
- **파티 생성 플로우**:
  1. 파티 정보 입력 (PENDING_PAYMENT)
  2. 방장 보증금 결제 (RECRUITING)
  3. 파티원 모집 완료 (ACTIVE)
- **OTT 계정 관리**: 방장만 수정 가능
- **멤버 관리**: 현재 인원 자동 계산
- **상태 관리**: Enum 기반 상태 전이

#### ⚠️ 수정 필요
- **파티 탈퇴**: v1.0에서 미구현 (FEATURE_NOT_AVAILABLE 예외)
```java
// PartyService.java
void leaveParty(Integer partyId, String userId);
// v1.0: 기능 제외 (v2.0에서 구현 예정)
```

---

### 6. 파티 가입 (Join Party)

#### ✅ 잘된 부분
- **통합 결제**: 보증금 + 첫 달 구독료 동시 결제
- **중복 가입 방지**: 이미 가입한 파티 체크
- **정원 확인**: 최대 인원 초과 방지
- **트랜잭션 처리**: 결제 실패 시 전체 롤백

#### ⚠️ 수정 필요
- 없음 (잘 구현됨)

---

### 7. 결제 (Payment)

#### ✅ 잘된 부분
- **Toss Payments 연동**: 빌링키 기반 자동결제
- **결제 유형 분리**: INITIAL(첫 달), MONTHLY(월별)
- **중복 결제 방지**: (partyMemberId, targetMonth) UNIQUE 제약
- **자동 결제 스케줄러**: 매일 새벽 2시 실행
- **재시도 로직**: 실패 시 최대 4회 재시도

#### ⚠️ 수정 필요
- **paymentApi.js**: API 경로 불일치 가능성
```javascript
// 현재
const apiResponse = await httpClient.get("/v1/payments/my");

// 백엔드 확인 필요 - /api/v1/payments/my vs /api/payments/my
```

---

### 8. 정산 (Settlement)

#### ✅ 잘된 부분
- **월별 정산**: 매월 1일 새벽 4시 자동 실행
- **수수료 계산**: 15% 플랫폼 수수료 차감
- **오픈뱅킹 이체**: 방장 계좌로 자동 입금
- **실패 재시도**: 매시간 실패 건 재시도
- **이벤트 발행**: 정산 완료 시 알림 이벤트

#### ⚠️ 수정 필요
- 없음 (잘 구현됨)

---

### 9. 보증금 (Deposit)

#### ✅ 잘된 부분
- **금액 정책**:
  - 방장: 월구독료 전액
  - 파티원: 인당 요금
- **환불 정책**:
  - 시작 2일 전: 전액 환불
  - 시작 1일 전: 50% 환불
  - 시작 후: 전액 몰수
- **몰수금 처리**: 다음 정산에 포함

#### ⚠️ 수정 필요
- **환불 API**: 프론트엔드에서 호출하는 API 미확인

---

### 10. 카드 등록 (Billing)

#### ✅ 잘된 부분
- **Toss 빌링키**: 카드 정보 토큰화
- **자동결제 연동**: 빌링키로 정기 결제
- **성공 페이지**: 등록 완료 후 리다이렉트

#### ⚠️ 수정 필요
- 없음 (잘 구현됨)

---

### 11. 계좌 등록 (OpenBanking)

#### ✅ 잘된 부분
- **오픈뱅킹 OAuth**: 3-legged 인증 플로우
- **1원 인증**: 입금자명에 4자리 코드 포함
- **계좌 검증**: 코드 입력으로 본인 확인
- **정산 이체**: 검증된 계좌로 자동 이체

#### ⚠️ 수정 필요
- **임시 저장소**: 인증 코드를 HashMap에 저장 중 (Redis 권장)
```java
// 현재 (메모리 저장 - 서버 재시작 시 유실)
private final Map<String, String> verificationCodes = new HashMap<>();

// 권장 (Redis 사용)
// @Autowired private RedisTemplate<String, String> redisTemplate;
```

---

### 12. 내 지갑 (MyWallet)

#### ✅ 잘된 부분
- **계좌 정보 조회**: 등록된 계좌 확인
- **카드 정보 조회**: 등록된 카드 확인
- **금융 내역**: 결제/정산 히스토리

#### ⚠️ 수정 필요
- 없음 (잘 구현됨)

---

## 🐛 발견된 버그 및 이슈

### 1. 크리티컬 (Critical)
| 이슈 | 위치 | 설명 |
|------|------|------|
| node_modules 손상 | @babel/parser | `readNumber` → `r0eadNumber` 오타 (재설치 필요) |

### 2. 높음 (High)
| 이슈 | 위치 | 설명 |
|------|------|------|
| CORS 중복 설정 | SecurityConfig.java | allowedOriginPatterns 두 번 호출 |
| Google OAuth 중복 | loginPageLogic.js | client_id 두 번 선언 |

### 3. 중간 (Medium)
| 이슈 | 위치 | 설명 |
|------|------|------|
| Form 태그 누락 | LoginPage.jsx | Password 필드 form 미포함 |
| 권한 체크 미구현 | App.jsx | 관리자 페이지 TODO 주석만 존재 |
| 임시 저장소 | OpenBankingService.java | HashMap 대신 Redis 권장 |

### 4. 낮음 (Low)
| 이슈 | 위치 | 설명 |
|------|------|------|
| 중복 컨트롤러 | ProductRestController2.java | 정리 필요 |
| API 경로 불일치 | paymentApi.js | /v1/payments vs /payments 확인 필요 |

---

## 📈 개선 권장사항

### 단기 (1-2주)
1. **node_modules 재설치**: `rm -rf node_modules && npm install`
2. **CORS 설정 정리**: 중복 제거
3. **Google OAuth 수정**: 중복 client_id 제거
4. **Form 태그 추가**: 로그인 페이지 접근성 개선

### 중기 (1개월)
1. **Redis 도입**: 인증 코드, 세션 캐싱
2. **관리자 권한 체크**: 프론트엔드 라우트 가드 강화
3. **파티 탈퇴 기능**: v2.0 구현
4. **테스트 코드 작성**: 핵심 비즈니스 로직 단위 테스트

### 장기 (3개월)
1. **모니터링 시스템**: 결제/정산 실패 알림
2. **로깅 강화**: ELK 스택 도입
3. **성능 최적화**: 쿼리 튜닝, 캐싱 전략
4. **보안 강화**: Rate Limiting, SQL Injection 방어

---

## ✅ 결론

**MOA 프로젝트는 전반적으로 잘 설계되고 구현되어 있습니다.**

특히 다음 부분이 우수합니다:
- JWT 기반 인증 시스템
- Toss Payments 연동 및 자동결제
- 오픈뱅킹 API 연동
- 스케줄러 기반 자동화 (결제, 정산)
- 트랜잭션 처리 및 에러 핸들링

개선이 필요한 부분:
- 일부 코드 중복 및 설정 오류
- 임시 저장소 → Redis 전환
- 관리자 권한 체크 강화
- 테스트 코드 보강

---

*보고서 작성일: 2025년 12월 8일*
*분석 대상: 4beans-moa-frontend, 4beans-moa-backend*
