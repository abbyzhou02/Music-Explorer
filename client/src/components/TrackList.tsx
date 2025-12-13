import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface Track {
  id: string;
  name: string;
  artist_ids: string[];
  album_id?: string;
  album_name: string;
  // popularity: number;
  duration_ms?: number;
  energy?: number;
  danceability?: number;
}

interface TrackListProps {
  tracks: Track[]; // Track data for current page
  loading?: boolean;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function TrackList({
  tracks,
  loading = false,
  totalItems = 0,
  currentPage: externalCurrentPage = 1,
  itemsPerPage: externalItemsPerPage = 10,
  onPageChange,
  onPageSizeChange
}: TrackListProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(externalCurrentPage);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);

  // Use external value or internal state
  const currentPage = onPageChange ? externalCurrentPage : internalCurrentPage;
  const itemsPerPage = onPageSizeChange ? externalItemsPerPage : internalItemsPerPage;
  
  // Calculate total pages
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    } else {
      setInternalItemsPerPage(newPageSize);
      setInternalCurrentPage(1); // Reset to first page
    }
  };

  // Synchronize external state changes
  useEffect(() => {
    if (onPageChange) {
      setInternalCurrentPage(externalCurrentPage);
    }
  }, [externalCurrentPage, onPageChange]);

  useEffect(() => {
    if (onPageSizeChange) {
      setInternalItemsPerPage(externalItemsPerPage);
    }
  }, [externalItemsPerPage, onPageSizeChange]);

  // Calculate current page display range
  const startIndex = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 1;
  const endIndex = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : tracks.length;

  if (loading) {
    return (
      <div className="bg-surface py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 mb-6">Tracks</h2>
          <div className="bg-surface rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">#</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Track Name</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Album</th>
                  <th className="text-right py-3 px-4 text-small font-semibold text-neutral-700"></th>
                  <th className="text-right py-3 px-4 text-small font-semibold text-neutral-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="py-3 px-4">
                      <div className="h-4 bg-neutral-200 rounded w-4"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-neutral-200 rounded w-1/4 ml-auto"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-neutral-200 rounded w-1/4 ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface py-12">
      <div className="container mx-auto px-8">
        <h2 className="text-h2 font-semibold text-neutral-900 mb-6">Tracks</h2>
        <div className="bg-surface rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">#</th>
                <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Track Name</th>
                <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Album</th>
                <th className="text-right py-3 px-4 text-small font-semibold text-neutral-700"></th>
                <th className="text-right py-3 px-4 text-small font-semibold text-neutral-700">Duration</th>
              </tr>
            </thead>
            <tbody>
              {tracks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-body text-neutral-600">
                    No tracks available
                  </td>
                </tr>
              ) : (
                tracks.map((track, index) => (
                  <tr
                    key={track.id}
                    className="border-b border-neutral-100 hover:bg-primary-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-body text-neutral-600">{startIndex + index}</td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/track/${track.id}`}
                        className="text-body font-medium text-neutral-900 hover:text-primary-500"
                      >
                        {track.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      {track.album_id ? (
                        <Link
                          to={`/album/${track.album_id}`}
                          className="text-body text-neutral-700 hover:text-primary-500"
                        >
                          {track.album_name}
                        </Link>
                      ) : (
                        <span className="text-body text-neutral-700">{track.album_name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-body text-neutral-900 font-semibold">
                      {/* {track.popularity} */}
                    </td>
                    <td className="py-3 px-4 text-right text-body text-neutral-700">
                      {formatDuration(track.duration_ms)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface rounded-lg border border-neutral-200">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="track-page-size" className="text-body-small text-neutral-600">
                Show:
              </label>
              <select
                id="track-page-size"
                value={itemsPerPage}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-neutral-300 rounded-md text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-body-small text-neutral-600">per page</span>
            </div>

            {/* Page Info */}
            <div className="text-body-small text-neutral-600">
              {totalItems > 0 
                ? `Showing ${startIndex}-${endIndex} of ${totalItems} tracks`
                : `Showing ${tracks.length} tracks`
              }
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-body-small border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-body-small border rounded-md transition-colors ${
                        pageNum === currentPage
                          ? 'bg-primary-500 text-surface border-primary-500'
                          : 'border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-body-small border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}