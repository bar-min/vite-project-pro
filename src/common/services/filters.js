import { http } from '../api'

export async function getRegions(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/filter/regions', payload)

  return data
}

export async function getCities(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/filter/cities', payload)

  return data
}

export async function getHotels(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''

  const { data } = await http.post('/filter/hotels', payload)

  return data
}

export async function getCategories(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/filter/categories', payload)

  return data
}

export async function getMeals(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/filter/meals', payload)

  return data
}

export async function getContextItems(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/filter/context', payload)

  return data
}

export async function searchItems(payload) {
  const { data } = await http.post('/filter/search', payload, {
    headers: {
      Authorization: `Basic ${btoa('iritest:test123')}`
    }
  })

  return data
}

export async function searchItemsByHotelId(id, payload) {
  const { data } = await http.post(`/filter/search/${id}`, payload, {
    headers: {
      Authorization: `Basic ${btoa('iritest:test123')}`
    }
  })

  return data
}
