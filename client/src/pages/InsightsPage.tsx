import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { StatCard } from '../components/StatCard';
import { getLoveDistribution, getPopWords, getArtistPopularityGrowth, getArtistEmotionVariety } from '../lib/insightApi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts';
import ReactWordcloud from 'react-wordcloud';
import { 
  TrendingUp, 
  Users, 
  Music, 
  Heart, 
  Brain, 
  Zap, 
  Target, 
  Award,
  Clock,
  Headphones,
  Radio,
  Star
} from 'lucide-react';

// Mock data types
// interface EmotionData {
//   emotion: string;
//   count: number;
//   percentage: number;
// }

// interface ArtistGrowthData {
//   month: string;
//   followers: number;
//   popularity: number;
// }

// interface GenreWordData {
//   text: string;
//   value: number;
// }

// interface LoveFrequencyData {
//   emotion: string;
//   frequency: number;
//   songs: number;
// }

// interface ArtistEmotionData {
//   artist: string;
//   emotional: number;
//   energetic: number;
//   danceable: number;
//   positive: number;
// }

// interface AudioFeatureData {
//   feature: string;
//   value: number;
//   category: string;
// }

interface LoveDistributionData {
  emotion: string;
  cnt: number;
  ratio: number;
}

interface ArtistPopularityGrowthData {
  artist_id: number;
  artist: string;
  pre_album_id: number;
  prev_album: string;
  prev_release_date: string;
  prev_popularity: number;
  curr_album_id: number;
  curr_album: string;
  curr_release_date: string;
  curr_popularity: number;
  popularity_growth_ratio: number;
}

