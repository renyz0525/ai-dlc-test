import type { Category, Menu } from '@/types'
import { api } from './client'
import { mockFetchMenus } from './mock/menu'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function fetchMenus(
  storeId: string
): Promise<{ categories: Category[]; menus: Menu[] }> {
  if (USE_MOCK) {
    return mockFetchMenus()
  }
  const menus = await api.get<Menu[]>(`/api/stores/${storeId}/menus`)
  const categoryMap = new Map<string, Category>()
  menus.forEach((m) => {
    if (!categoryMap.has(m.categoryId)) {
      categoryMap.set(m.categoryId, {
        id: m.categoryId,
        name: m.categoryId,
        sortOrder: 0,
      })
    }
  })
  return { categories: Array.from(categoryMap.values()), menus }
}
