'use client'

import { useState, useEffect } from 'react'
import { Surface, SectionTitle } from '@/components/shared/ui'
import type { Post } from '@/lib/types'
import { ChevronRight, Heart, MessageCircle, Send, Users } from 'lucide-react'
import { useUser } from '@/lib/hooks/useUser'

const ROOMS = [
  { id: 'general', label: 'GENERAL' },
  { id: 'live', label: 'EN VIVO' },
  { id: 'predictions', label: 'PREDICCIONES' },
  { id: 'ti2026', label: 'TI 2026' },
]

export default function CommunityPage() {
  const { user } = useUser()
  const [room, setRoom] = useState('general')
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem('community_posts') || '[]') } catch { return [] }
  })
  const [liked, setLiked] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem('community_liked') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('community_posts', JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    localStorage.setItem('community_liked', JSON.stringify(liked))
  }, [liked])
  const [newPost, setNewPost] = useState('')

  const filtered = posts.filter((p) => p.room === room || room === 'general')

  function submitPost() {
    if (!newPost.trim()) return
    const displayName = user?.username || 'anon'
    const post: Post = {
      id: `p-${Date.now()}`,
      userId: user?.id || 'anon',
      username: displayName,
      avatar: displayName.slice(0, 2).toUpperCase(),
      room,
      text: newPost.trim(),
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString(),
    }
    setPosts((prev) => [post, ...prev])
    setNewPost('')
  }

  function toggleLike(id: string) {
    setLiked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">Comunidad</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Foro de fans</p>
        <h1 className="mt-1 text-3xl font-bold text-[#F5F1E8]">Comunidad TI 2026</h1>
        <p className="mt-2 text-sm text-[#8A7A5A]">Comparte tu análisis, predicciones y opiniones con la comunidad.</p>
      </div>

      {/* Room tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.03)] p-1">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoom(r.id)}
            className={`rounded-md px-4 py-2 font-mono text-xs font-semibold whitespace-nowrap transition-colors ${
              room === r.id
                ? 'bg-[#D4AF37] text-black'
                : 'text-[#8A7A5A] hover:text-[#F5F1E8]'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {/* Post composer */}
          <Surface className="p-4">
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-xs font-bold text-[#D4AF37]">
                {user ? user.username.slice(0, 2).toUpperCase() : 'AN'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="¿Qué opinas del TI 2026?"
                  className="w-full resize-none rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.03)] p-3 text-sm text-[#F5F1E8] outline-none placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.35)]"
                  rows={3}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#8A7A5A]">
                    Sala: {ROOMS.find((r) => r.id === room)?.label}
                  </span>
                  <button
                    onClick={submitPost}
                    disabled={!newPost.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3 py-1.5 text-xs font-bold text-black disabled:opacity-40"
                  >
                    <Send className="size-3" /> Publicar
                  </button>
                </div>
              </div>
            </div>
          </Surface>

          {/* Posts */}
          {filtered.length === 0 ? (
            <Surface className="p-10">
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <Users className="size-10 text-[#4A3F2F]" />
                <p className="text-sm font-semibold text-[#F5F1E8]">La comunidad está lista para TI 2026</p>
                <p className="text-xs text-[#8A7A5A] max-w-sm">
                  Sé el primero en publicar. Comparte tus predicciones, análisis y opiniones mientras esperamos el inicio del torneo.
                </p>
              </div>
            </Surface>
          ) : (
            filtered.map((post) => (
              <Surface key={post.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.15)] text-xs font-bold text-[#D4AF37]">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#F5F1E8]">{post.username}</span>
                      <span className="font-mono text-[10px] text-[#8A7A5A]">
                        {new Date(post.createdAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`ml-auto rounded-full px-1.5 py-0.5 font-mono text-[9px] ${
                        post.room === 'live' ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'bg-[rgba(138,122,90,0.1)] text-[#8A7A5A]'
                      }`}>
                        {ROOMS.find((r) => r.id === post.room)?.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-5 text-[#F5F1E8]">{post.text}</p>
                    <div className="mt-3 flex gap-4 text-[11px] text-[#8A7A5A]">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 transition-colors hover:text-[#D4AF37] ${liked.includes(post.id) ? 'text-[#D4AF37]' : ''}`}
                      >
                        <Heart className="size-3" fill={liked.includes(post.id) ? 'currentColor' : 'none'} />
                        {post.likes + (liked.includes(post.id) ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="size-3" /> {post.replies}
                      </span>
                    </div>
                  </div>
                </div>
              </Surface>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Surface className="p-4">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Salas</p>
            {ROOMS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoom(r.id)}
                className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                  room === r.id ? 'bg-[rgba(212,175,55,0.1)] font-semibold text-[#D4AF37]' : 'text-[#8A7A5A] hover:bg-[rgba(212,175,55,0.04)]'
                }`}
              >
                <span>{r.label}</span>
                <span className="font-mono text-[10px] text-[#4A3F2F]">
                  {posts.filter((p) => p.room === r.id).length}
                </span>
              </button>
            ))}
          </Surface>

          <Surface className="p-4">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8A7A5A]">SOBRE LA COMUNIDAD</p>
            <p className="text-xs text-[#8A7A5A] leading-5">
              Comparte predicciones, análisis y opiniones. El ranking de usuarios se actualizará
              durante el torneo según la precisión de tus predicciones.
            </p>
          </Surface>
        </div>
      </div>
    </div>
  )
}
