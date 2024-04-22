import { http } from '../api'

export async function getRegions(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/gds/filter/regions', payload)

  return data
}

export async function getCities(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/gds/filter/cities', payload)

  return data
}

export async function getHotels(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  payload.paging = payload.paging ?? { number: 1, size: 100 }

  const { data } = await http.post('/gds/filter/hotels', payload)

  return data
}

export async function getCategories(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/gds/filter/categories', payload)

  return data
}

export async function getMeals(payload = { term: '', paging: null }) {
  payload.term = payload.term ?? ''
  const { data } = await http.post('/gds/filter/meals', payload)

  return data
}
