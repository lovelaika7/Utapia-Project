import { Song, ArtistMeta, LyricLine, Genre } from '../types';

// Helper for safe environment variable access to prevent "process is not defined" crash in browser
const getEnv = (key: string, fallback: string) => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e) {
    // process is not defined in strict browser environments
  }
  return fallback;
};

// Google Sheet Configuration
// Loaded from Environment Variables with fallback for immediate stability
const BASE_PUB_URL = getEnv('REACT_APP_SHEET_URL', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQHrCOSe45I2r-X7jM7x-eLLVtDtWeL9zTGO5ndjtF89ojmxTcAcOsUJkRwasCyj21JZhgbXuN5D1Tk/pub');

export const SHEET_CONFIG = {
  SONG_GID: getEnv('REACT_APP_SHEET_SONG_GID', '2105753516'), 
  ARTIST_GID: getEnv('REACT_APP_SHEET_ARTIST_GID', '172424194'), 
};

// YouTube ID Extractor
// Improved robust regex to handle almost all YouTube URL variations
const extractYoutubeId = (url: string): string => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    
    // 1. If it's already just an ID (11 chars, alphanumeric + - _)
    // Strict check to avoid treating random words as IDs
    const idOnlyRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (idOnlyRegex.test(trimmedUrl)) {
        return trimmedUrl;
    }

    // 2. Extract from full URL
    // Supports: 
    // - youtube.com/watch?v=ID
    // - youtube.com/embed/ID
    // - youtube.com/v/ID
    // - youtu.be/ID
    // - youtube.com/shorts/ID
    // - mobile versions (m.youtube.com)
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = trimmedUrl.match(regExp);
    
    // ID is always 11 characters
    return (match && match[1].length === 11) ? match[1] : '';
};

// CSV Parser Helper
const parseCSV = (text: string) => {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }
  return rows;
};

// Parse Lyrics
// Logic:
// 1. Try to split by double newlines (\n\n) to identify explicit blocks.
// 2. If that results in a single block (and it's long), assume strict 3-line format (Original, Romanization, Translation) 
//    and chunk the lines by 3.
const parseLyrics = (lyricsRaw: string): LyricLine[] => {
    if (!lyricsRaw) return [];
    
    // Legacy support: "^" separator
    if (lyricsRaw.includes('^')) {
        return lyricsRaw.split('\n').map(line => {
            const parts = line.split('^');
            return {
                original: parts[0]?.trim() || '',
                romanization: parts[1]?.trim() || undefined,
                translation: parts[2]?.trim() || undefined
            };
        }).filter(l => l.original);
    }

    // Try splitting by double newlines (paragraphs)
    let blocks = lyricsRaw.split(/\n\s*\n/);
    
    // If only one block is found but it has many lines, it might be a continuous list of 3-line groups
    if (blocks.length === 1 && lyricsRaw.split('\n').length > 3) {
        const allLines = lyricsRaw.split('\n').map(l => l.trim()).filter(l => l);
        const chunkedBlocks: string[] = [];
        
        for (let i = 0; i < allLines.length; i += 3) {
            const chunk = allLines.slice(i, i + 3).join('\n');
            chunkedBlocks.push(chunk);
        }
        blocks = chunkedBlocks;
    }

    return blocks.map((block): LyricLine | null => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length === 0) return null;
        
        return {
            original: lines[0] || '',
            romanization: lines[1] || undefined,
            translation: lines[2] || undefined
        };
    }).filter((l): l is LyricLine => l !== null && !!l.original);
};

