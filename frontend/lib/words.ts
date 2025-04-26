// Common English words
const commonWords = [
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "I",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
  "so",
  "up",
  "out",
  "if",
  "about",
  "who",
  "get",
  "which",
  "go",
  "me",
  "when",
  "make",
  "can",
  "like",
  "time",
  "no",
  "just",
  "him",
  "know",
  "take",
  "people",
  "into",
  "year",
  "your",
  "good",
  "some",
  "could",
  "them",
  "see",
  "other",
  "than",
  "then",
  "now",
  "look",
  "only",
  "come",
  "its",
  "over",
  "think",
  "also",
  "back",
  "after",
  "use",
  "two",
  "how",
  "our",
  "work",
  "first",
  "well",
  "way",
  "even",
  "new",
  "want",
  "because",
  "any",
  "these",
  "give",
  "day",
  "most",
  "us",
  "is",
  "are",
  "was",
  "were",
  "has",
  "had",
  "does",
  "did",
  "been",
  "being",
  "am",
  "should",
  "would",
  "could",
  "may",
  "might",
  "must",
  "shall",
  "will",
  "can",
  "many",
  "much",
  "more",
  "most",
  "some",
  "any",
  "few",
  "little",
  "both",
  "either",
  "neither",
  "each",
  "every",
  "other",
  "another",
  "such",
  "what",
  "whatever",
  "which",
  "whichever",
  "who",
  "whoever",
  "whom",
  "whomever",
  "whose",
  "where",
  "wherever",
  "whichever",
  "who",
  "whoever",
  "whom",
  "whomever",
  "whose",
  "where",
  "wherever",
  "when",
  "whenever",
  "why",
  "how",
  "however",
  "though",
  "although",
  "even",
  "if",
  "unless",
  "until",
  "while",
  "because",
  "since",
  "so",
  "that",
  "whether",
  "after",
  "before",
  "once",
  "since",
  "until",
  "when",
  "whenever",
  "while",
  "where",
  "wherever",
]

// Punctuation marks
const punctuationMarks = [".", ",", "!", "?", ";", ":", "-", "'", '"']

function getLogicalPunctuatedWord(word: string): string {
  const punctuation = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)]

  switch (punctuation) {
    case '.':
    case '!':
    case '?':
    case ',':
    case ';':
    case ':':
      return word + punctuation

    case '"':
    case "'":
      return punctuation + word + punctuation

    case '-':
      // Sometimes we can even hyphenate two small words
      if (Math.random() < 0.5) {
        return word + '-'
      } else {
        return '-' + word
      }

    default:
      return word
  }
}

export function generateWords(count: number, includePunctuation: boolean, includeNumbers: boolean): string[] {
  const result: string[] = []

  for (let i = 0; i < count; i++) {
    let word = commonWords[Math.floor(Math.random() * commonWords.length)]

    if (includePunctuation && Math.random() < 0.3) {
      word = getLogicalPunctuatedWord(word)
    }

    if (includeNumbers && Math.random() < 0.3) {
      const number = Math.floor(Math.random() * 100)
      word = `${number}${word}`
    }

    result.push(word)
  }

  return result
}
