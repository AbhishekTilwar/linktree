import { useEffect, useState } from 'react'
import { defaultData, STORAGE_KEY } from '../data/defaults'
import type { AppData, LinkItem, Profile } from '../types'

function isValidData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const data = value as AppData
  return Boolean(data.profile) && Array.isArray(data.links)
}

function loadLocal(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return isValidData(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultData)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      const local = loadLocal()
      if (local) {
        if (!cancelled) {
          setData(local)
          setReady(true)
        }
        return
      }

      try {
        const res = await fetch('/links.json', { cache: 'no-store' })
        if (res.ok) {
          const json = (await res.json()) as unknown
          if (!cancelled && isValidData(json)) {
            setData(json)
            setReady(true)
            return
          }
        }
      } catch {
        // fall through to defaults
      }

      if (!cancelled) {
        setData(defaultData)
        setReady(true)
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data, ready])

  const updateProfile = (profile: Profile) => {
    setData((prev) => ({ ...prev, profile }))
  }

  const addLink = (title: string, url: string) => {
    const link: LinkItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      url: url.trim(),
    }
    setData((prev) => ({ ...prev, links: [...prev.links, link] }))
  }

  const updateLink = (id: string, title: string, url: string) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === id ? { ...link, title: title.trim(), url: url.trim() } : link,
      ),
    }))
  }

  const deleteLink = (id: string) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== id),
    }))
  }

  const moveLink = (id: string, direction: 'up' | 'down') => {
    setData((prev) => {
      const index = prev.links.findIndex((link) => link.id === id)
      if (index < 0) return prev
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= prev.links.length) return prev
      const next = [...prev.links]
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...prev, links: next }
    })
  }

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'links.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return {
    data,
    ready,
    updateProfile,
    addLink,
    updateLink,
    deleteLink,
    moveLink,
    resetData,
    exportJson,
  }
}
