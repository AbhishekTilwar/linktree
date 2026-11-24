import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Ambient } from './components/Ambient'
import { AdminPanel } from './components/AdminPanel'
import { LinkCard } from './components/LinkCard'
import { PasswordModal } from './components/PasswordModal'
import { useAppData } from './hooks/useAppData'

gsap.registerPlugin(useGSAP)

type Modal = 'none' | 'password' | 'admin'

function splitBrand(name: string) {
  const [primary, secondary] = name.split('|').map((part) => part.trim())
  return {
    primary: primary || name,
    secondary: secondary || '',
  }
}

export default function App() {
  const {
    data,
    ready,
    updateProfile,
    addLink,
    updateLink,
    deleteLink,
    moveLink,
    resetData,
    exportJson,
  } = useAppData()
  const [modal, setModal] = useState<Modal>('none')
  const rootRef = useRef<HTMLDivElement>(null)
  const { primary, secondary } = splitBrand(data.profile.name)

  useGSAP(
    () => {
      if (!ready) return

      const mm = gsap.matchMedia()

      mm.add(
        {
          isMotion: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isMotion } = context.conditions as {
            isMotion: boolean
            reduce: boolean
          }

          if (!isMotion) {
            gsap.set(
              [
                '.brand-mark',
                '.brand-kicker',
                '.brand-title span',
                '.brand-bio',
                '.link-card',
                '.footer',
                '.orb',
                '.ring',
              ],
              { opacity: 1, y: 0, scale: 1, clearProps: 'filter' },
            )
            return
          }

          gsap.set('.link-card', { opacity: 0, y: 28, filter: 'blur(8px)' })
          gsap.set('.brand-title span', { opacity: 0, y: 28, rotateX: 40 })
          gsap.set(['.brand-mark', '.brand-kicker', '.brand-bio', '.footer'], {
            opacity: 0,
            y: 18,
          })
          gsap.set('.orb', { opacity: 0, scale: 0.7 })
          gsap.set('.ring', { opacity: 0, scale: 0.85 })

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

          tl.to('.orb', {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power2.out',
          })
            .to(
              '.ring',
              { opacity: 1, scale: 1, duration: 0.9, stagger: 0.1 },
              '-=0.7',
            )
            .to(
              '.brand-mark',
              { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' },
              '-=0.45',
            )
            .to('.brand-kicker', { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
            .to(
              '.brand-title span',
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.65,
                stagger: 0.07,
                ease: 'power3.out',
              },
              '-=0.25',
            )
            .to('.brand-bio', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
            .to(
              '.link-card',
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.65,
                stagger: 0.1,
                ease: 'power3.out',
              },
              '-=0.2',
            )
            .to('.footer', { opacity: 1, y: 0, duration: 0.45 }, '-=0.25')

          gsap.to('.brand-mark', {
            y: -6,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.4,
          })

          gsap.to('.orbit', {
            rotate: 360,
            duration: 18,
            repeat: -1,
            ease: 'none',
            delay: 1,
          })

          gsap.to('.orb-a', {
            x: 24,
            y: -18,
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
          gsap.to('.orb-b', {
            x: -20,
            y: 22,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
          gsap.to('.orb-c', {
            x: 16,
            y: 14,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [ready] },
  )

  if (!ready) {
    return (
      <div className="boot">
        <div className="boot-mark" />
      </div>
    )
  }

  const titleWords = primary.split(/\s+/).filter(Boolean)

  return (
    <div className="shell" ref={rootRef}>
      <Ambient />

      <main className="page">
        <header className="brand">
          <button
            className="brand-mark"
            type="button"
            onClick={() => setModal('password')}
            aria-label="Open links manager"
          >
            <span className="orbit">
              <span className="orbit-dot" />
            </span>
            {data.profile.avatarUrl ? (
              <img
                className="avatar"
                src={data.profile.avatarUrl}
                alt={data.profile.name}
              />
            ) : (
              <div className="avatar avatar-fallback" aria-hidden>
                N
              </div>
            )}
          </button>

          <p className="brand-kicker">{secondary || 'Travel & Social'}</p>

          <button
            className="brand-title-btn"
            type="button"
            onClick={() => setModal('password')}
          >
            <h1 className="brand-title">
              {titleWords.map((word, i) => (
                <span key={`${word}-${i}`}>{word}</span>
              ))}
            </h1>
          </button>

          {data.profile.bio ? (
            <p className="brand-bio">{data.profile.bio}</p>
          ) : null}
        </header>

        <section className="links" aria-label="Links">
          {data.links.map((link, index) => (
            <LinkCard
              key={link.id}
              title={link.title}
              url={link.url}
              index={index}
            />
          ))}

          {data.links.length === 0 ? (
            <div className="empty">
              No links yet — tap the logo to add your first one.
            </div>
          ) : null}
        </section>

        <footer className="footer">
          <span className="footer-rule" />
          <p>
            <em>Made by</em>
            <span> cortiqx.in</span>
          </p>
        </footer>
      </main>

      {modal === 'password' ? (
        <PasswordModal
          onClose={() => setModal('none')}
          onSuccess={() => setModal('admin')}
        />
      ) : null}

      {modal === 'admin' ? (
        <AdminPanel
          profile={data.profile}
          links={data.links}
          onClose={() => setModal('none')}
          onUpdateProfile={updateProfile}
          onAddLink={addLink}
          onUpdateLink={updateLink}
          onDeleteLink={deleteLink}
          onMoveLink={moveLink}
          onReset={resetData}
          onExport={exportJson}
        />
      ) : null}
    </div>
  )
}
