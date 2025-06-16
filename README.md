## ⚙️ 실행 방법

### 1. 의존성 설치
```
npm install
```
### 2. 앱 실행
```
npx expo start
```
## 📂 폴더 구조
```
potato-diary
├──app/
│   ├── index.tsx                # 홈 화면
│   ├── calendar.tsx             # 감정 캘린더
│   ├── chatbot.tsx              # 챗봇 대화화면
│   ├── chathistory.tsx          # 대화 목록
│   ├── chathistorypage.tsx      # 대화 상세
│   ├── recommend.tsx            # 콘텐츠 추천 화면
│   ├── signup.tsx               # 회원가입
│   ├── settings.tsx             # 설정 페이지
│   ├── voicerecord.tsx          # 음성 녹음 처리
│   ├── mypage.tsx               # 마이페이지
│   ├── tabs/_layout.tsx         # 탭 네비게이션 구조
│   ├── write/[date].tsx         # 일기 작성 페이지
│   ├── view/[date].tsx          # 일기 상세보기
│   ├── modify/[date].tsx        # 일기 수정 페이지
│   ├── layout.tsx              # 전체 앱 네비게이션 구조
├──components/                # 공통 UI 컴포넌트 모음
├──constants/                 # 색상, 폰트 등 상수값
├──contexts/                  # 상태관리
├──styles/                    # 전역 스타일 정의
├──utils/                     # 날짜, 음성처리 등 유틸 함수
├──assets/                    # 이미지, 폰트, 아이콘 등 정적 리소스
├──app.json                   # Expo 앱 설정
├──package.json               # npm 종속성 목록
├──tsconfig.json              # 타입스크립트 설정
├──metro.config.js            # 메트로 번들러 설정
├──google-services.json       # Firebase 연동 설정

```
