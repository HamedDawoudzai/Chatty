const EMOJI_MAP: Record<string, string> = {
  ':smile:': '😊', ':laugh:': '😂', ':heart:': '❤️', ':thumbsup:': '👍',
  ':thumbsdown:': '👎', ':fire:': '🔥', ':rocket:': '🚀', ':star:': '⭐',
  ':eyes:': '👀', ':wave:': '👋', ':clap:': '👏', ':pray:': '🙏',
  ':tada:': '🎉', ':sob:': '😭', ':thinking:': '🤔', ':100:': '💯',
}

export function replaceShortcodes(text: string): string {
  return text.replace(/:[a-z_]+:/g, (match) => EMOJI_MAP[match] ?? match)
}

export function suggestShortcodes(prefix: string): string[] {
  return Object.keys(EMOJI_MAP).filter(k => k.startsWith(prefix)).slice(0, 8)
}
