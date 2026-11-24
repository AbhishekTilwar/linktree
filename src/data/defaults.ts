import type { AppData } from '../types'

export const STORAGE_KEY = 'linktree-data-v2'
export const ADMIN_PASSWORD = 'Add@123'

export const defaultData: AppData = {
  profile: {
    name: 'The Nomad Club | Travel & Social',
    bio: '@join.nomad.club',
    avatarUrl: '/nomad_logo.png',
  },
  links: [
    {
      id: '1',
      title: 'Instagram',
      url: 'https://instagram.com/join.nomad.club',
    },
  ],
}
