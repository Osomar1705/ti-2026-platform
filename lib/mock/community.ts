import type { Post, ChatMessage } from '../types'

export const posts: Post[] = [
  { id: 'p1', userId: 'u1', username: 'draftsmith', avatar: 'DS', room: 'live', text: '¿Spirit puede cerrar la serie sin llegar al late? Ese Pangolier está imposible de matar.', likes: 86, replies: 24, createdAt: '2026-08-10T15:30:00Z' },
  { id: 'p2', userId: 'u2', username: 'carrytheflag', avatar: 'CF', room: 'predictions', text: 'Mi predicción: Liquid 2–1 GG. El matchup de supports será la clave táctica de la serie.', likes: 41, replies: 12, createdAt: '2026-08-10T15:28:00Z' },
  { id: 'p3', userId: 'u3', username: 'roshanwatch', avatar: 'RW', room: 'live', text: 'La próxima serie empieza en 02:42. ¿Quién entra al bracket final del upper?', likes: 29, replies: 8, createdAt: '2026-08-10T15:25:00Z' },
  { id: 'p4', userId: 'u4', username: 'ti_stats_bot', avatar: 'TS', room: 'ti2026', text: 'ESTADÍSTICA: Yatoro tiene 11 muertes en el torneo en 14 partidas. El mejor ratio de vida del evento.', likes: 112, replies: 31, createdAt: '2026-08-10T15:22:00Z' },
  { id: 'p5', userId: 'u5', username: 'midlaner99', avatar: 'M9', room: 'general', text: 'Collapse es el mejor offlaner del mundo en este momento. No hay debate posible después de lo que hizo en cuartos.', likes: 67, replies: 19, createdAt: '2026-08-10T15:20:00Z' },
  { id: 'p6', userId: 'u6', username: 'analystvip', avatar: 'AV', room: 'predictions', text: 'La economía de Tundra está 12k abajo en la partida 2. Muy difícil la remontada sin un teamfight ganador.', likes: 55, replies: 14, createdAt: '2026-08-10T15:18:00Z' },
  { id: 'p7', userId: 'u7', username: 'heros_fan', avatar: 'HF', room: 'ti2026', text: 'Pangolier tiene 71% de win rate en el TI. ¿Por qué Tundra no lo banea? Es un error garrafal de draft.', likes: 93, replies: 27, createdAt: '2026-08-10T15:15:00Z' },
  { id: 'p8', userId: 'u8', username: 'pushking', avatar: 'PK', room: 'general', text: 'La final va a ser Spirit vs Liquid. Llevo diciéndolo desde grupos. Cualquier otro resultado sería sorpresa total.', likes: 38, replies: 16, createdAt: '2026-08-10T15:12:00Z' },
  { id: 'p9', userId: 'u9', username: 'dotafan2011', avatar: 'DF', room: 'live', text: 'GOAT Yatoro con 11 kills y solo 2 muertes. Alguien para a este chico???', likes: 201, replies: 48, createdAt: '2026-08-10T15:10:00Z' },
  { id: 'p10', userId: 'u10', username: 'bracket_watcher', avatar: 'BW', room: 'ti2026', text: 'Si Aurora gana a Nigma en el lower, el bracket inferior se pone muy interesante. SEA en la final del lower bracket.', likes: 44, replies: 11, createdAt: '2026-08-10T15:08:00Z' },
]

export const chatMessages: ChatMessage[] = [
  { id: 'c1', userId: 'u1', username: 'draftsmith', text: 'COLAPSEEEEE', timestamp: '27:38', reactions: { '🔥': 14, '😱': 6 } },
  { id: 'c2', userId: 'u9', username: 'dotafan2011', text: 'Yatoro con aegis no tiene counters', timestamp: '27:35', reactions: { '👑': 22 } },
  { id: 'c3', userId: 'u4', username: 'ti_stats_bot', text: 'Estadística: Yatoro con Morphling tiene 87% win rate en este TI', timestamp: '27:30', reactions: { '📊': 8 } },
  { id: 'c4', userId: 'u6', username: 'analystvip', text: 'Tundra necesita un miracle teamfight para sobrevivir este juego', timestamp: '27:22', reactions: { '🙏': 5 } },
  { id: 'c5', userId: 'u7', username: 'heros_fan', text: 'Pangolier mid fue la decisión correcta, Nine no puede chequearlo', timestamp: '27:18', reactions: { '💯': 11 } },
  { id: 'c6', userId: 'u3', username: 'roshanwatch', text: 'El aegis expira en 2 minutos, Spirit tiene que presionar YA', timestamp: '27:10', reactions: { '⚡': 9 } },
  { id: 'c7', userId: 'u2', username: 'carrytheflag', text: 'GG incoming. Spirit 2-0 la serie confirmo', timestamp: '27:05', reactions: { '🏆': 31 } },
  { id: 'c8', userId: 'u5', username: 'midlaner99', text: 'Rubick de Saksa no puede robarle el ultimate a Pangolier en teamfight, too fast', timestamp: '26:58', reactions: { '🤔': 7 } },
  { id: 'c9', userId: 'u8', username: 'pushking', text: 'Tidehunter de 33 llegó demasiado tarde al teamfight anterior', timestamp: '26:45', reactions: { '😤': 4 } },
  { id: 'c10', userId: 'u10', username: 'bracket_watcher', text: 'Spirit a la gran final del upper bracket', timestamp: '26:38', reactions: { '🎉': 44 } },
  { id: 'c11', userId: 'u1', username: 'draftsmith', text: 'Marci de Mira es lo mejor que hemos visto en este TI', timestamp: '26:30', reactions: { '❤️': 18 } },
  { id: 'c12', userId: 'u9', username: 'dotafan2011', text: 'Que Morphling no esté baneado es un regalo para Spirit', timestamp: '26:22', reactions: { '🎁': 12 } },
  { id: 'c13', userId: 'u4', username: 'ti_stats_bot', text: 'Diferencia de net worth actual: +12.5k Radiant', timestamp: '26:15', reactions: { '📈': 6 } },
  { id: 'c14', userId: 'u6', username: 'analystvip', text: 'Ancient Apparition de Miroslaw es su mayor contribución, ese ice blast es letal', timestamp: '26:08', reactions: { '❄️': 9 } },
  { id: 'c15', userId: 'u7', username: 'heros_fan', text: 'TORONTOTOKYO en modo dios esta partida', timestamp: '26:00', reactions: { '🔥': 27 } },
  { id: 'c16', userId: 'u3', username: 'roshanwatch', text: 'Roshan spawn en 4 minutos aproximadamente', timestamp: '25:52', reactions: { '🦁': 15 } },
  { id: 'c17', userId: 'u2', username: 'carrytheflag', text: 'Tundra necesita ganar este próximo teamfight o es game over', timestamp: '25:44', reactions: { '😬': 8 } },
  { id: 'c18', userId: 'u5', username: 'midlaner99', text: 'Primal Beast de Collapse tiene los stuns perfectos en cada teamfight', timestamp: '25:36', reactions: { '💪': 13 } },
  { id: 'c19', userId: 'u8', username: 'pushking', text: 'Spirit va a ganar el TI 2026, lo sé desde el primer día', timestamp: '25:28', reactions: { '🏆': 19 } },
  { id: 'c20', userId: 'u10', username: 'bracket_watcher', text: 'Este nivel de juego es TI-worthy, qué final tan buena se nos viene', timestamp: '25:20', reactions: { '✨': 32 } },
]
