import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AppointmentButton from "../AppointmentButton.vue"
import AppointmentList from '../AppointmentList.vue'
import BookingForm from '../BookingForm.vue'
import { useStore } from '@/stores/store.js'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('AppointmentButton', () => {
  it('emits select event when clicked', async () => {
    const wrapper = mount(AppointmentButton, {
      props: { time: '10:00', isBooked: false }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted().select).toBeTruthy()
    expect(wrapper.emitted().select[0]).toEqual(['10:00'])
  })
})

describe('AppointmentList', () => {
  it('renders correct number of appointment buttons', () => {
    const store = useStore()
    store.weekTimeSlots = {
      Hétfő: [{ time: '08:00', isBooked: false }, { time: '09:00', isBooked: false }],
      Kedd: [{ time: '10:00', isBooked: false }]
    }
    const wrapper = mount(AppointmentList)
    const buttons = wrapper.findAllComponents({ name: 'AppointmentButton' })
    expect(buttons.length).toBe(3)
  })
})

describe('BookingForm', () => {
  it('correctly formats selected time slot', () => {
    const wrapper = mount(BookingForm, {
      props: { selectedTimeSlot: '1. hét Hétfő 08:00' }
    })
    const formattedSlot = wrapper.vm.formattedSelectedTimeSlot
    expect(formattedSlot).toBe('2025/03/03 08:00')
  })
})