import React, { createContext, useContext, useEffect, useState } from 'react';
import { Song, ArtistMeta } from '../types';
import { fetchSheetData } from '../services/sheetService';

interface DataContextType {
  songs: Song[];
  artistMeta: Record<string, ArtistMeta>;
  loading: boolean;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artistMeta, setArtistMeta] = useState<Record<string, ArtistMeta>>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    // Only show full loading screen if we don't have data yet
    if (songs.length === 0) {
        setLoading(true);
    } else {
        setIsRefreshing(true);
    }

    try {
        const data = await fetchSheetData();
        
        // Sort songs by newest first (based on release year for now)
        // Ideally should use dateAdded if available and reliable
        const sortedSongs = data.songs.sort((a, b) => 
            parseInt(b.releaseYear) - parseInt(a.releaseYear)
        );

        setSongs(sortedSongs);
        setArtistMeta(data.artistMeta);
    } catch (error) {
        console.error("Error refreshing data:", error);
    } finally {
        setLoading(false);
        setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ songs, artistMeta, loading, isRefreshing, refreshData }}>
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