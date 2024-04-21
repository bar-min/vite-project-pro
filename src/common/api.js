import axios from 'axios'

export const http = axios.create({
  baseURL: 'http://evaluation.solvex.bg:7703',
  headers: {
    'Content-Type': 'application/json'
  }
})
