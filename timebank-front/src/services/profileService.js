import { apiFetch } from './api'

export async function getMyProfile() {
  return apiFetch('/auth/me')
}

export async function updateMyProfile(payload) {
  return apiFetch('/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}