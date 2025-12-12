import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Music, Calendar, Disc, TrendingUp, Mic, BarChart3, Clock, User, Album as AlbumIcon } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Track } from '../lib/trackApi';
import { getTrackById, getLyricsByTrackId, getSimilarTracks } from '../lib/trackApi';
import { Album, getAlbumById } from '../lib/albumApi';
import { Artist, getArtistById } from '../lib/artistApi';

export function TrackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  // const [album, setAlbum] = useState<Album | null>(null);
  // const [artists, setArtists] = useState<Artist[]>([]);
  const [similarTracks, setSimilarTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'lyrics' | 'analysis'>('lyrics');
  // console.log('Track Detail Page - Track:', track);
  useEffect(() => {
    if (!id) return;

    const loadTrackData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get track details
        const trackResponse = await getTrackById(id);
        const lyricsResponse = await getLyricsByTrackId(id);
        
        if (trackResponse.success && trackResponse.data) {
          setTrack(trackResponse.data);

          // Get album information
          // if (trackResponse.data.album_id) {
          //   const albumResponse = await getAlbumById(trackResponse.data.album_id);
          //   if (albumResponse.success && albumResponse.data) {
          //     setAlbum(albumResponse.data);
          //   }
          // }

          // // Get artist information
          // if (trackResponse.data.artist_ids && trackResponse.data.artist_ids.length > 0) {
          //   const artistPromises = trackResponse.data.artist_ids.map(artistId => 
          //     getArtistById(artistId)
          //   );
          //   const artistResponses = await Promise.all(artistPromises);
          //   const validArtists = artistResponses
          //     .filter(response => response.success && response.data)
          //     .map(response => response.data!);
          //   setArtists(validArtists);
          // }

          // Get similar tracks
          const similarTracksResponse = await getSimilarTracks(id, 3);
          if (similarTracksResponse.success && similarTracksResponse.data) {
            setSimilarTracks(similarTracksResponse.data);
            // console.log('Similar Tracks:', similarTracksResponse.data);
          }
        } else {
          setError('Track does not exist');
        }
        if (lyricsResponse.success && lyricsResponse.data) {
          setLyrics(lyricsResponse.data);
        }
      } catch (err: any) {
        console.error('Error loading track data:', err);
        setError(err.message || 'Failed to load track details');
      } finally {
        setLoading(false);
      }
    };

    loadTrackData();
  }, [id]);

  const formatDuration = (ms?: number) => {
    if (!ms) return '--:--';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-body-large text-neutral-500">Loading track details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !track) {
    return (
      <Layout>
        <div className="container mx-auto px-8 py-16 text-center">
          <p className="text-body-large text-red-500 mb-4">
            {error || 'Track not found'}
          </p>
          <Link
            to="/explore"
            className="text-primary-500 hover:text-primary-600 underline"
          >
            Back to Explore
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-surface py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="w-full aspect-square rounded-lg object-cover shadow-lg bg-neutral-200 flex items-center justify-center">
                <Music className="w-24 h-24 text-neutral-400" />
              </div>
            </div>
            <div className="md:col-span-8 flex flex-col justify-center">
              <h1 className="text-h1 font-bold text-neutral-900 mb-4">{track.name}</h1>
              
              {/* Artist links */}
              <div className="flex flex-wrap gap-2 mb-4">
                {track.artist_ids.map((artist_id, index) => (
                  <span key={artist_id}>
                    <Link
                      to={`/artist/${artist_id}`}
                      className="text-body-large text-primary-500 hover:text-primary-600"
                    >
                      {track.artist_names[index]}
                    </Link>
                    {index < track.artist_ids.length - 1 && <span className="text-neutral-500 mx-1">,</span>}
                  </span>
                ))}
              </div>

              {/* Album link */}
              {track.album_id && (
                <Link
                  to={`/album/${track.album_id}`}
                  className="text-body text-neutral-600 hover:text-primary-500 mb-6 inline-block"
                >
                  <AlbumIcon className="inline w-4 h-4 mr-1" />
                  {track.album_name}
                </Link>
              )}

              <div className="flex flex-wrap gap-8 text-body">
                <div>
                  <p className="text-neutral-700">Duration</p>
                  <p className="text-body font-semibold text-neutral-900">
                    {formatDuration(track.duration_ms)}
                  </p>
                </div>
                {/* {album && (
                  <div>
                    <p className="text-neutral-700">Release Date</p>
                    <p className="text-body font-semibold text-neutral-900">
                      {formatDate(album.release_date)}
                    </p>
                  </div>
                )} */}
                <div>
                  <p className="text-neutral-700">Explicit</p>
                  <p className="text-body font-semibold text-neutral-900">
                    {track.explicit ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="bg-surface py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Energy"
              value={track.energy !== undefined ? track.energy.toFixed(2) : '--'}
            />
            <StatCard
              icon={<Music className="w-8 h-8" />}
              title="Danceability"
              value={track.danceability !== undefined ? track.danceability.toFixed(2) : '--'}
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Valence"
              value={track.valence !== undefined ? track.valence.toFixed(2) : '--'}
            />
            <StatCard
              icon={<Clock className="w-8 h-8" />}
              title="Tempo"
              value={track.tempo !== undefined ? `${Math.round(track.tempo)} BPM` : '--'}
            />
          </div>
        </div>
      </div> */}

      {/* View Tabs */}
      <div className="bg-background border-b border-neutral-200">
        <div className="container mx-auto px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveView('lyrics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'lyrics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Mic className="inline w-4 h-4 mr-2" />
              Lyrics
            </button>
            <button
              onClick={() => setActiveView('analysis')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'analysis'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <BarChart3 className="inline w-4 h-4 mr-2" />
              Audio Analysis & Similar Tracks
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      <div className="bg-background py-12">
        <div className="container mx-auto px-8">
          {activeView === 'lyrics' ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-h2 font-semibold text-neutral-900 mb-6">Lyrics</h2>
              <div className="bg-surface rounded-lg p-8 border border-neutral-100 shadow-sm">
                {lyrics ? (
                  <div className="whitespace-pre-wrap text-body text-neutral-800 leading-relaxed">
                    {lyrics}
                  </div>
                ) : (
                  <p className="text-body text-neutral-500 text-center py-8">
                    Lyrics not available for this track
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Audio Analysis */}
              <div className="mb-12">
                <h2 className="text-h2 font-semibold text-neutral-900 mb-6">Audio Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
                    <h3 className="text-h4 font-medium text-neutral-900 mb-4">Technical</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Key</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.key !== undefined ? track.key : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Mode</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.mode !== undefined ? (track.mode === 1 ? 'Major' : 'Minor') : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Time Signature</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.time_signature !== undefined ? track.time_signature : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Loudness</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.loudness !== undefined ? `${track.loudness.toFixed(1)} dB` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
                    <h3 className="text-h4 font-medium text-neutral-900 mb-4">Mood & Style</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Valence</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.valence !== undefined ? track.valence.toFixed(2) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Energy</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.energy !== undefined ? track.energy.toFixed(2) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Danceability</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.danceability !== undefined ? track.danceability.toFixed(2) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Speechiness</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.speechiness !== undefined ? track.speechiness.toFixed(2) : '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
                    <h3 className="text-h4 font-medium text-neutral-900 mb-4">Instrumentation</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Acousticness</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.acousticness !== undefined ? track.acousticness.toFixed(2) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Instrumentalness</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.instrumentalness !== undefined ? track.instrumentalness.toFixed(2) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Liveness</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.liveness !== undefined ? track.liveness.toFixed(2) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body text-neutral-600">Tempo</span>
                        <span className="text-body font-medium text-neutral-900">
                          {track.tempo !== undefined ? `${Math.round(track.tempo)} BPM` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Tracks */}
              <div>
                <h2 className="text-h2 font-semibold text-neutral-900 mb-6">Similar Tracks</h2>
                <div className="bg-surface rounded-lg p-8 border border-neutral-100 shadow-sm">
                  {similarTracks.length > 0 ? (
                    <div className="space-y-4">
                      {similarTracks.map((similarTrack) => (
                        <div
                          key={similarTrack.id}
                          className="flex items-center justify-between p-4 bg-background rounded-lg border border-neutral-100 hover:border-primary-200 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-neutral-200 rounded flex items-center justify-center">
                              <Music className="w-6 h-6 text-neutral-400" />
                            </div>
                            <div className="flex-1">
                              <Link
                                to={`/track/${similarTrack.id}`}
                                className="text-body font-medium text-neutral-900 hover:text-primary-600 transition-colors hover:underline"
                              >
                                {similarTrack.name}
                              </Link>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {similarTrack.artist_names?.map((artistName, index) => (
                                  <span key={index}>
                                    <Link
                                      to={`/artist/${similarTrack.artist_ids?.[index]}`}
                                      className="text-small text-neutral-600 hover:text-primary-600 transition-colors hover:underline"
                                    >
                                      {artistName}
                                    </Link>
                                    {index < (similarTrack.artist_names?.length || 0) - 1 && (
                                      <span className="text-neutral-500 mx-1">,</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                              {similarTrack.album_id && similarTrack.album_name && (
                                <div className="mt-1">
                                  <Link
                                    to={`/album/${similarTrack.album_id}`}
                                    className="text-small text-neutral-500 hover:text-primary-600 transition-colors hover:underline"
                                  >
                                    <AlbumIcon className="inline w-3 h-3 mr-1" />
                                    {similarTrack.album_name}
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                {/* <span className="text-small font-medium text-primary-600">
                                  {similarTrack.similarity !== undefined ? `${(similarTrack.similarity * 100).toFixed(1)}%` : '--'}
                                </span>
                                <span className="text-small text-neutral-500">match</span> */}
                              </div>
                              <p className="text-small text-neutral-600">
                                {formatDuration(similarTrack.duration_ms)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-body text-neutral-500 text-center py-8">
                      Similar tracks not available yet
                    </p>
                  )}
                        </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}