interface ArtistEmotionVarietyData {
  id: number;
  name: string;
  variety: number;
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#F97316', '#84CC16'];

export function InsightsPage() {
  const [loading, setLoading] = useState(true);
  // const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loveDistribution, setLoveDistribution] = useState<LoveDistributionData[]>([]);
  const [popWords, setPopWords] = useState<any[]>([]);
  const [artistPopularityGrowth, setArtistPopularityGrowth] = useState<ArtistPopularityGrowthData[]>([]);
  const [artistEmotionVariety, setArtistEmotionVariety] = useState<ArtistEmotionVarietyData[]>([]);

  // Mock data
  // const emotionDistribution: EmotionData[] = [
  //   { emotion: 'Happy', count: 2456, percentage: 28.5 },
  //   { emotion: 'Sad', count: 1823, percentage: 21.2 },
  //   { emotion: 'Angry', count: 1234, percentage: 14.3 },
  //   { emotion: 'Calm', count: 1567, percentage: 18.2 },
  //   { emotion: 'Excited', count: 1534, percentage: 17.8 }
  // ];

  // const artistGrowth: ArtistGrowthData[] = [
  //   { month: 'Jan', followers: 12000, popularity: 65 },
  //   { month: 'Feb', followers: 15000, popularity: 68 },
  //   { month: 'Mar', followers: 18000, popularity: 72 },
  //   { month: 'Apr', followers: 22000, popularity: 75 },
  //   { month: 'May', followers: 28000, popularity: 78 },
  //   { month: 'Jun', followers: 35000, popularity: 82 }
  // ];

  // const genreWordCloud: GenreWordData[] = [
  //   { text: 'Love', value: 89 },
  //   { text: 'Heart', value: 76 },
  //   { text: 'Dance', value: 65 },
  //   { text: 'Night', value: 58 },
  //   { text: 'Dream', value: 52 },
  //   { text: 'Fire', value: 48 },
  //   { text: 'Light', value: 45 },
  //   { text: 'Rain', value: 42 },
  //   { text: 'Soul', value: 38 },
  //   { text: 'Time', value: 35 }
  // ];

  // const loveFrequencyByEmotion: LoveFrequencyData[] = [
  //   { emotion: 'Happy Songs', frequency: 78, songs: 456 },
  //   { emotion: 'Sad Songs', frequency: 45, songs: 234 },
  //   { emotion: 'Angry Songs', frequency: 23, songs: 123 },
  //   { emotion: 'Calm Songs', frequency: 56, songs: 289 },
  //   { emotion: 'Excited Songs', frequency: 67, songs: 345 }
  // ];

  // const artistEmotionalDiversity: ArtistEmotionData[] = [
  //   { artist: 'Taylor Swift', emotional: 85, energetic: 72, danceable: 68, positive: 79 },
  //   { artist: 'Drake', emotional: 65, energetic: 88, danceable: 82, positive: 71 },
  //   { artist: 'Billie Eilish', emotional: 92, energetic: 45, danceable: 38, positive: 52 },
  //   { artist: 'The Weeknd', emotional: 78, energetic: 85, danceable: 76, positive: 68 },
  //   { artist: 'Ariana Grande', emotional: 73, energetic: 79, danceable: 84, positive: 82 }
  // ];

  // const audioFeaturesByGenre: AudioFeatureData[] = [
  //   { feature: 'Energy', value: 0.75, category: 'Pop' },
  //   { feature: 'Danceability', value: 0.82, category: 'Pop' },
  //   { feature: 'Valence', value: 0.68, category: 'Pop' },
  //   { feature: 'Acousticness', value: 0.23, category: 'Pop' },
  //   { feature: 'Energy', value: 0.88, category: 'Rock' },
  //   { feature: 'Danceability', value: 0.65, category: 'Rock' },
  //   { feature: 'Valence', value: 0.72, category: 'Rock' },
  //   { feature: 'Acousticness', value: 0.15, category: 'Rock' }
  // ];

  useEffect(() => {
    loadData();
  }, []);
  async function loadData() {
    try{
      setLoading(true);
      const [loveRes, popWordsRes, growthRes, varietyRes] = await Promise.all([
        getLoveDistribution(),
        getPopWords(),
        getArtistPopularityGrowth(),
        getArtistEmotionVariety()
      ]);
      
      // console.log(loveRes, popWordsRes, growthRes, varietyRes);
      
      if (loveRes.success && loveRes.data) {
        // Convert string values to numbers
        const processedData = loveRes.data.map((item: any) => ({
          emotion: item.emotion,
          cnt: Number(item.cnt),
          ratio: Number(item.ratio)
        }));
        setLoveDistribution(processedData);
      } else {
        setLoveDistribution([]);
      }
      
      if (popWordsRes.success && popWordsRes.data) {
        // Convert word cloud data: format from {word, cnt} to {text, value}
        const processedPopWords = popWordsRes.data.map((item: any) => ({
          text: item.word,
          value: Number(item.cnt)
        }));
        setPopWords(processedPopWords);
      } else {
        setPopWords([]);
      }
      
      if (growthRes.success && growthRes.data) {
        // Convert string values to numbers
        const processedGrowthData = growthRes.data.map((item: any) => ({
          artist_id: item.artist_id,
          artist: item.artist,
          pre_album_id: item.pre_album_id,
          prev_album: item.prev_album,
          prev_release_date: item.prev_release_date,
          prev_popularity: Number(item.prev_popularity),
          curr_album_id: item.curr_album_id,
          curr_album: item.curr_album,
          curr_release_date: item.curr_release_date,
          curr_popularity: Number(item.curr_popularity),
          popularity_growth_ratio: Number(item.popularity_growth_ratio)
        }));
        setArtistPopularityGrowth(processedGrowthData);
      } else {
        setArtistPopularityGrowth([]);
      }
      
      if (varietyRes.success && varietyRes.data) {
        // Convert string values to numbers
        const processedVarietyData = varietyRes.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          variety: Number(item.variety)
        }));
        setArtistEmotionVariety(processedVarietyData);
      } else {
        setArtistEmotionVariety([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-8 py-16">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-body text-neutral-600">Loading insights...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  // console.log(1,loveDistribution);
  // console.log(2,emotionDistribution);
  return (
    <Layout>
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-neutral-900 mb-4">Music Insights</h1>
          <p className="text-body-large text-neutral-600 mb-6">
            Deep dive into music trends, emotional analysis, and interesting data discoveries
          </p>
          
          {/* Time Range Selector */}
          {/* <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-md text-body font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'This Year'}
              </button>
            ))}
          </div> */}
        </div>

        {/* Key Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Most Emotionally Diverse Artist"
            value="Billie Eilish"
          />
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            title="Fastest Growing Artist"
            value="Taylor Swift"
          />
          <StatCard
            icon={<Heart className="w-8 h-8" />}
            title="Love Usage Frequency"
            value="78%"
          />
          <StatCard
            icon={<Brain className="w-8 h-8" />}
            title="Emotional Diversity"
            value="5.2/10"
          />
        </div> */}

        {/* Love Distribution Chart - Single Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Love Distribution Pie Chart */}
          <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">The Use of 'Love' in Songs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loveDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ emotion, ratio }) => `${emotion} ${(ratio * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cnt"
                >
                  {loveDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any) => [`${value}`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pop Songs Word Cloud */}
          <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">High-freq Words in City Pop Songs</h3>
            <div className="h-64 flex items-center justify-center">
              <ReactWordcloud
                words={popWords}
                options={{
                  rotations: 2,
                  rotationAngles: [0, 0],
                  fontSizes: [14, 60],
                  padding: 2,
                  spiral: 'archimedean' as const,
                  transitionDuration: 1000,
                  deterministic: false
                }}
                callbacks={{
                  getWordColor: (word: any) => {
                    const colors = ['#EC4899', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6', '#F97316', '#84CC16', '#06B6D4'];
                    return colors[Math.floor(Math.random() * colors.length)];
                  },
                  getWordTooltip: (word: any) => `${word.text}: ${word.value}`,
                  onWordClick: (word: any) => {
                    // console.log(`Clicked: ${word.text}`);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Artist Popularity Growth - Second Row Left */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">Fastest Growing Artists</h3>
            <div className="space-y-4">
              {artistPopularityGrowth.map((artist, index) => (
                <div key={artist.artist_id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary-600">#{index + 1}</span>
                        <Link 
                          to={`/artist/${artist.artist_id}`}
                          className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors hover:underline"
                        >
                          {artist.artist}
                        </Link>
                      </div>
                      <div className="text-sm text-neutral-600 space-y-1">
                        <div className="flex justify-between">
                          <span>From: <Link 
                            to={`/album/${artist.pre_album_id}`}
                            className="text-neutral-700 hover:text-primary-600 transition-colors hover:underline"
                          >
                            "{artist.prev_album}"
                          </Link></span>
                          <span className="font-medium">Popularity: {artist.prev_popularity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>To: <Link 
                            to={`/album/${artist.curr_album_id}`}
                            className="text-neutral-700 hover:text-primary-600 transition-colors hover:underline"
                          >
                            "{artist.curr_album}"
                          </Link></span>
                          <span className="font-medium">Popularity: {artist.curr_popularity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className={`text-2xl font-bold ${
                        artist.popularity_growth_ratio > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {artist.popularity_growth_ratio > 0 ? '+' : ''}{artist.popularity_growth_ratio}%
                      </div>
                      <div className="text-xs text-neutral-500">Growth</div>
                    </div>
                  </div>
                </div>
              ))}
              {artistPopularityGrowth.length === 0 && (
                <div className="text-center text-neutral-500 py-8">
                  No artist popularity data available
                </div>
              )}
            </div>
          </div>

          {/* Artist Emotion Variety */}
          <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">Most Emotionally Diverse Artists</h3>
            <div className="space-y-3">
              {artistEmotionVariety.slice(0, 8).map((artist, index) => (
                <div key={artist.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary-600 w-6">#{index + 1}</span>
                    <Link 
                      to={`/artist/${artist.id}`}
                      className="font-medium text-neutral-900 hover:text-primary-600 transition-colors hover:underline"
                    >
                      {artist.name}
                    </Link>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-neutral-700">
                      {artist.variety.toFixed(3)}
                    </div>
                    <div className="text-xs text-neutral-500">Emotion Score</div>
                  </div>
                </div>
              ))}
              {artistEmotionVariety.length === 0 && (
                <div className="text-center text-neutral-500 py-8">
                  No artist emotion data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"> */}
          {/* Emotion Distribution Pie Chart */}
          {/* <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">Emotion Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ emotion, percentage }) => `${emotion} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div> */}

          {/* Artist Growth Line Chart */}
          {/* <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">Popularity Growth Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={artistGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="followers" stroke="#6366F1" name="Followers" />
                <Line yAxisId="right" type="monotone" dataKey="popularity" stroke="#EC4899" name="Popularity" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Genre Word Cloud & Love Frequency */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"> */}
          {/* Genre Word Cloud */}
          {/* <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">Genre High-Frequency Words</h3>
            <div className="h-64 flex items-center justify-center">
              <ReactWordcloud
                words={genreWordCloud}
                options={{
                  rotations: 2,
                  rotationAngles: [0, 0],
                  fontSizes: [14, 60],
                  padding: 2,
                  spiral: 'archimedean' as const,
                  transitionDuration: 1000,
                  deterministic: false
                }}
                callbacks={{
                  getWordColor: (word: any) => {
                    const colors = ['#EC4899', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6', '#F97316', '#84CC16', '#06B6D4'];
                    return colors[Math.floor(Math.random() * colors.length)];
                  },
                  getWordTooltip: (word: any) => `${word.text}: ${word.value}`,
                  onWordClick: (word: any) => {
                    // console.log(`Clicked: ${word.text}`);
                  }
                }}
              />
            </div> */}
          {/* </div> */}

          {/* Love Frequency by Emotion */}
          {/* <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">'Love' Usage Frequency by Emotion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loveFrequencyByEmotion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="#EC4899" name="Usage Frequency %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Artist Emotional Diversity Radar */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">Artist Emotional Diversity</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={artistEmotionalDiversity}>
                <PolarGrid />
                <PolarAngleAxis dataKey="artist" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Emotional" dataKey="emotional" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
                <Radar name="Energy" dataKey="energetic" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Radar name="Danceability" dataKey="danceable" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Radar name="Positive" dataKey="positive" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div> */}

          {/* Audio Features by Genre */}
          {/* <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-h4 font-semibold text-neutral-900 mb-4">Audio Features by Genre</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={audioFeaturesByGenre}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" name="Feature Value">
                  {audioFeaturesByGenre.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.category === 'Pop' ? '#6366F1' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Fun Facts Section */}
        {/* <div className="bg-gradient-to-br from-primary-50 to-surface rounded-lg p-8 border border-neutral-100 shadow-sm">
          <h3 className="text-h3 font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-primary-500" />
            Fun Facts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-neutral-100">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <h4 className="text-body font-semibold text-neutral-900 mb-1">Golden Hours</h4>
                  <p className="text-small text-neutral-600">
                    8-10 PM is the peak time for new song releases, accounting for 35% of daily releases
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-neutral-100">
              <div className="flex items-start gap-3">
                <Headphones className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <h4 className="text-body font-semibold text-neutral-900 mb-1">Loop Champions</h4>
                  <p className="text-small text-neutral-600">
                    On average, users loop their favorite songs 17 times
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-neutral-100">
              <div className="flex items-start gap-3">
                <Radio className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <h4 className="text-body font-semibold text-neutral-900 mb-1">Genre Fusion</h4>
                  <p className="text-small text-neutral-600">
                    Cross-genre collaborations increased by 68% in 2024
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        {/* </div> */}

        {/* More Insights Coming Soon */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 border border-purple-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-primary-500" />
              <h3 className="text-h3 font-bold text-neutral-900">More Insights Coming Soon</h3>
              <Zap className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-body text-neutral-600">
              We're working on even more exciting analytics and visualizations to help you discover deeper music patterns and trends
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}