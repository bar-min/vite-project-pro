import { http } from '../api'

export async function getHotelCard(id) {
  const { data } = await http.get(`/ostrovok/v1/hotels/${id}`, {
    headers: {
      Authorization: `Basic ${btoa('iritest:test123')}`
    }
  })
  return data
}
