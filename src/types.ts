export type LinkItem = {
  id: string
  title: string
  url: string
}

export type Profile = {
  name: string
  bio: string
  avatarUrl: string
}

export type AppData = {
  profile: Profile
  links: LinkItem[]
}
