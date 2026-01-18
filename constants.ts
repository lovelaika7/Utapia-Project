import { Song, Genre, ArtistMeta } from './types';

const BASE_SONGS: Song[] = [
  {
    id: '1',
    title: 'Ditto',
    translatedTitle: '디토',
    artist: 'NewJeans',
    album: 'OMG',
    coverUrl: 'https://picsum.photos/seed/ditto/400/400',
    youtubeId: 'pSUydWEqKwE',
    genre: 'K-POP',
    releaseYear: '2022',
    tags: ['R&B', 'DANCE'],
    lyrics: [
      {
        original: "Woo woo woo woo ooh",
        romanization: "우 우 우 우 우",
        translation: "우 우 우 우 우"
      },
      {
        original: "Stay in the middle",
        romanization: "스테이 인 더 미들",
        translation: "중간에 있어줘"
      },
      {
        original: "말해줘 say it back, oh, say it ditto",
        romanization: "말해줘 세이 잇 백, 오, 세이 잇 디토",
        translation: "말해줘, 다시 말해줘, ditto라고"
      }
    ]
  },
  {
    id: '2',
    title: 'Idol (アイドル)',
    translatedTitle: '아이돌',
    artist: 'YOASOBI',
    album: 'Idol',
    coverUrl: 'https://picsum.photos/seed/idol/400/400',
    youtubeId: 'ZRtdQ81jPUQ',
    genre: 'ANIMATION',
    releaseYear: '2023',
    tags: ['J-POP'],
    lyrics: [
      {
        original: "無敵の笑顔で荒らすメディア",
        romanization: "무테키노 에가오데 아라스 메디아",
        translation: "무적의 미소로 미디어를 휩쓰는"
      },
      {
        original: "完璧で嘘つきな君は",
        romanization: "칸페키데 우소츠키나 키미와",
        translation: "완벽하고 거짓말쟁이인 너는"
      },
      {
        original: "天才的なアイドル様",
        romanization: "텐사이테키나 아이도루사마",
        translation: "천재적인 아이돌님"
      }
    ]
  },
  {
    id: '3',
    title: 'Espresso',
    translatedTitle: '에스프레소',
    artist: 'Sabrina Carpenter',
    album: 'Espresso',
    coverUrl: 'https://picsum.photos/seed/espresso/400/400',
    youtubeId: 'eVli-tstM5E',
    genre: 'K-POP', // Mapped from POP to K-POP/OST for demo purposes as POP was removed
    releaseYear: '2024',
    tags: ['DANCE', 'DISCO'],
    lyrics: [
      {
        original: "Now he's thinkin' 'bout me every night, oh",
        romanization: "나우 히즈 띵킹 어바웃 미 에브리 나이트, 오",
        translation: "이제 그는 매일 밤 내 생각을 해"
      },
      {
        original: "Is it that sweet? I guess so",
        romanization: "이즈 잇 댓 스윗? 아이 게스 소",
        translation: "그렇게 달콤해? 그런가 봐"
      },
      {
        original: "That's that me espresso",
        romanization: "댓츠 댓 미 에스프레소",
        translation: "그게 바로 나, 에스프레소야"
      }
    ]
  },
  {
    id: '4',
    title: 'Gods',
    translatedTitle: '갓즈',
    artist: 'NewJeans',
    album: 'League of Legends Worlds 2023',
    coverUrl: 'https://picsum.photos/seed/gods/400/400',
    youtubeId: 'C3GouGa0noM',
    genre: 'GAME',
    releaseYear: '2023',
    tags: ['OST'],
    lyrics: [
      { 
        original: "Bad boy, bad boy", 
        romanization: "배드 보이, 배드 보이",
        translation: "나쁜 소년, 나쁜 소년" 
      },
      { 
        original: "Yeah, you know the drill", 
        romanization: "예, 유 노우 더 드릴",
        translation: "그래, 어떻게 해야 하는지 알잖아" 
      }
    ]
  },
  {
    id: '5',
    title: 'Beautiful',
    translatedTitle: '뷰티풀',
    artist: 'Crush',
    album: 'Goblin OST',
    coverUrl: 'https://picsum.photos/seed/goblin/400/400',
    youtubeId: 'WkMEJIBhF5k',
    genre: 'OST',
    releaseYear: '2016',
    tags: ['K-POP', 'DRAMA'],
    lyrics: [
      { 
        original: "It's a beautiful life", 
        romanization: "이츠 어 뷰티풀 라이프",
        translation: "아름다운 인생이야" 
      },
      { 
        original: "난 너의 곁에 있을게", 
        romanization: "난 너의 곁에 있을게", 
        translation: "난 너의 곁에 있을게" 
      }
    ]
  },
  {
    id: '6',
    title: 'Bling-Bang-Bang-Born',
    translatedTitle: '블링 뱅 뱅 본',
    artist: 'Creepy Nuts',
    album: 'Mashle OST',
    coverUrl: 'https://picsum.photos/seed/mashle/400/400',
    youtubeId: 'mLW35ymzELE',
    genre: 'ANIMATION',
    releaseYear: '2024',
    tags: ['J-POP', 'HIP-HOP'],
    lyrics: [
      { 
        original: "Bling-Bang-Bang, Bling-Bang-Bang-Born", 
        romanization: "블링 뱅 뱅, 블링 뱅 뱅 본",
        translation: "블링 뱅 뱅, 블링 뱅 뱅 본" 
      }
    ]
  },
  {
    id: '7',
    title: 'Sparkle (Sparkle)',
    translatedTitle: '스파클',
    artist: 'RADWIMPS',
    album: 'Your Name.',
    coverUrl: 'https://picsum.photos/seed/sparkle/400/400',
    youtubeId: 'aZenmeRytEM',
    genre: 'MOVIE',
    releaseYear: '2016',
    tags: ['J-POP', 'OST'],
    lyrics: [
        {
            original: "運命だとか未来とか",
            romanization: "운메이다 토카 미라이 토카",
            translation: "운명이라든가 미래라든가"
        }
    ]
  }
];

