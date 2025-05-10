import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import ListView from '@/views/ListView.vue'
import ListItems from '@/components/ListItems.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('ListView.vue', () => {
  const mockBreweries = [
    {
      id: '1',
      name: 'Brewery One',
      brewery_type: 'micro',
      city: 'Brewtown',
      state: 'CA',
    },
    {
      id: '2',
      name: 'Brewery Two',
      brewery_type: 'nano',
      city: 'Hopville',
      state: 'OR',
    },
  ]

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockBreweries,
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the search input and clear button', async () => {
    const wrapper = mount(ListView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const searchInput = wrapper.find('.search-input')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toBe('Search breweries...')

    const clearButton = wrapper.find('.clear-button')
    expect(clearButton.exists()).toBe(false)

    const input = wrapper.find('input[type="text"]')

    await input.setValue('Hello Vue Test Utils')

    expect(wrapper.find('.clear-button').exists()).toBe(true)
  })

  it('fetches and displays breweries on mount', async () => {
    const wrapper = mount(ListView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    const listItems = wrapper.findComponent(ListItems)
    expect(listItems.exists()).toBe(true)
    expect(listItems.props('breweries')).toEqual(mockBreweries)
  })

  it('clears the search query when the clear button is clicked', async () => {
    const wrapper = mount(ListView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const input = wrapper.find('input[type="text"]')

    await input.setValue('Hello Vue Test Utils')
    expect(wrapper.find('.clear-button').exists()).toBe(true)

    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()
    await flushPromises()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).searchQuery).toBe('')
    expect(wrapper.find('.clear-button').exists()).toBe(false)
  })

  it('displays "No Breweries found" when the list is empty', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => [],
      ok: true,
      status: 200,
    })

    const wrapper = mount(ListView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('No Breweries found')
  })
})
