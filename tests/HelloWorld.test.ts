import { mount } from '@vue/test-utils'
import AppAlert from '@/app/components/AppAlert.vue'

test('renders properly', () => {
  const wrapper = mount(AppAlert, {
    props: { msg: 'Hello Vitest' }
  })
  expect(wrapper.text()).toContain('Hello Vitest')
})
