import { defineComponent, ref, computed } from 'vue'
import { mount } from '@vue/test-utils'
import { createMetaManager, useMeta, useActiveMeta } from '../../src'

describe('useMeta', () => {
  test('Computed nested objects properties update the active metadata on change', async () => {
    const component = defineComponent({
      setup () {
        const title = ref('Title')

        useMeta(computed(() => ({
          title: title.value
        })))

        const metadata = useActiveMeta()

        return {
          title,
          metadata
        }
      },
      methods: {
        updateTitle (title: string) {
          this.title = title
        }
      },
      template: '<div>test</div>'
    })

    const wrapper = mount(component, {
      global: {
        plugins: [
          createMetaManager()
        ]
      }
    })

    expect(wrapper.vm.title).toBe('Title')
    expect(wrapper.vm.metadata.title).toBe('Title')

    wrapper.vm.updateTitle('Updated Title')
    expect(wrapper.vm.title).toBe('Updated Title')
    expect(wrapper.vm.metadata.title).toBe('Title')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.metadata.title).toBe('Updated Title')
  })
})