export const fetchSheetData = async () => {
  if (!BASE_PUB_URL) {
      console.error("Missing Google Sheet URL (BASE_PUB_URL).");
      return { songs: [], artistMeta: {} };
  }

  try {
    const timestamp = new Date().getTime();
    
    // 1. Fetch Songs
    let songText = '';
    const songUrlWithGid = `${BASE_PUB_URL}?output=csv&gid=${SHEET_CONFIG.SONG_GID}&single=true&t=${timestamp}`;
    
    try {
        const res = await fetch(songUrlWithGid);
        const text = await res.text();
        if (!text.trim().startsWith('<!DOCTYPE html>')) {
            songText = text;
        } else {
             console.warn(`Fetch Songs with GID ${SHEET_CONFIG.SONG_GID} returned HTML. Retrying without GID...`);
        }
    } catch (e) {
        console.warn("Fetch Songs with GID failed", e);
    }

    // Fallback if GID fetch fails
    if (!songText || songText.trim().startsWith('<!DOCTYPE html>')) {
         const songUrlDefault = `${BASE_PUB_URL}?output=csv&t=${timestamp}`; 
         const res = await fetch(songUrlDefault);
         songText = await res.text();
    }

    if (songText.trim().startsWith('<!DOCTYPE html>')) {
         console.error('Failed to fetch Songs. Check GID or Sheet permissions.');
         return { songs: [], artistMeta: {} };
    }

    // 2. Fetch Artists
    const artistUrl = `${BASE_PUB_URL}?output=csv&gid=${SHEET_CONFIG.ARTIST_GID}&single=true&t=${timestamp}`;
    let artistText = '';
    try {
        const artistRes = await fetch(artistUrl);
        artistText = await artistRes.text();
    } catch (e) {
        console.warn("Failed to fetch artist sheet", e);
    }

    // --- Parse Artists ---
    // Columns: 0:Name(Orig), 1:Name(Trans), 2:ImageURL
    const artistMeta: Record<string, ArtistMeta> = {};

    if (artistText && !artistText.trim().startsWith('<!DOCTYPE html>')) {
        const artistRows = parseCSV(artistText).slice(1);
        artistRows.forEach(row => {
            if (row.length >= 1 && row[0]) {
                const name = row[0].trim();
                artistMeta[name] = {
                    name: name,
                    subName: row[1] || name,
                    imageUrl: row[2] && row[2].startsWith('http') ? row[2] : `https://picsum.photos/seed/${name}/200`
                };
            }
        });
    }

    // --- Parse Songs ---
    // 0:Title(Orig), 1:Title(Trans), 2:Artist(Orig), 3:Artist(Trans), 4:Category, 5:Album, 6:Year, 7:YT, 8:Cover, 9:Lyrics, 10:AI
    // 11: Date Added (YYYY-MM-DD)
    const songRows = parseCSV(songText).slice(1);
    console.log(`Fetched ${songRows.length} song rows.`);

    const songs: Song[] = songRows.map((row, index): Song | null => {
        if (row.length < 3 || !row[0] || !row[2]) return null;

        const artistName = row[2].trim();
        const artistTrans = row[3];
        
        // Parse Categories (Column 4)
        const categoryRaw = row[4] || 'K-POP';
        const categories = categoryRaw.split(',').map(s => s.trim()).filter(Boolean);
        const primaryGenre = (categories[0] as Genre) || 'K-POP';

        return {
            id: `song-${index}`,
            title: row[0],
            translatedTitle: row[1],
            artist: artistName,
            artistSubName: artistTrans,
            genre: primaryGenre,
            album: row[5] || 'Single',
            releaseYear: row[6] || new Date().getFullYear().toString(),
            youtubeId: extractYoutubeId(row[7]),
            coverUrl: row[8] && row[8].startsWith('http') ? row[8] : `https://picsum.photos/seed/${row[1]}/400`,
            lyrics: parseLyrics(row[9]),
            aiInterpretation: row[10] || undefined,
            tags: categories, // Store all categories as tags
            dateAdded: row[11] || undefined // Column 11 for Date Added
        };
    }).filter((s): s is Song => s !== null);

    // Merge/Fallback Artist Meta
    songs.forEach(song => {
        if (!artistMeta[song.artist]) {
            artistMeta[song.artist] = {
                name: song.artist,
                subName: song.artistSubName || song.artist,
                imageUrl: song.coverUrl 
            };
        }
    });

    return { songs, artistMeta };

  } catch (error) {
    console.error("Failed to fetch sheet data:", error);
    return { songs: [], artistMeta: {} };
  }
};