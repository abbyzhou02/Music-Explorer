import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
// import { ArtistCard } from '../components/ArtistCard';
import { PaginatedArtistCards } from '../components/PaginatedArtistCards';
import { ArtistList } from '../components/ArtistList';
// import { getArtists } from '../lib/artistApi';
import { AlbumList } from '../components/AlbumList';
import { TrackList } from '../components/TrackList';
import { TrackCard } from '../components/TrackCard';
import { Search, SlidersHorizontal, BookOpen, TrendingUp, ArrowUpDown } from 'lucide-react';
import { Artist, searchArtists, getRangeAnalytics, getArtistCount } from '../lib/artistApi';
import { searchAlbums, Album, getAlbumCount, getTypeDistributionFromSearch } from '../lib/albumApi';
import { searchTracks, Track, getTrackCount } from '../lib/trackApi';
// import { getGenres } from '../lib/genreApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function ExplorePage() {
  const [view, setView] = useState<'artists' | 'albums' | 'tracks'>('artists');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('All');
  const [selectedAlbumType, setSelectedAlbumType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'followers' | 'release_date' | 'duration_ms'>('popularity');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);
  const [albumTypes, setAlbumTypes] = useState<any[]>([]);

  useEffect(() => {
    setCurrentPage(1);
    loadData();
  }, [sortBy, sortOrder, pageSize]);

  // When switching to tracks view, reset sortBy to name if it's popularity
  useEffect(() => {
    // if (view === 'tracks' && sortBy === 'popularity') {
    //   setSortBy('name');
    // } else if (view === 'albums' && sortBy === 'duration_ms') {
    //   setSortBy('popularity');
    // } else if (view === 'artists' && sortBy === 'duration_ms') {
    //   setSortBy('popularity');
    // }
    if (view === 'tracks') {
      setSortBy('release_date');
    } else {
      setSortBy('popularity');
    }
    setCurrentPage(1);
    loadData();
    loadCount();
    loadAnalytics();
  }, [view]);

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (view === 'artists') {
        const params = {
          searchTerm: searchQuery,
          genreFilter: selectedGenre === 'all' ? undefined : selectedGenre,
          sortBy: sortBy as 'popularity' | 'name' | 'followers',
          sortOrder: sortOrder,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        }
        const response = await searchArtists(params);

        if (response.success && response.data) {
          setArtists(response.data);
        } else {
          setArtists([]);
        }

      } else if (view === 'albums') {
        const response = await searchAlbums({
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          searchTerm: searchQuery,
          sortBy: sortBy as 'popularity' | 'name' | 'release_date',
          sortOrder: sortOrder,
          typeFilter: selectedAlbumType as 'single' | 'album' | 'compilation',
        });
        
        if (response.success && response.data) {
          setAlbums(response.data);
        } else {
          setAlbums([]);
        }
      } else {
        const response = await searchTracks({
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          searchTerm: searchQuery,
          emotionFilter: selectedEmotion as 'Frantic' | 'Tense' | 'Euphotic' | 'Upset' | 'Calm' | 'Cheerful' | 'Bleak' | 'Apathetic' | 'Serene' | 'All' | 'Other',
          sortBy: sortBy as 'release_date' | 'name' | 'duration_ms',
          sortOrder: sortOrder,
        });
        
        if (response.success && response.data) {
          setTracks(response.data);
        } else {
          setTracks([]);
        }
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadCount = async () => {
    try {
      if (view === 'artists') {
        const params = {
          searchTerm: searchQuery,
          genreFilter: selectedGenre === 'all' ? undefined : selectedGenre,
        };
        const countRes = await getArtistCount(params);
        setTotalItems(countRes.data || 0);
      } else if (view === 'albums') {
        const countRes = await getAlbumCount({
          searchTerm: searchQuery,
          typeFilter: selectedAlbumType as 'single' | 'album' | 'compilation',
        });
        setTotalItems(countRes.data || 0);
        console.log('Album count:', countRes.data);
      } else {
        const countRes = await getTrackCount({
          searchTerm: searchQuery,
          emotionFilter: selectedEmotion as 'Frantic' | 'Tense' | 'Euphotic' | 'Upset' | 'Calm' | 'Cheerful' | 'Bleak' | 'Apathetic' | 'Serene' | 'All' | 'Other',
        });
        setTotalItems(countRes.data || 0);
        console.log('Track count:', countRes.data);
      }
    } catch (err: any) {
      console.error('Error loading count:', err);
    }
  };

  const loadAnalytics = async () => {
    try {
      if (view === 'artists') {
        const params = {
          searchTerm: searchQuery,
          genreFilter: selectedGenre === 'all' ? undefined : selectedGenre
        }
        const res2 = await getRangeAnalytics(params);
            
        setAnalytics({
          genreDistribution: res2.data.genreDistribution || [],
          emotionDistribution: res2.data.emotionDistribution || []
        });
        console.log('Analytics:', res2.data);
      } else if (view === 'albums') {
        const res = await getTypeDistributionFromSearch({
        searchTerm: searchQuery,
        typeFilter: selectedAlbumType as 'single' | 'album' | 'compilation',
      });
      setAlbumTypes(res.data || []);
      }
    } catch (err: any) {
      console.error('Error loading analytics:', err);
    }
  };

  // Re-fetch when search query changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setCurrentPage(1);
      loadData();
      loadCount();
      loadAnalytics();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, selectedEmotion, selectedAlbumType]);

  
  const filteredAlbums = albums;
  const filteredTracks = tracks;

  return (
    <Layout>
      <div className="bg-surface py-8 border-b border-neutral-200">
        <div className="container mx-auto px-8">
          <h1 className="text-h1 font-bold text-neutral-900 mb-2">Explore Music</h1>
          <p className="text-body-large text-neutral-700">
            Browse global trending artists and albums, discover new music inspiration
          </p>
        </div>
      </div>

      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              {/* <Link
                to="/lyrics"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-body font-medium transition-all hover:bg-primary-50 hover:text-primary-700"
              >
                <BookOpen className="w-5 h-5" />
                Lyrics Search
              </Link> */}
              {/* <Link
                to="/trending-lyrics"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-body font-medium transition-all hover:bg-primary-50 hover:text-primary-700"
              >
                <TrendingUp className="w-5 h-5" />
                Trending Lyrics
              </Link> */}
              <button
                onClick={() => setView('artists')}
                className={`px-4 py-2 rounded-md text-body font-medium transition-all ${
                  view === 'artists'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Artists
              </button>
              <button
                onClick={() => setView('albums')}
                className={`px-4 py-2 rounded-md text-body font-medium transition-all ${
                  view === 'albums'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Albums
              </button>
              <button
                onClick={() => setView('tracks')}
                className={`px-4 py-2 rounded-md text-body font-medium transition-all ${
                  view === 'tracks'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Tracks
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {view === 'artists' && (
                <input
                  type="text"
                  placeholder="Filter by genre..."
                  value={selectedGenre === 'all' ? '' : selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value || 'all')}
                  className="px-4 py-2 rounded-md border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-40"
                />
              )}

              {view === 'tracks' && (
                <select
                  value={selectedEmotion}
                  onChange={(e) => setSelectedEmotion(e.target.value)}
                  className="px-4 py-2 rounded-md border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-40"
                >
                  <option value="All">All Emotions</option>
                  <option value="Frantic">Frantic</option>
                  <option value="Tense">Tense</option>
                  <option value="Euphotic">Euphotic</option>
                  <option value="Upset">Upset</option>
                  <option value="Calm">Calm</option>
                  <option value="Cheerful">Cheerful</option>
                  <option value="Bleak">Bleak</option>
                  <option value="Apathetic">Apathetic</option>
                  <option value="Serene">Serene</option>
                  <option value="Other">Other</option>
                </select>
              )}

              {view === 'albums' && (
                <select
                  value={selectedAlbumType}
                  onChange={(e) => setSelectedAlbumType(e.target.value)}
                  className="px-4 py-2 rounded-md border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-40"
                >
                  <option value="all">All Types</option>
                  <option value="single">Single</option>
                  <option value="album">Album</option>
                  <option value="compilation">Compilation</option>
                </select>
              )}

              <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none outline-none text-body font-medium cursor-pointer"
                >
                  {view !== 'tracks' && <option value="popularity">By Popularity</option>}
                  <option value="name">By Name</option>
                  {view === 'artists' && <option value="followers">By Followers</option>}
                  {view !== 'artists' && <option value="release_date">By Release Date</option>}
                  {view === 'tracks' && <option value="duration_ms">By Duration</option>}
                </select>
              </div>

              <button
                onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="text-body font-medium">
                  {sortOrder === 'ASC' ? 'ASC' : 'DESC'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="container mx-auto px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-body text-neutral-600">Loading...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
              <p className="text-body text-red-800">{error}</p>
              <button
                onClick={loadData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {view === 'artists' ? (
                <>
                  <h2 className="text-h3 font-semibold text-neutral-900 mb-6">
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : selectedGenre === 'all'
                      ? 'All Artists'
                      : `${selectedGenre} Artists`}
                  </h2>
                  {/* <PaginatedArtistCards
                    artists={artists}
                    loading={loading}
                    title={
                      searchQuery
                        ? `Search results for "${searchQuery}"`
                        : selectedGenre === 'all'
                        ? 'All Artists'
                        : `${selectedGenre} Artists`
                    }
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newPageSize) => {
                      setPageSize(newPageSize);
                      setCurrentPage(1); // Reset to first page
                    }}
                  /> */}
                  <ArtistList
                    artists={artists}
                    loading={loading}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newPageSize) => {
                      setPageSize(newPageSize);
                      setCurrentPage(1); // Reset to first page
                    }}
                  />

                  {/* Pie chart area */}
                  {analytics && (analytics.genreDistribution?.length > 0 || analytics.emotionDistribution?.length > 0) && (
                    <div className="mt-12 space-y-8">
                      <h3 className="text-h3 font-semibold text-neutral-900">Distribution Analytics</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Genre Distribution pie chart */}
                        {analytics.genreDistribution && analytics.genreDistribution.length > 0 && (
                          <div className="bg-surface p-6 rounded-lg border border-neutral-200">
                            <h4 className="text-h4 font-medium text-neutral-900 mb-4">Genre Distribution</h4>
                            <div className="h-64">
                              <Pie
                                data={{
                                  labels: analytics.genreDistribution.map((item: any) => item.genre),
                                  datasets: [
                                    {
                                      data: analytics.genreDistribution.map((item: any) => item.artist_num),
                                      backgroundColor: [
                                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                                        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                                      ],
                                      borderWidth: 2,
                                      borderColor: '#ffffff',
                                    },
                                  ],
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'bottom' as const,
                                      labels: {
                                        padding: 15,
                                        font: {
                                          size: 12
                                        }
                                      }
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function(context) {
                                          const label = context.label || '';
                                          const value = context.parsed || 0;
                                          const total = context.dataset.data.reduce((a: number, b: any) => a + Number(b), 0);
                                          const percentage = ((value / total) * 100).toFixed(1);
                                          return `${label}: ${value} artists (${percentage}%)`;
                                        }
                                      }
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Emotion Distribution pie chart */}
                        {analytics.emotionDistribution && analytics.emotionDistribution.length > 0 && (
                          <div className="bg-surface p-6 rounded-lg border border-neutral-200">
                            <h4 className="text-h4 font-medium text-neutral-900 mb-4">Emotion Distribution</h4>
                            <div className="h-64">
                              <Pie
                                data={{
                                  labels: analytics.emotionDistribution.map((item: any) => item.emotion),
                                  datasets: [
                                    {
                                      data: analytics.emotionDistribution.map((item: any) => item.track_num),
                                      backgroundColor: [
                                        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                                        '#9966FF', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40'
                                      ],
                                      borderWidth: 2,
                                      borderColor: '#ffffff',
                                    },
                                  ],
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'bottom' as const,
                                      labels: {
                                        padding: 15,
                                        font: {
                                          size: 12
                                        }
                                      }
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function(context) {
                                          const label = context.label || '';
                                          const value = context.parsed || 0;
                                          const total = context.dataset.data.reduce((a: number, b: any) => a + Number(b), 0);
                                          const percentage = ((value / total) * 100).toFixed(1);
                                          return `${label}: ${value} tracks (${percentage}%)`;
                                        }
                                      }
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : view === 'albums' ? (
                <>
                  <AlbumList
                    albums={filteredAlbums}
                    loading={loading}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newPageSize) => {
                      setPageSize(newPageSize);
                      setCurrentPage(1); // Reset to first page
                    }}
                  />

                  {/* Album Type Distribution pie chart */}
                  {albumTypes && albumTypes.length > 0 && (
                    <div className="mt-12 space-y-8">
                      <div className="bg-surface p-6 rounded-lg border border-neutral-200 max-w-md mx-auto">
                        <div className="h-64">
                          <Pie
                            data={{
                              labels: albumTypes.map((item: any) => item.type),
                              datasets: [
                                {
                                  data: albumTypes.map((item: any) => item.cnt),
                                  backgroundColor: [
                                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                                  ],
                                  borderWidth: 2,
                                  borderColor: '#ffffff',
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                title: {
                                  display: true,
                                  text: 'Album Type Distribution',
                                  font: {
                                    size: 16,
                                    weight: 'bold'
                                  },
                                  padding: {
                                    bottom: 20
                                  }
                                },
                                legend: {
                                  position: 'bottom' as const,
                                  labels: {
                                    padding: 15,
                                    font: {
                                      size: 12
                                    }
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      const label = context.label || '';
                                      const value = context.parsed || 0;
                                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                      const percentage = ((value / total) * 100).toFixed(1);
                                      return `${label}: ${value} albums (${percentage}%)`;
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <TrackList
                  tracks={filteredTracks}
                  loading={loading}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                    setCurrentPage(1); // Reset to first page
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
