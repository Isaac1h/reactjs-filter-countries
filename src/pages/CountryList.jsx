import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getData } from "../features/countries";
import spinner from "../assets/spinner.svg";
import FilterDropdown from '../elements/FilterDropdown';
import SearchInput from "../elements/SearchInput";

export default function CountriesList({ isDarkMode, onSelectCountry }) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.countries);

  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  const filteredData = data
    ? data.filter(country =>
        (selectedRegion === 'All' || country.region === selectedRegion) &&
        country.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  let contentData;
  if (loading) contentData = <img src={spinner} alt="spinner loader" />;
  if (error) contentData = <p className="text-red-600">An error has occurred</p>;
  if (currentItems.length > 0) {
    contentData = (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentItems.map(country => (
            <Link 
              key={country.alpha3Code} 
              to={`/country/${country.name.replace(/\s+/g, '-').toLowerCase()}`} 
              onClick={() => onSelectCountry(country)}
              className={`border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer transform 
              transition-transform duration-200 hover:-translate-y-1 
              ${isDarkMode ? 'dark shadow-md text-slate-50 border-slate-800' : ''}`}
            >
              <div className="relative overflow-hidden rounded-t-md">
                <div className="w-full h-48">
                  <img src={country.flags.svg} alt={`${country.name} flag`} className="w-full h-full object-cover" />
                </div>
              </div>
              <h2 className="text-lg font-semibold mb-2 px-4 pt-4 pb-2">{country.name}</h2>
              <p className="px-4"><strong>Population:</strong> {country.population.toLocaleString()}</p>
              <p className="px-4"><strong>Region:</strong> {country.region}</p>
              <p className="px-4 pb-4"><strong>Capital:</strong> {country.capital}</p>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i + 1)}
              className={`px-3 py-1 mx-1 border rounded 
                ${currentPage === i + 1 ? 'text-slate-50 text-slate-800' : 'bg-white text-slate-800'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  } else if (filteredData.length === 0 && !loading && !error) {
    contentData = <p className="text-gray-600">No countries found matching your criteria.</p>;
  }

  return (
    <div>
      <div className="relative flex flex-col md:flex-row justify-between p-4 md:p-8 space-y-4">
        <SearchInput isDarkMode={isDarkMode} searchText={searchText} setSearchText={setSearchText} />
        <FilterDropdown isDarkMode={isDarkMode} onSelectRegion={setSelectedRegion} />
      </div>
      <div className="items-center p-8 ">
        {contentData}
      </div>
    </div>
  );
}
