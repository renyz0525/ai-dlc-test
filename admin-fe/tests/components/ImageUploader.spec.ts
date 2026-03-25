import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ImageUploader from '@/components/menu/ImageUploader.vue';
import PrimeVue from 'primevue/config';

function mountComponent(props: { currentImageUrl?: string } = {}) {
  return mount(ImageUploader, {
    props: {
      currentImageUrl: props.currentImageUrl,
    },
    global: {
      plugins: [[PrimeVue, {}]],
      stubs: {
        Button: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' },
      },
    },
  });
}

describe('ImageUploader', () => {
  it('renders upload area', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="image-uploader-dropzone"]').exists()).toBe(true);
  });

  it('shows current image when URL provided', () => {
    const wrapper = mountComponent({ currentImageUrl: 'http://example.com/image.jpg' });
    const img = wrapper.find('[data-testid="image-uploader-preview"]');
    expect(img.exists()).toBe(true);
  });

  it('shows upload placeholder when no image', () => {
    const wrapper = mountComponent();
    const placeholder = wrapper.find('[data-testid="image-uploader-dropzone"]');
    expect(placeholder.exists()).toBe(true);
  });
});
