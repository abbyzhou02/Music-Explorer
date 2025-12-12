import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Disc, Radio, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { StatCard } from '../components/StatCard';
import { ArtistCard } from '../components/ArtistCard';
import { AlbumCard } from '../components/AlbumCard';
// import { 
//   musicAnalyticsApiService, 
//   TrendingArtist, 
//   RecentAlbum 
// } from '../lib/musicAnalyticsApi';
import { Artist, getTrendingArtists, getArtistCount, getGenreCount } from '../lib/artistApi'
import { Album, getRecentAlbums, getAlbumCount } from '../lib/albumApi';
import { Track, getTrackCount } from '../lib/trackApi';

export function HomePage() {
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalAlbums: 0,
    totalTracks: 0,
    totalGenres: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // const artistsData = await musicAnalyticsApiService.getTrendingArtists(8);
        const artistsData = await getTrendingArtists(8);
        setTrendingArtists(artistsData.data);
        // console.log('Trending Artists:', artistsData);
        
        const albumsData = await getRecentAlbums(6);
        setRecentAlbums(albumsData.data);
        // console.log('Recent Albums:', albumsData);  
        
        setStats({
          totalArtists: await getArtistCount({}).then(res => res.data || 0),
          totalAlbums: await getAlbumCount({}).then(res => res.data || 0),
          totalTracks: await getTrackCount({}).then(res => res.data || 0),
          totalGenres: await getGenreCount().then(res => res.data || 0),
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-surface to-primary-50 py-24">
        <div className="container mx-auto px-8 text-center">
          <h1 className="text-display font-bold text-neutral-900 mb-6">
            Discover Your Next
            <span className="text-primary-500"> Favorite</span>
          </h1>
          <p className="text-body-large text-neutral-700 mb-8 max-w-2xl mx-auto">
            Explore music from top global artists, analyze music data, and find melodies that suit you
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/explore"
              className="px-6 py-3 bg-primary-500 text-surface font-semibold rounded-md hover:bg-primary-600 hover:-translate-y-0.5 hover:scale-105 transition-all duration-fast shadow-md"
            >
              Start Exploring
            </Link>
            {/* <Link
              to="/analytics"
              className="px-6 py-3 bg-surface text-neutral-900 font-semibold rounded-md border-2 border-neutral-200 hover:bg-neutral-100 transition-all duration-fast"
            >
              View Analytics
            </Link> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="w-8 h-8" />}
              title="Total Artists"
              value={stats.totalArtists}
            />
            <StatCard
              icon={<Disc className="w-8 h-8" />}
              title="Total Albums"
              value={stats.totalAlbums}
            />
            <StatCard
              icon={<Music className="w-8 h-8" />}
              title="Total Songs"
              value={stats.totalTracks}
            />
            <StatCard
              icon={<Radio className="w-8 h-8" />}
              title="Music Genres"
              value={stats.totalGenres}
            />
          </div>
        </div>
      </section>

      {/* Popular Artists Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-h2 font-semibold text-neutral-900">Popular Artists</h2>
            <Link
              to="/explore"
              className="text-body text-primary-500 hover:text-primary-600 font-medium flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-neutral-200 animate-pulse rounded-lg h-64"></div>
              ))
            ) : (
              trendingArtists.map((artist) => (
                <ArtistCard 
                  key={artist.id}
                  artist={{
                    id: artist.id,
                    name: artist.name,
                    urls: artist.urls,
                    followers: artist.followers,
                    popularity: artist.popularity,
                    genres: artist.genres ?? []
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recommended Albums Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-h2 font-semibold text-neutral-900">Recent Albums</h2>
            <Link
              to="/explore"
              className="text-body text-primary-500 hover:text-primary-600 font-medium flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-neutral-200 animate-pulse rounded-lg h-64"></div>
              ))
            ) : (
              recentAlbums.map((album) => (
                <AlbumCard 
                  key={album.id}
                  album={{
                    id: album.id,
                    name: album.name,
                    artist_name: '',//album.artist_name.join(', '),
                    artist_id: '',//album.artist_id.join(', '),
                    cover_url: album.urls ? album.urls[0] : '/api/placeholder/300/300',
                    release_date: album.release_date,
                    total_tracks: album.num_tracks,
                    popularity: album.popularity,
                    album_type: album.type || 'album'
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
