<template>
  <div class="order-item-list" data-testid="order-item-list">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              메뉴명
            </th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
              수량
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              단가
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              소계
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="item in items"
            :key="item.id"
            :data-testid="`order-item-${item.id}`"
          >
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ item.menuName }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 text-center">
              {{ item.quantity }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 text-right">
              ₩{{ item.unitPrice.toLocaleString('ko-KR') }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">
              ₩{{ (item.quantity * item.unitPrice).toLocaleString('ko-KR') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { OrderItem } from '@/types';

export default defineComponent({
  name: 'OrderItemList',
  props: {
    items: {
      type: Array as PropType<OrderItem[]>,
      required: true,
    },
  },
});
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
