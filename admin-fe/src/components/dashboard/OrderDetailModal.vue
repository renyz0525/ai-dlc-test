<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="w-full max-w-4xl"
    data-testid="order-detail-modal"
    @update:visible="handleClose"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-bold">
          {{ headerTitle }}
        </h2>
        <Badge
          v-if="orderCount > 0"
          :value="orderCount"
          severity="info"
        />
      </div>
    </template>

    <div v-if="!table" class="text-center text-gray-500 py-8">
      테이블 정보를 찾을 수 없습니다.
    </div>

    <div v-else-if="orders.length === 0" class="text-center text-gray-500 py-8">
      주문 내역이 없습니다.
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in sortedOrders"
        :key="order.id"
        class="border rounded-lg p-4 bg-gray-50"
        :data-testid="`order-detail-${order.id}`"
      >
        <!-- Order Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-sm text-gray-500">주문 ID</p>
            <p class="font-mono text-sm">{{ order.id }}</p>
            <p class="text-xs text-gray-400 mt-1">
              {{ formatDateTime(order.createdAt) }}
            </p>
          </div>
          <OrderStatusControl
            :order="order"
            @status-change="handleStatusChange"
          />
        </div>

        <!-- Order Items -->
        <OrderItemList :items="order.items" />

        <!-- Order Total -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t">
          <span class="font-bold text-lg">합계</span>
          <span class="font-bold text-xl text-blue-600">
            ₩{{ order.totalAmount.toLocaleString('ko-KR') }}
          </span>
        </div>

        <!-- Delete Button -->
        <div class="flex justify-end mt-4">
          <Button
            label="주문 삭제"
            severity="danger"
            size="small"
            icon="pi pi-trash"
            :data-testid="`order-delete-button-${order.id}`"
            @click="handleDeleteOrder(order.id)"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <Button
          label="닫기"
          severity="secondary"
          data-testid="order-detail-modal-close-button"
          @click="handleClose"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import Dialog from 'primevue/dialog';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import type { Table, Order } from '@/types';
import OrderItemList from './OrderItemList.vue';
import OrderStatusControl from './OrderStatusControl.vue';

export default defineComponent({
  name: 'OrderDetailModal',
  components: {
    Dialog,
    Badge,
    Button,
    OrderItemList,
    OrderStatusControl,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    table: {
      type: Object as PropType<Table | null>,
      default: null,
    },
    orders: {
      type: Array as PropType<Order[]>,
      required: true,
    },
  },
  emits: ['close', 'status-change', 'delete-order'],
  setup(props, { emit }) {
    const headerTitle = computed(() => {
      if (!props.table) return '주문 상세';
      return `테이블 ${props.table.tableNumber} - 주문 상세`;
    });

    const orderCount = computed(() => props.orders.length);

    const sortedOrders = computed(() => {
      return [...props.orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    function formatDateTime(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    function handleClose() {
      emit('close');
    }

    function handleStatusChange({ orderId, newStatus }: { orderId: string; newStatus: string }) {
      emit('status-change', { orderId, newStatus });
    }

    function handleDeleteOrder(orderId: string) {
      emit('delete-order', orderId);
    }

    return {
      headerTitle,
      orderCount,
      sortedOrders,
      formatDateTime,
      handleClose,
      handleStatusChange,
      handleDeleteOrder,
    };
  },
});
</script>
