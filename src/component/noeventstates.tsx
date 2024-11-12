import React from 'react';
import { Search, Calendar, RefreshCcw } from 'lucide-react';

interface NoEventsStateProps {
  searchQuery: string;
  selectedCategory: string;
  onClearSearch: () => void;
  onResetCategory: () => void;
}

const NoEventsState: React.FC<NoEventsStateProps> = ({ 
  searchQuery, 
  selectedCategory,
  onClearSearch,
  onResetCategory 
}) => {
  const hasFilters = searchQuery || selectedCategory !== 'all';

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {hasFilters ? (
          <>
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery && selectedCategory !== 'all' 
                ? `No events found matching "${searchQuery}" in the ${selectedCategory} category.`
                : searchQuery 
                ? `No events found matching "${searchQuery}".`
                : `No events found in the ${selectedCategory} category.`
              }
            </p>
            <div className="space-y-3">
              <button
                onClick={onClearSearch}
                className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Clear search filters
              </button>
              <button
                onClick={onResetCategory}
                className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Show all events
              </button>
            </div>
          </>
        ) : (
          <>
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No events available
            </h3>
            <p className="text-gray-600">
              There are currently no events scheduled. Please check back later.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default NoEventsState;