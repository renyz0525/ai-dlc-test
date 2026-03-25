import type { Category, Menu, Order } from '@/types'

export const mockCategories: Category[] = [
  { id: 'cat-1', name: '인기 메뉴', sortOrder: 1 },
  { id: 'cat-2', name: '메인 요리', sortOrder: 2 },
  { id: 'cat-3', name: '사이드', sortOrder: 3 },
  { id: 'cat-4', name: '음료', sortOrder: 4 },
]

export const mockMenus: Menu[] = [
  {
    id: 'menu-1',
    categoryId: 'cat-1',
    name: '시그니처 버거',
    price: 15000,
    description: '수제 패티와 신선한 채소가 어우러진 시그니처 버거',
    imageUrl: null,
    sortOrder: 1,
  },
  {
    id: 'menu-2',
    categoryId: 'cat-1',
    name: '치즈 피자',
    price: 18000,
    description: '모짜렐라 치즈가 듬뿍 올라간 클래식 피자',
    imageUrl: null,
    sortOrder: 2,
  },
  {
    id: 'menu-3',
    categoryId: 'cat-2',
    name: '스테이크',
    price: 32000,
    description: '프리미엄 안심 스테이크',
    imageUrl: null,
    sortOrder: 1,
  },
  {
    id: 'menu-4',
    categoryId: 'cat-2',
    name: '파스타',
    price: 14000,
    description: '크림 파스타',
    imageUrl: null,
    sortOrder: 2,
  },
  {
    id: 'menu-5',
    categoryId: 'cat-3',
    name: '감자튀김',
    price: 6000,
    description: '바삭한 감자튀김',
    imageUrl: null,
    sortOrder: 1,
  },
  {
    id: 'menu-6',
    categoryId: 'cat-3',
    name: '샐러드',
    price: 8000,
    description: '신선한 계절 샐러드',
    imageUrl: null,
    sortOrder: 2,
  },
  {
    id: 'menu-7',
    categoryId: 'cat-4',
    name: '콜라',
    price: 3000,
    description: '시원한 콜라',
    imageUrl: null,
    sortOrder: 1,
  },
  {
    id: 'menu-8',
    categoryId: 'cat-4',
    name: '아메리카노',
    price: 4500,
    description: '진한 아메리카노',
    imageUrl: null,
    sortOrder: 2,
  },
]

let orderCounter = 1000

export function createMockOrder(
  items: { menuId: string; menuName: string; quantity: number; unitPrice: number }[],
  totalAmount: number,
  tableId: string,
  sessionId: string
): Order {
  orderCounter++
  return {
    id: `order-${orderCounter}`,
    orderNumber: `ORD-${orderCounter}`,
    tableId,
    sessionId,
    status: 'WAITING',
    totalAmount,
    items: items.map((item, idx) => ({
      id: `oi-${orderCounter}-${idx}`,
      ...item,
    })),
    createdAt: new Date().toISOString(),
  }
}

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-0001',
    tableId: 'table-1',
    sessionId: 'session-1',
    status: 'COMPLETED',
    totalAmount: 21000,
    items: [
      { id: 'oi-1', menuId: 'menu-1', menuName: '시그니처 버거', quantity: 1, unitPrice: 15000 },
      { id: 'oi-2', menuId: 'menu-5', menuName: '감자튀김', quantity: 1, unitPrice: 6000 },
    ],
    createdAt: '2026-03-25T09:00:00Z',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-0002',
    tableId: 'table-1',
    sessionId: 'session-1',
    status: 'PREPARING',
    totalAmount: 18000,
    items: [
      { id: 'oi-3', menuId: 'menu-2', menuName: '치즈 피자', quantity: 1, unitPrice: 18000 },
    ],
    createdAt: '2026-03-25T09:15:00Z',
  },
]
