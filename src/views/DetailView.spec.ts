import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import DetailView from '@/views/DetailView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    params: {
      id: '123',
    },
  })),
}))

describe('DetailView.vue', () => {
  const mockBrewery = {
    id: '1',
    name: 'Brewery One',
    brewery_type: 'micro',
    phone: '1234567890',
    latitude: '37.7749',
    longitude: '-122.4194',
    website_url: 'https://breweryone.com',
    street: '123 Brewery Lane',
    city: 'Brewtown',
    state: 'CA',
  }

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockBrewery,
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders loading state initially', () => {
    const wrapper = mount(DetailView, {
      global: {
        stubs: { GoogleMap: true, Marker: true, RouterLink: RouterLinkStub },
      },
    })

    expect(wrapper.text()).toContain('Loading brewery details...')
  })

  it('fetches and displays brewery details', async () => {
    const wrapper = mount(DetailView, {
      global: {
        stubs: { GoogleMap: true, Marker: true, RouterLink: RouterLinkStub },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain(mockBrewery.name)
    expect(wrapper.text()).toContain(mockBrewery.street)
    expect(wrapper.text()).toContain(mockBrewery.city)
    expect(wrapper.text()).toContain(mockBrewery.state)
    expect(wrapper.text()).toContain('(123) 456-7890')
    expect(wrapper.find('a').attributes('href')).toBe(mockBrewery.website_url)
  })
})
