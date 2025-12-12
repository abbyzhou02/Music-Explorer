import { Artist } from '../../src/lib/artistApi';
import { Album } from '../../src/lib/albumApi';
import { Track } from '../../src/lib/trackApi';

export const mockArtist: Artist = {
  id: 'test-artist-1',
  name: 'Test Artist',
  popularity: 85,
  followers: 5000000,
  genres: ['pop', 'rock'],
  urls: ['https://example.com/artist.jpg'],
  album_num: 10,
  track_num: 50,
  collab_num: 15,
};

export const mockArtists: Artist[] = [
  mockArtist,
  {
    id: 'test-artist-2',
    name: 'Another Artist',
    popularity: 75,
    followers: 3000000,
    genres: ['jazz', 'blues'],
    urls: ['https://example.com/artist2.jpg'],
    album_num: 8,
    track_num: 40,
    collab_num: 10,
  },
  {
    id: 'test-artist-3',
    name: 'Third Artist',
    popularity: 90,
    followers: 8000000,
    genres: ['hip-hop', 'rap'],
    urls: [],
    album_num: 12,
    track_num: 60,
    collab_num: 20,
  },
];

// API Album format (for API tests)
export const mockApiAlbum: Album = {
  id: 'test-album-1',
  name: 'Test Album',
  artist_ids: ['test-artist-1'],
  artist_names: ['Test Artist'],
  release_date: '2023-01-15',
  popularity: 80,
  urls: ['https://example.com/album.jpg'],
  num_tracks: 12,
  type: 'album',
};

export const mockApiAlbums: Album[] = [
  mockApiAlbum,
  {
    id: 'test-album-2',
    name: 'Another Album',
    artist_ids: ['test-artist-2'],
    artist_names: ['Another Artist'],
    release_date: '2022-06-20',
    popularity: 75,
    urls: ['https://example.com/album2.jpg'],
    num_tracks: 10,
    type: 'album',
  },
  {
    id: 'test-album-3',
    name: 'Single Release',
    artist_ids: ['test-artist-1'],
    artist_names: ['Test Artist'],
    release_date: '2024-03-10',
    popularity: 90,
    urls: ['https://example.com/single.jpg'],
    num_tracks: 1,
    type: 'single',
  },
];

// Component Album format (for component tests)
export const mockAlbum = {
  id: 'test-album-1',
  name: 'Test Album',
  artist_id: 'test-artist-1',
  artist_name: 'Test Artist',
  release_date: '2023-01-15',
  popularity: 80,
  cover_url: 'https://example.com/album.jpg',
  total_tracks: 12,
  album_type: 'album',
};

export const mockAlbums = [
  mockAlbum,
  {
    id: 'test-album-2',
    name: 'Another Album',
    artist_id: 'test-artist-2',
    artist_name: 'Another Artist',
    release_date: '2022-06-20',
    popularity: 75,
    cover_url: 'https://example.com/album2.jpg',
    total_tracks: 10,
    album_type: 'album',
  },
  {
    id: 'test-album-3',
    name: 'Single Release',
    artist_id: 'test-artist-1',
    artist_name: 'Test Artist',
    release_date: '2024-03-10',
    popularity: 90,
    cover_url: 'https://example.com/single.jpg',
    total_tracks: 1,
    album_type: 'single',
  },
];

// API Track format (for API tests)
export const mockApiTrack: Track = {
  id: 'test-track-1',
  name: 'Test Track',
  album_id: 'test-album-1',
  album_name: 'Test Album',
  artist_ids: ['test-artist-1'],
  artist_names: ['Test Artist'],
  energy: 0.8,
  danceability: 0.75,
  valence: 0.6,
  duration_ms: 210000,
  explicit: false,
};

export const mockApiTracks: Track[] = [
  mockApiTrack,
  {
    id: 'test-track-2',
    name: 'Explicit Track',
    album_id: 'test-album-1',
    album_name: 'Test Album',
    artist_ids: ['test-artist-1'],
    artist_names: ['Test Artist'],
    energy: 0.9,
    danceability: 0.85,
    valence: 0.4,
    duration_ms: 180000,
    explicit: true,
  },
  {
    id: 'test-track-3',
    name: 'Chill Track',
    album_id: 'test-album-2',
    album_name: 'Another Album',
    artist_ids: ['test-artist-2'],
    artist_names: ['Another Artist'],
    energy: 0.3,
    danceability: 0.5,
    valence: 0.8,
    duration_ms: 240000,
    explicit: false,
  },
];

// Component Track format (for component tests)
export const mockTrack = {
  id: 'test-track-1',
  name: 'Test Track',
  album_id: 'test-album-1',
  album_name: 'Test Album',
  artist_id: 'test-artist-1',
  artist_name: 'Test Artist',
  popularity: 85,
  energy: 0.8,
  danceability: 0.75,
  valence: 0.6,
  duration_ms: 210000,
  explicit: false,
  genres: ['pop', 'rock'],
};

export const mockTracks = [
  mockTrack,
  {
    id: 'test-track-2',
    name: 'Explicit Track',
    album_id: 'test-album-1',
    album_name: 'Test Album',
    artist_id: 'test-artist-1',
    artist_name: 'Test Artist',
    popularity: 78,
    energy: 0.9,
    danceability: 0.85,
    valence: 0.4,
    duration_ms: 180000,
    explicit: true,
    genres: ['hip-hop'],
  },
  {
    id: 'test-track-3',
    name: 'Chill Track',
    album_id: 'test-album-2',
    album_name: 'Another Album',
    artist_id: 'test-artist-2',
    artist_name: 'Another Artist',
    popularity: 70,
    energy: 0.3,
    danceability: 0.5,
    valence: 0.8,
    duration_ms: 240000,
    explicit: false,
    genres: ['jazz'],
  },
];

export const mockApiResponse = <T,>(data: T, success = true) => ({
  success,
  data,
  timestamp: new Date().toISOString(),
});
