import { normalizeImageUrl } from './imageHelper'

export interface ArticleBlock {
  kind: 'heading' | 'paragraph' | 'quote' | 'list-item' | 'video' | 'image'
  text: string
  alt?: string
  caption?: string
  level?: number
  segments?: Array<{ text: string; href?: string }>
}

function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value.trim())
    const host = url.hostname.toLowerCase()
    const supportedHosts = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com']
    if (!supportedHosts.includes(host)) return null

    const segments = url.pathname.split('/').filter(Boolean)
    const videoId = host.endsWith('youtu.be')
      ? segments[0]
      : url.searchParams.get('v') || (['embed', 'shorts', 'live'].includes(segments[0] || '') ? segments[1] : undefined)

    return videoId && /^[\w-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : null
  } catch {
    return null
  }
}

function getArticleImageUrl(value: string): string | null {
  try {
    const raw = decodeEntities(value.trim())
    const normalized = normalizeImageUrl(raw)
    return normalized || null
  } catch {
    return null
  }
}

function decodeEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    '&amp;': '&',
    '&nbsp;': ' ',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&lt;': '<',
    '&gt;': '>',
  }

  return value
    .replace(/&(?:amp|nbsp|quot|#39|apos|lt|gt);/gi, entity => namedEntities[entity.toLowerCase()] || entity)
    .replace(/&#(\d+);/g, (_entity, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_entity, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
}

function getAttribute(tag: string, name: string): string {
  const attribute = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag)
  return attribute?.[1] || attribute?.[2] || attribute?.[3] || ''
}

function pushArticleImage(blocks: ArticleBlock[], imageTag: string, caption = ''): void {
  const source = getAttribute(imageTag, 'src')
  if (!source) return

  const src = getArticleImageUrl(source)
  if (!src) return

  blocks.push({
    kind: 'image',
    text: src,
    alt: decodeEntities(getAttribute(imageTag, 'alt')),
    ...(caption ? { caption } : {}),
  })
}

function toPlainText(value: string): string {
  return decodeEntities(
    value
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:p|div|li|h[1-6]|blockquote)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
  ).trim()
}

function toInlineSegments(value: string): Array<{ text: string; href?: string }> {
  const segments: Array<{ text: string; href?: string }> = []
  const links = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi
  let match: RegExpExecArray | null
  let cursor = 0

  while ((match = links.exec(value))) {
    const before = toPlainText(value.slice(cursor, match.index))
    if (before) segments.push({ text: before })

    const text = toPlainText(match[2] || '')
    const href = decodeEntities(getAttribute(match[1] || '', 'href')).trim()
    if (text) {
      const safeHref = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : ''
      segments.push(safeHref ? { text, href: safeHref } : { text })
    }
    cursor = match.index + match[0].length
  }

  const trailing = toPlainText(value.slice(cursor))
  if (trailing) segments.push({ text: trailing })
  return segments
}

export function articleContentToBlocks(content?: string): ArticleBlock[] {
  if (!content?.trim()) return []

  const blocks: ArticleBlock[] = []
  const elements = /<figure\b[^>]*>[\s\S]*?<\/figure\s*>|<(h[2-4]|p|li|blockquote)\b[^>]*>[\s\S]*?<\/\1\s*>|<img\b[^>]*\/?>/gi
  let match: RegExpExecArray | null

  while ((match = elements.exec(content))) {
    const element = match[0]
    if (/^<figure\b/i.test(element)) {
      const image = /<img\b[^>]*\/?>/i.exec(element)
      const captionMatch = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption\s*>/i.exec(element)
      const caption = captionMatch ? toPlainText(captionMatch[1] || '') : ''
      if (image) pushArticleImage(blocks, image[0], caption)
      continue
    }

    if (/^<img\b/i.test(element)) {
      pushArticleImage(blocks, element)
      continue
    }

    const tagName = (match[1] || '').toLowerCase()
    const body = element.replace(/^<[^>]+>/, '').replace(/<\/[^>]+>$/, '')
    const kind = tagName.startsWith('h') ? 'heading' : tagName === 'li' ? 'list-item' : tagName === 'blockquote' ? 'quote' : 'paragraph'
    const level = kind === 'heading' ? Number(tagName.slice(1)) : undefined
    const embeds = /\[youtube-video\](https?:\/\/[^\[]+)\[\/youtube-video\]|<img\b[^>]*\/?>/gi
    let embedMatch: RegExpExecArray | null
    let textStart = 0

    while ((embedMatch = embeds.exec(body))) {
      const text = body.slice(textStart, embedMatch.index)
      const segments = toInlineSegments(text)
      const blockText = segments.map(segment => segment.text).join('')
      if (blockText) blocks.push({ kind, text: blockText, ...(level ? { level } : {}), segments })

      if (/^<img\b/i.test(embedMatch[0])) {
        pushArticleImage(blocks, embedMatch[0])
      } else {
        const embedUrl = getYouTubeEmbedUrl(embedMatch[1] || '')
        if (embedUrl) blocks.push({ kind: 'video', text: embedUrl })
      }
      textStart = embedMatch.index + embedMatch[0].length
    }

    const trailingText = body.slice(textStart)
    const trailingSegments = toInlineSegments(trailingText)
    const trailingBlockText = trailingSegments.map(segment => segment.text).join('')
    if (trailingBlockText) blocks.push({ kind, text: trailingBlockText, ...(level ? { level } : {}), segments: trailingSegments })
  }

  if (blocks.length) return blocks
  return toPlainText(content)
    .split(/\n{1,}/)
    .map(text => text.trim())
    .filter(Boolean)
    .map(text => ({ kind: 'paragraph' as const, text }))
}
