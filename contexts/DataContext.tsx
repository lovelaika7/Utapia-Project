import React, { createContext, useContext, useEffect, useState } from 'react';
import { Song, ArtistMeta } from '../types';
import { fetchSheetData } from '../services/sheetService';

interface DataContextType {
  songs: Song[];
  artistMeta: Record<string, ArtistMeta>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artistMeta, setArtistMeta] = useState<Record<string, ArtistMeta>>({});
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    const data = await fetchSheetData();
    
    // Sort songs by newest first (optional)
    const sortedSongs = data.songs.sort((a, b) => 
        parseInt(b.releaseYear) - parseInt(a.releaseYear)
    );

    setSongs(sortedSongs);
    setArtistMeta(data.artistMeta);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ songs, artistMeta, loading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};