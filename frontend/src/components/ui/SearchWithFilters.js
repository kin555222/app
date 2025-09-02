import React, { useState, useRef, useEffect } from 'react';

const SearchWithFilters = ({
  searchTerm,
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  placeholder = "Search...",
  showClearButton = true,
  className = ''
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchInputRef = useRef(null);
  const filtersRef = useRef(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearSearch = () => {
    onSearchChange('');
    searchInputRef.current?.focus();
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {};
    filters.forEach(filter => {
      clearedFilters[filter.key] = filter.type === 'multiselect' ? [] : '';
    });
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value !== ''
    ).length;
  };

  const renderFilter = (filter) => {
    const value = activeFilters[filter.key] || (filter.type === 'multiselect' ? [] : '');

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <select
              value={value}
              onChange={(e) => onFilterChange({
                ...activeFilters,
                [filter.key]: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All {filter.label}</option>
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon && `${option.icon} `}{option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filter.options.map(option => (
                <label key={option.value} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...value, option.value]
                        : value.filter(v => v !== option.value);
                      onFilterChange({
                        ...activeFilters,
                        [filter.key]: newValue
                      });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    {option.icon && `${option.icon} `}{option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'range':
        return (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <input
              type="range"
              min={filter.min || 0}
              max={filter.max || 100}
              value={value || filter.min || 0}
              onChange={(e) => onFilterChange({
                ...activeFilters,
                [filter.key]: parseInt(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{filter.min || 0}</span>
              <span className="font-medium">{value || filter.min || 0}</span>
              <span>{filter.max || 100}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && showClearButton && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Controls */}
        {filters.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="relative" ref={filtersRef}>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                <span className="text-sm font-medium">Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              {/* Filter Dropdown */}
              {isFiltersOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-medium text-gray-900">Filter Options</h3>
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={handleClearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {filters.map(renderFilter)}
                </div>
              )}
            </div>

            {/* Active Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                
                const filter = filters.find(f => f.key === key);
                if (!filter) return null;

                if (Array.isArray(value)) {
                  return value.map(val => {
                    const option = filter.options.find(opt => opt.value === val);
                    return (
                      <span
                        key={`${key}-${val}`}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        <span>{option?.icon && `${option.icon} `}{option?.label || val}</span>
                        <button
                          onClick={() => {
                            const newValue = value.filter(v => v !== val);
                            onFilterChange({
                              ...activeFilters,
                              [key]: newValue
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    );
                  });
                } else {
                  const option = filter.options?.find(opt => opt.value === value);
                  const displayValue = option?.label || value;
                  
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <span>{option?.icon && `${option.icon} `}{displayValue}</span>
                      <button
                        onClick={() => onFilterChange({
                          ...activeFilters,
                          [key]: filter.type === 'multiselect' ? [] : ''
                        })}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWithFilters;
