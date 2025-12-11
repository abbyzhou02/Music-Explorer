import { Link } from 'react-router-dom';
import { Artist } from '../lib/artistApi';
// import { LikeButton } from './LikeButton';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="relative bg-surface rounded-lg p-4 border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-normal group">
      <Link to={`/artist/${artist.id}`} className="block">
        <div className="aspect-square rounded-md overflow-hidden mb-3">
          <img
            src={artist.urls && artist.urls.length>0 ? artist.urls[0] : '/placeholder.jpg'}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
          />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate">{artist.name}</h3>
        <p className="text-small text-neutral-700 mb-2">
          {artist.followers ? `${(artist.followers / 1000000).toFixed(1)}M followers` : ''}
        </p>
        <div className="flex justify-between items-center">
          {artist.genres && artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {artist.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-caption px-2 py-1 bg-primary-50 text-primary-900 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          {artist.popularity && (
            <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
              {artist.popularity}% Popularity
            </span>
          )}
        </div>
      </Link>
      
      {/* Like button */}
      {/* <div className="absolute top-2 right-2">
        <LikeButton
          objectType="artists"
          objectId={artist.id}
          size="sm"
          variant="default"
        />
      </div> */}
    </div>
  );
}
