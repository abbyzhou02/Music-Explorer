import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Users, Disc, Music, TrendingUp, BarChart3, Users2, PieChart } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { AlbumList, Album } from '../components/AlbumList';
import { TrackList, Track } from '../components/TrackList';

import { getArtistById, Artist, getCollaborators, getGenreDistributionById, getEmotionDistributionById } from '../lib/artistApi';
import { getAlbumsByArtist, getAlbumCountByArtist } from '../lib/albumApi';
import { getTracksByArtist, getTrackCountByArtist } from '../lib/trackApi';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { get } from 'http';

export function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [albumCount, setAlbumCount] = useState<number>(0);
  const [trackCount, setTrackCount] = useState<number>(0);
  const [albumPage, setAlbumPage] = useState<number>(1);
  const [albumsPerPage, setAlbumsPerPage] = useState<number>(10);
  const [trackPage, setTrackPage] = useState<number>(1);
  const [tracksPerPage, setTracksPerPage] = useState<number>(10);
  const [activeView, setActiveView] = useState<'music' | 'analytics'>('music');
  const [collaborators, setCollaborators] = useState<Artist[]>([]);
  // const [analytics, setAnalytics] = useState<any>(null);
  const [genreDistribution, setGenreDistribution] = useState<any[]>([]);
  const [emotionsDistribution, setEmotionsDistribution] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    
    loadArtistData();
  }, [id]);

  const loadArtistData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      setActiveView('music');

        const artistResponse = await getArtistById(id);
        
        const [albumsResponse, tracksResponse, albumCountResponse, trackCountResponse, collaboratorsResponse, genresResponse, emotionsResponse] = await Promise.all([
          getAlbumsByArtist({artistId: id, limit: albumsPerPage, offset: (albumPage - 1) * albumsPerPage}),
          getTracksByArtist({artistId: id, limit: tracksPerPage, offset: (trackPage - 1) * tracksPerPage}),
          getAlbumCountByArtist(id),
          getTrackCountByArtist(id),
          getCollaborators(id),
          getGenreDistributionById(id),
          getEmotionDistributionById(id)
        ]);

      if (artistResponse.success && artistResponse.data) {
        setArtist(artistResponse.data);
        // setCollaborators(collaboratorsResponse.data);
        setCollaborators(collaboratorsResponse.success && collaboratorsResponse.data ? collaboratorsResponse.data : []);
        setAlbums(albumsResponse.success && albumsResponse.data ? albumsResponse.data : []);
        setTopTracks(tracksResponse.success && tracksResponse.data ? tracksResponse.data : []);
        setAlbumCount(albumCountResponse.success && albumCountResponse.data ? albumCountResponse.data : 0);
        setTrackCount(trackCountResponse.success && trackCountResponse.data ? trackCountResponse.data : 0);
        setGenreDistribution(genresResponse.success && genresResponse.data ? genresResponse.data : []);
        setEmotionsDistribution(emotionsResponse.success && emotionsResponse.data ? emotionsResponse.data : []);
      } else {
        setError('Artist does not exist');
      }
    } catch (err: any) {
      console.error('Error loading artist data:', err);
      setError(err.message || 'Failed to load artist data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };



  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-8 py-16">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-body text-neutral-600">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !artist) {
    return (
      <Layout>
        <div className="container mx-auto px-8 py-16">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-body text-red-800">{error || 'Artist does not exist'}</p>
            <Link
              to="/explore"
              className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to Explore
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // const avgPopularity = albums.length > 0
  //   ? Math.round(albums.reduce((sum, a) => sum + a.popularity, 0) / albums.length)
  //   : 0;

  // Analytics data
  // const collaboratorsData = [
  //   { id: '1', name: 'Producer A', followers: 50000, popularity: 75, genres: ['Pop', 'Electronic'], urls: ['/api/placeholder/100/100'], collab_num: 12 },
  //   { id: '2', name: 'Songwriter B', followers: 30000, popularity: 68, genres: ['Pop', 'R&B'], urls: ['/api/placeholder/100/100'], collab_num: 8 },
  //   { id: '3', name: 'Artist C', followers: 80000, popularity: 82, genres: ['Hip-Hop', 'R&B'], urls: ['/api/placeholder/100/100'], collab_num: 15 },
  //   { id: '4', name: 'Producer D', followers: 45000, popularity: 71, genres: ['Electronic', 'Dance'], urls: ['/api/placeholder/100/100'], collab_num: 6 },
  //   { id: '5', name: 'Songwriter E', followers: 35000, popularity: 64, genres: ['Pop', 'Soul'], urls: ['/api/placeholder/100/100'], collab_num: 9 },
  //   { id: '6', name: 'Artist F', followers: 60000, popularity: 78, genres: ['Indie', 'Alternative'], urls: ['/api/placeholder/100/100'], collab_num: 11 }
  // ];

  const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#F97316', '#84CC16', '#8B5CF6'];
  
  // Get real analytics data and convert string numbers to integers
  const genreData = (genreDistribution || []).map(item => ({
    ...item,
    artist_num: parseInt(item.artist_num, 10) || 0,
    ratio: parseFloat(item.ratio) || 0
  }));
  const emotionData = (emotionsDistribution || []).map(item => ({
    ...item,
    track_num: parseInt(item.track_num, 10) || 0,
    ratio: parseFloat(item.ratio) || 0
  }));
  // console.log(genreData, emotionData);
  
    // console.log(albums, collaborators)
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-surface py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <img
                src={artist.urls[0] || 'https://i.scdn.co/image/ab67616100005174e06a4e98aa1afe29dfde35d3'}
                alt={artist.name}
                className="w-full aspect-square rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="md:col-span-8 flex flex-col justify-center">
              <h1 className="text-h1 font-bold text-neutral-900 mb-4">{artist.name}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {artist.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 bg-primary-100 text-primary-900 rounded-full text-body font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="flex gap-8 text-body">
                <div>
                  <p className="text-neutral-700">Popularity</p>
                  <p className="text-h3 font-bold text-neutral-900">{artist.popularity}</p>
                </div>
                <div>
                  <p className="text-neutral-700">Followers</p>
                  <p className="text-h3 font-bold text-neutral-900">
                    {(artist.followers / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="bg-surface py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Disc className="w-8 h-8" />}
              title="Total Albums"
              value={albums.length}
            />
            <StatCard
              icon={<Music className="w-8 h-8" />}
              title="Total Songs"
              value={topTracks.length}
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Average Popularity"
              value={avgPopularity}
            />
            <StatCard
              icon={<Users className="w-8 h-8" />}
              title="Followers"
              value={`${(artist.followers / 1000000).toFixed(1)}M`}
            />
          </div>
        </div>
      </div> */}

      {/* View Tabs */}
      <div className="bg-background border-b border-neutral-200">
        <div className="container mx-auto px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveView('music')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'music'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Disc className="inline w-4 h-4 mr-2" />
              Music Works
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <BarChart3 className="inline w-4 h-4 mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      <div className="bg-background py-12">
        <div className="container mx-auto px-8">
          {activeView === 'music' ? (
            <div className="space-y-12">
              <AlbumList 
                albums={albums}
                totalItems={albumCount}
                currentPage={albumPage}
                onPageChange={setAlbumPage}
                itemsPerPage={albumsPerPage}
                onPageSizeChange={(newSize) => {
                  setAlbumPage(1);
                  setAlbumsPerPage(newSize);}}
              />
              
              <TrackList 
                tracks={topTracks}
                totalItems={trackCount}
                currentPage={trackPage}
                onPageChange={setTrackPage}
                itemsPerPage={tracksPerPage}
                onPageSizeChange={(newSize) => {
                  setTrackPage(1);
                  setTracksPerPage(newSize);}}
              />
            </div>
          ) : (
            <div className="space-y-12">
              {/* Collaborators Section */}
              <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
                <h3 className="text-h4 font-semibold text-neutral-900 mb-4 flex items-center">
                  <Users2 className="w-5 h-5 mr-2" />
                  Collaborators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collaborators.slice(0, 6).map((collaborator) => (
                    <Link
                      key={collaborator.id}
                      to={`/artist/${collaborator.id}`}
                      className="group bg-background rounded-lg p-4 border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left side: Artist info */}
                        <div className="flex items-start gap-3 flex-1">
                          <img
                            src={collaborator.urls && collaborator.urls.length > 0 ? collaborator.urls[0] : '/api/placeholder/60/60'}
                            alt={collaborator.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-body font-semibold text-neutral-900 group-hover:text-primary-600 truncate mb-1">
                              {collaborator.name}
                            </h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {collaborator.genres?.slice(0, 2).map((genre) => (
                                <span
                                  key={genre}
                                  className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium"
                                >
                                  {genre}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-600">
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{collaborator.popularity}</span>
                                <span>popularity</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{formatNumber(collaborator.followers)}</span>
                                <span>followers</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right side: Collabs number */}
                        <div className="flex flex-col items-center justify-center min-w-0">
                          <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xl font-bold text-primary-700">{collaborator.collab_num}</span>
                              <span className="text-xs font-medium text-primary-600 text-center">collabs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Analytics Charts - Side by Side */}
              <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
                <h3 className="text-h4 font-semibold text-neutral-900 mb-6 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Distribution Analytics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Genre Distribution */}
                  <div>
                    <h4 className="text-h5 font-medium text-neutral-900 mb-4">Genre Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={genreData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ genre, artist_num, ratio }) => `${genre}: ${artist_num} (${(ratio * 100).toFixed(1)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="artist_num"
                          >
                            {genreData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any, name: any) => [`${value}`, 'Count']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Emotion Distribution */}
                  <div>
                    <h4 className="text-h5 font-medium text-neutral-900 mb-4">Song Emotion Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={emotionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ emotion, track_num, ratio }) => `${emotion}: ${track_num} (${(ratio * 100).toFixed(1)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="track_num"
                          >
                            {emotionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any, name: any) => [`${value}`, 'Count']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Album Type Distribution - Commented Out */}
              {/* <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
                <h3 className="text-h4 font-semibold text-neutral-900 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Album Type Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={albumTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {albumTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-neutral-900 mb-2">{albumTypeData.reduce((sum, item) => sum + item.value, 0)}</div>
                      <div className="text-sm text-neutral-600">Total Albums</div>
                      <div className="text-xs text-neutral-500 mt-2">{albumTypeData.length} Types</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Emotion Distribution - Commented Out */}
              {/* <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
                <h3 className="text-h4 font-semibold text-neutral-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Song Emotion Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={emotionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {emotionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {emotionData.map((emotion, index) => (
                      <div key={index} className="bg-background rounded-lg p-4 border border-neutral-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-neutral-900">{emotion.name}</span>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: emotion.color }}></div>
                        </div>
                        <div className="text-xl font-bold text-neutral-900">{emotion.value}%</div>
                        <div className="text-xs text-neutral-600">of total songs</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>

    </Layout>
  );
}