// Generate more songs
const GENERATED_SONGS: Song[] = Array.from({ length: 60 }).map((_, i) => {
  const base = BASE_SONGS[i % BASE_SONGS.length];
  const genres: Genre[] = ['K-POP', 'J-POP', 'ANIMATION', 'DRAMA', 'GAME', 'OST', 'MOVIE'];
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];
  const years = ['2023', '2024', '2025'];
  const randomYear = years[Math.floor(Math.random() * years.length)];
  
  return {
    ...base,
    id: `gen-${i}`,
    title: `${base.title} (Remix ${i + 1})`,
    translatedTitle: `${base.translatedTitle} (리믹스 ${i + 1})`,
    genre: randomGenre,
    releaseYear: randomYear,
    coverUrl: `https://picsum.photos/seed/${i}/400/400`,
    tags: [randomGenre === 'K-POP' ? 'DANCE' : 'R&B'] 
  };
});

export const MOCK_SONGS: Song[] = [...BASE_SONGS, ...GENERATED_SONGS];

// Mock Artist Data (Image & English Name/Subtext)
export const ARTIST_META: Record<string, ArtistMeta> = {
    'NewJeans': { name: 'NewJeans', subName: '뉴진스', imageUrl: 'https://picsum.photos/seed/newjeans/200' },
    'YOASOBI': { name: 'YOASOBI', subName: '요아소비', imageUrl: 'https://picsum.photos/seed/yoasobi/200' },
    'Sabrina Carpenter': { name: 'Sabrina Carpenter', subName: '사브리나 카펜터', imageUrl: 'https://picsum.photos/seed/sabrina/200' },
    'Crush': { name: 'Crush', subName: '크러쉬', imageUrl: 'https://picsum.photos/seed/crush/200' },
    'Creepy Nuts': { name: 'Creepy Nuts', subName: '크리피 너츠', imageUrl: 'https://picsum.photos/seed/creepy/200' },
    'RADWIMPS': { name: 'RADWIMPS', subName: '래드윔프스', imageUrl: 'https://picsum.photos/seed/radwimps/200' },
};