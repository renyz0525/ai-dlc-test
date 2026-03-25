# Build Instructions

## Prerequisites
- **Node.js**: v18.x 이상 (v20.x 권장)
- **Package Manager**: npm 9.x 이상
- **OS**: macOS, Linux, Windows
- **Disk**: 최소 500MB 여유 공간

## Build Steps

### 1. Install Dependencies
```bash
cd /Users/yongzher/Desktop/ai-dlc-test-admin-fe
npm install
```

### 2. Configure Environment
개발 환경은 `.env.development` 파일이 자동으로 로드됩니다.

```bash
# .env.development (이미 설정됨)
VITE_API_BASE_URL=http://localhost:3000/api
```

프로덕션 빌드 시 `.env.production`이 사용됩니다:
```bash
# .env.production (이미 설정됨)
VITE_API_BASE_URL=/api
```

### 3. Development Server
```bash
npm run dev
```
- URL: http://localhost:5174
- API Proxy: /api -> http://localhost:3000 (vite.config.ts에서 설정됨)
- HMR 활성화

### 4. Production Build
```bash
npm run build
```

### 5. Verify Build Success
- **Expected Output**: `dist/` 디렉토리에 빌드 결과물 생성
- **Build Artifacts**:
  - `dist/index.html` - 엔트리 HTML
  - `dist/assets/*.js` - JavaScript 번들 (코드 스플리팅 적용)
  - `dist/assets/*.css` - CSS 번들 (TailwindCSS purged)
- **Build Target**: Chrome 120+ (vite.config.ts에서 설정)

### 6. Preview Production Build
```bash
npm run preview
```
- URL: http://localhost:4173

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: node_modules 불일치 또는 lock 파일 손상
- **Solution**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Build Fails with TypeScript Errors
- **Cause**: 타입 불일치 또는 strict mode 위반
- **Solution**:
  ```bash
  npx tsc --noEmit
  ```
  출력된 에러를 확인하고 해당 파일 수정

### TailwindCSS Styles Not Applied
- **Cause**: content path 설정 누락
- **Solution**: `tailwind.config.js`의 content 배열에 해당 파일 경로 포함 확인
