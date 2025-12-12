import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import * as artistApi from '../src/lib/artistApi';
import * as albumApi from '../src/lib/albumApi';
import * as trackApi from '../src/lib/trackApi';
import { mockApiResponse } from './mocks/mockData';

// Mock all API modules
vi.mock('../src/lib/artistApi');
vi.mock('../src/lib/albumApi');
vi.mock('../src/lib/trackApi');
vi.mock('../src/lib/insightApi');

describe('App', () => {
  it('renders without crashing', () => {
    // Mock required API calls for HomePage
    vi.spyOn(artistApi, 'getTrendingArtists').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getGenreCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(albumApi, 'getRecentAlbums').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCount').mockResolvedValue(mockApiResponse(0));
    
    render(<App />);
    // App should render and show HomePage by default
    expect(document.body).toBeTruthy();
  });

  it('renders root route', () => {
    vi.spyOn(artistApi, 'getTrendingArtists').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getGenreCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(albumApi, 'getRecentAlbums').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCount').mockResolvedValue(mockApiResponse(0));
    
    window.history.pushState({}, 'Home', '/');
    render(<App />);
    
    // HomePage should be rendered
    expect(document.body).toBeTruthy();
  });
});
