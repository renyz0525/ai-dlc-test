<template>
  <div class="order-status-control flex items-center gap-3" :data-testid="`order-status-control-${order.id}`">
    <!-- Current Status Tag -->
    <Tag
      :value="currentStatusLabel"
      :severity="currentStatusSeverity"
      :data-testid="`order-status-tag-${order.id}`"
    />

    <!-- Next Status Button -->
    <Button
      v-if="nextStatus"
      :label="nextStatusButtonLabel"
      :severity="nextStatusButtonSeverity"
      size="small"
      :data-testid="`order-status-next-button-${order.id}`"
      @click="handleNextStatus"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import type { Order, OrderStatus } from '@/types';

export default defineComponent({
  name: 'OrderStatusControl',
  components: {
    Tag,
    Button,
  },
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },
  emits: ['status-change'],
  setup(props, { emit }) {
    const confirm = useConfirm();

    const currentStatusLabel = computed(() => {
      const statusMap: Record<OrderStatus, string> = {
        pending: '대기중',
        preparing: '준비중',
        completed: '완료',
      };
      return statusMap[props.order.status];
    });

    const currentStatusSeverity = computed(() => {
      const severityMap: Record<OrderStatus, 'warn' | 'info' | 'success'> = {
        pending: 'warn',
        preparing: 'info',
        completed: 'success',
      };
      return severityMap[props.order.status];
    });

    const nextStatus = computed((): OrderStatus | null => {
      const statusFlow: Record<OrderStatus, OrderStatus | null> = {
        pending: 'preparing',
        preparing: 'completed',
        completed: null,
      };
      return statusFlow[props.order.status];
    });

    const nextStatusButtonLabel = computed(() => {
      if (!nextStatus.value) return '';
      const labelMap: Record<OrderStatus, string> = {
        pending: '대기중',
        preparing: '준비중으로',
        completed: '완료로',
      };
      return labelMap[nextStatus.value];
    });

    const nextStatusButtonSeverity = computed(() => {
      if (!nextStatus.value) return 'secondary';
      const severityMap: Record<OrderStatus, 'info' | 'success'> = {
        pending: 'info',
        preparing: 'info',
        completed: 'success',
      };
      return severityMap[nextStatus.value];
    });

    function handleNextStatus() {
      if (!nextStatus.value) return;

      const targetStatus = nextStatus.value;
      const confirmMessage = `주문 상태를 "${nextStatusButtonLabel.value}" 변경하시겠습니까?`;

      confirm.require({
        message: confirmMessage,
        header: '주문 상태 변경',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '확인',
        rejectLabel: '취소',
        accept: () => {
          emit('status-change', {
            orderId: props.order.id,
            newStatus: targetStatus,
          });
        },
      });
    }

    return {
      currentStatusLabel,
      currentStatusSeverity,
      nextStatus,
      nextStatusButtonLabel,
      nextStatusButtonSeverity,
      handleNextStatus,
    };
  },
});
</script>
