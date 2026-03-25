# Unit Test Execution

## Test Framework
- **Runner**: Vitest 2.1
- **Environment**: jsdom
- **Component Testing**: @vue/test-utils
- **Configuration**: vitest.config.ts

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm run test
```

### 2. Run Tests with Coverage
```bash
npx vitest run --coverage
```

### 3. Run Tests in Watch Mode (Development)
```bash
npx vitest
```

### 4. Run Specific Test Files
```bash
# Store tests only
npx vitest run tests/unit/store/

# Component tests only
npx vitest run tests/components/

# API tests only
npx vitest run tests/unit/api/

# Single file
npx vitest run tests/unit/store/auth.spec.ts
```

## Test File Inventory

### Store Tests (4 files)
| File | Test Cases | Coverage |
|---|---|---|
| tests/unit/store/auth.spec.ts | mutations, getters, actions (login, logout, initAuth, attempt limiting) | auth.ts |
| tests/unit/store/dashboard.spec.ts | mutations, getters, actions (SSE, orders, optimistic updates) | dashboard.ts |
| tests/unit/store/tables.spec.ts | mutations, getters, actions (CRUD, history) | tables.ts |
| tests/unit/store/menus.spec.ts | mutations, getters, actions (menu/category CRUD, sort) | menus.ts |

### Component Tests (6 files)
| File | Test Cases | Coverage |
|---|---|---|
| tests/components/LoginForm.spec.ts | rendering, locked state display | LoginForm.vue |
| tests/components/TableCard.spec.ts | rendering, click emit, alert animation | TableCard.vue |
| tests/components/OrderStatusControl.spec.ts | status tag, next button visibility | OrderStatusControl.vue |
| tests/components/MenuCard.spec.ts | name/price display, edit emit | MenuCard.vue |
| tests/components/SidebarNav.spec.ts | nav items, logout button | SidebarNav.vue |
| tests/components/ImageUploader.spec.ts | upload area, preview, placeholder | ImageUploader.vue |

### API Tests (2 files)
| File | Test Cases | Coverage |
|---|---|---|
| tests/unit/api/client.spec.ts | Authorization header interceptor | client.ts |
| tests/unit/api/sse.spec.ts | connect, disconnect, events, reconnect, max retries | sse.ts |

## Review Test Results
- **Expected**: 모든 테스트 통과, 0 failures
- **Test Report**: 터미널 출력 확인
- **Coverage Report**: `coverage/` 디렉토리 (--coverage 옵션 사용 시)

## Fix Failing Tests
1. 실패한 테스트의 에러 메시지 확인
2. 해당 소스 코드 또는 테스트 코드 수정
3. `npx vitest run [실패한 파일]`로 재실행
4. 전체 테스트 재실행으로 regression 확인
