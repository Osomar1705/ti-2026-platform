'use client'

import { useState } from 'react'
import { posts as initialPosts } from '@/lib/mock/community'
import { Surface, SectionTitle } from '@/components/shared/ui'
import type { Post } from '@/lib/types'
import { ChevronRight, Heart, MessageCircle, Send } from 'lucide-react'

const ROOMS = [
  { id: 'general', label: 'GENERAL' },
  { id: 'live', label: 'EN VIVO' },
  { id: 'predictions', label: 'PREDICCIONES' },
  { id: 'ti2026', label: 'TI 2026' },
]

export default function CommunityPage() {
  const [room, setRoom] = useState('general')
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [liked, setLiked] = useState<string[]>([])
  const [newPost, setNewPost] = useState('')

  const filtered = posts.filter((p) => p.room === room || room === 'general')

  function submitPost() {
    if (!newPost.trim()) return
    const post: Post = {
      id: `p-${Date.now()}`,
      userId: 'alex',
      username: 'Alex',
      avatar: 'AL',
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
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Nexus</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Comunidad</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Foro de fans</p>
        <h1 className="mt-1 text-3xl font-bold">Comunidad TI 2026</h1>
        <p className="mt-2 text-sm text-muted-foreground">Comparte tu análisis, predicciones y opiniones con la comunidad.</p>
      </div>

      {/* Room tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-1">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoom(r.id)}
            className={`rounded-md px-4 py-2 font-mono text-xs font-semibold whitespace-nowrap transition-colors ${
              room === r.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
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
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">AL</div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="¿Qué opinas de la partida?"
                  className="w-full resize-none rounded-lg border border-border bg-muted/30 p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
                  rows={3}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Sala: {ROOMS.find((r) => r.id === room)?.label}
                  </span>
                  <button
                    onClick={submitPost}
                    disabled={!newPost.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground disabled:opacity-50"
                  >
                    <Send className="size-3" /> Publicar
                  </button>
                </div>
              </div>
            </div>
          </Surface>

          {/* Posts */}
          {filtered.map((post) => (
            <Surface key={post.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{post.username}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(post.createdAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`ml-auto rounded-full px-1.5 py-0.5 font-mono text-[9px] ${
                      post.room === 'live' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {ROOMS.find((r) => r.id === post.room)?.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-foreground">{post.text}</p>
                  <div className="mt-3 flex gap-4 text-[11px] text-muted-foreground">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1 transition-colors hover:text-primary ${liked.includes(post.id) ? 'text-primary' : ''}`}
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
          ))}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Surface className="p-4">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Salas activas</p>
            {ROOMS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoom(r.id)}
                className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                  room === r.id ? 'bg-primary/10 font-semibold text-primary' : 'text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <span>{r.label}</span>
                <span className="font-mono text-[10px]">{posts.filter((p) => p.room === r.id).length}</span>
              </button>
            ))}
          </Surface>
          <Surface className="p-4">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">TOP USUARIOS</p>
            {['draftsmith', 'ti_stats_bot', 'dotafan2011', 'roshanwatch', 'analystvip'].map((u, i) => (
              <div key={u} className="mb-2 flex items-center gap-2 last:mb-0">
                <span className="font-mono text-[10px] text-muted-foreground w-4">{i + 1}</span>
                <div className="flex size-6 items-center justify-center rounded-full bg-secondary text-[9px] font-bold">
                  {u.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs">{u}</span>
              </div>
            ))}
          </Surface>
        </div>
      </div>
    </div>
  )
}
