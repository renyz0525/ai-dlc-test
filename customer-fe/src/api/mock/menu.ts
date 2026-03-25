import type { Category, Menu } from '@/types'
import { mockCategories, mockMenus } from './data'

export async function mockFetchMenus(): Promise<{ categories: Category[]; menus: Menu[] }> {
  await new Promise((r) => setTimeout(r, 200))
  return {
    categories: [...mockCategories],
    menus: [...mockMenus],
  }
}
