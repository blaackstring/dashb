import React, { useEffect } from 'react';

function Filter({ fields, Insights, setInsights, filters, setFilters, data, setActualDataToPass }) {
  useEffect(() => {
    if (!data.length) return;

    const FilteredData = data.filter((item) =>
      Object.entries(filters).every(([key, value]) => value === '' || item[key] === value)
    );

    setActualDataToPass(FilteredData);

    const newInsights = {};
    for (let field of fields) {
      const values = field === 'end_year'
        ? data.map((item) => item[field]).filter(Boolean)
        : FilteredData.map((item) => item[field]).filter(Boolean);

      newInsights[field] = [...new Set(values)];
    }

    setInsights(newInsights);
  }, [filters, data]);

  useEffect(() => {
    const updatedFilters = { ...filters };
    let hasChanged = false;

    for (let key of Object.keys(filters)) {
      if (filters[key] && !Insights[key]?.includes(filters[key])) {
        updatedFilters[key] = '';
        hasChanged = true;
      }
    }

    if (hasChanged) {
      setFilters(updatedFilters);
    }
  }, [Insights]);

  const handleFilterChange = (e, field) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="filter-bar flex flex-nowrap overflow-x-auto gap-1 sm:gap-3 justify-start sm:justify-center items-end   backdrop-blur-md rounded-md shadow px-1 sm:px-2 py-1 sm:py-2 mt-2 mb-4 border border-white/20 sticky top-14 z-40 scrollbar-hide">
      {fields.map((field) => (
        <div
          key={field}
          className="filter-field flex flex-col items-start min-w-[90px] sm:min-w-[110px] mx-1 my-0.5 text-[11px] sm:text-xs"
        >
          <label className="mb-0.5 font-medium text-gray-200 pl-1 leading-none">
            {field.toUpperCase()}
          </label>
          <select
            className="bg-white/90 text-gray-900 w-24 sm:w-32 p-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-400 text-[11px] sm:text-xs"
            onChange={(e) => handleFilterChange(e, field)}
            value={filters[field] || ''}
          >
            <option value="" className="text-gray-500">
              {field !== 'end_year' ? `Select ${field}` : 'All End Year'}
            </option>
            {Insights[field]?.map((value) => (
              <option key={value} value={value} className="text-gray-900">
                {value}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default Filter;
