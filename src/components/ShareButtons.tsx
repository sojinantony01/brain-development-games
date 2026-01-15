import React from 'react'

export type ShareProps = {
  gameId: string
  gameName: string
  level: number
  score?: number
}

export default function ShareButtons({ gameId, gameName, level, score }: ShareProps): JSX.Element {
  const url = `${location.origin}/brain-development-games/games/${gameId}?level=${level}`
  const text = `I scored ${score ?? 'a score'} on ${gameName} (Level ${level}) in The Mind Arcade! Try it:`

  const copyLink = (): void => {
    navigator.clipboard?.writeText(`${text} ${url}`)
      .then(() => alert('Link copied to clipboard'))
      .catch(() => alert('Could not copy link'))
  }

  const tweet = (): void => {
    const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(href, '_blank', 'noopener')
  }

  const nativeShare = async (): Promise<void> => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: gameName, text: text, url })
      } catch (e) {
        // user cancelled
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className="mt-2 flex gap-2">
      <button onClick={nativeShare} className="px-3 py-1 bg-slate-200 rounded text-sm">Share</button>
      <button onClick={tweet} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Tweet</button>
      <button onClick={copyLink} className="px-3 py-1 bg-slate-50 rounded text-sm">Copy link</button>
    </div>
  )
}
