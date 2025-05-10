import { mount, RouterLinkStub } from '@vue/test-utils'
import ListItems from '@/components/ListItems.vue'
import TypeBadge from '@/components/TypeBadge.vue'
import { describe, it, expect } from 'vitest'
import type { Brewery } from '@/types/brewery'

describe('ListItems.vue', () => {
  const mockBreweries: Brewery[] = [
    {
      id: '1',
      name: 'Brewery One',
      brewery_type: 'micro',
      address_1: '123 Brewery Lane',
      city: 'Brewtown',
      state: 'CA',
      phone: '1234567890',
      website_url: 'https://breweryone.com',
      latitude: 37.7749,
      longitude: -122.4194,
      street: '123 Brewery Ln',
      postal_code: '94103',
    },
    {
      id: '2',
      name: 'Brewery Two',
      brewery_type: 'nano',
      address_1: '456 Ale Street',
      city: 'Hopville',
      state: 'OR',
      phone: '9876543210',
      website_url: 'https://brewerytwo.com',
      latitude: 45.5231,
      longitude: -122.6765,
      street: '456 Ale St',
      postal_code: '97201',
    },
  ]

  it('renders a list of breweries', () => {
    const wrapper = mount(ListItems, {
      props: {
        breweries: mockBreweries,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const breweryCards = wrapper.findAll('.brewery-card')
    expect(breweryCards.length).toBe(mockBreweries.length)

    mockBreweries.forEach((brewery, index) => {
      const card = breweryCards[index]
      expect(card.text()).toContain(brewery.name)
      expect(card.text()).toContain(brewery.address_1)
      expect(card.text()).toContain(brewery.city)
      expect(card.text()).toContain(brewery.state)
    })
  })

  it('renders TypeBadge for each brewery', () => {
    const wrapper = mount(ListItems, {
      props: {
        breweries: mockBreweries,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
        components: {
          TypeBadge,
        },
      },
    })

    const typeBadges = wrapper.findAllComponents(TypeBadge)
    expect(typeBadges.length).toBe(mockBreweries.length)

    mockBreweries.forEach((brewery, index) => {
      expect(typeBadges[index].props('breweryType')).toBe(brewery.brewery_type)
    })
  })

  it('renders router-links with correct paths', () => {
    const wrapper = mount(ListItems, {
      props: {
        breweries: mockBreweries,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const hey = wrapper.findAllComponents(RouterLinkStub)
    expect(hey.length).toBe(mockBreweries.length)

    mockBreweries.forEach((brewery, index) => {
      expect(hey[index].props().to).toStrictEqual({ name: 'detail', params: { id: brewery.id } })
    })
  })

  it('renders correctly when no breweries are provided', () => {
    const wrapper = mount(ListItems, {
      props: {
        breweries: [],
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.findAll('.brewery-card').length).toBe(0)
    expect(wrapper.text()).not.toContain('Brewery One')
  })
})
