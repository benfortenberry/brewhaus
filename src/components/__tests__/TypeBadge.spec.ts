import { mount } from '@vue/test-utils'
import TypeBadge from '@/components/TypeBadge.vue'
import { describe, it, expect } from 'vitest'

describe('TypeBadge.vue', () => {
  it('renders the correct badge class for each brewery type', () => {
    const types = [
      { type: 'micro', expectedClass: 'badge-micro' },
      { type: 'nano', expectedClass: 'badge-nano' },
      { type: 'regional', expectedClass: 'badge-regional' },
      { type: 'brewpub', expectedClass: 'badge-brewpub' },
      { type: 'large', expectedClass: 'badge-large' },
      { type: 'unknown', expectedClass: 'badge-default' },
    ]

    types.forEach(({ type, expectedClass }) => {
      const wrapper = mount(TypeBadge, {
        props: {
          breweryType: type,
        },
      })

      expect(wrapper.classes()).toContain(expectedClass)
    })
  })

  it('formats the brewery type correctly for display', () => {
    const types = [
      { type: 'micro', expectedText: 'Micro' },
      { type: 'nano', expectedText: 'Nano' },
      { type: 'regional', expectedText: 'Regional' },
      { type: 'brewpub', expectedText: 'Brewpub' },
      { type: 'large', expectedText: 'Large' },
      { type: 'unknown', expectedText: 'Unknown' },
    ]

    types.forEach(({ type, expectedText }) => {
      const wrapper = mount(TypeBadge, {
        props: {
          breweryType: type,
        },
      })

      expect(wrapper.text()).toBe(expectedText)
    })
  })

  it('renders with the default badge class when breweryType is not recognized', () => {
    const wrapper = mount(TypeBadge, {
      props: {
        breweryType: 'unknown',
      },
    })

    expect(wrapper.classes()).toContain('badge-default')
    expect(wrapper.text()).toBe('Unknown')
  })
})
