export interface LyricLine {
  time?: string; // Optional timestamp for future sync
  original: string;
  romanization?: string; // For K-POP/J-POP
  translation?: string; // Korean translation
}

export type Genre = 'K-POP' | 'J-POP' | 'R&B' | 'ANIMATION' | 'MOVIE' | 'DRAMA' | 'GAME' | 'OST';

export interface Song {
  id: string;
  title: string;
  translatedTitle?: string; // Added translated title
  artist: string;
  album: string;
  coverUrl: string;
  youtubeId: string;
  genre: Genre;
  releaseYear: string;
  lyrics: LyricLine[];
  tags: string[];
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedImageResult {
  url: string;
  prompt: string;
}

export interface ArtistMeta {
  name: string;
  subName: string; // English name or Translation
  imageUrl: string;
}