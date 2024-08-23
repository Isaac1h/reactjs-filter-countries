import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getData } from "./features/countries";
import spinner from "./assets/spinner.svg";
import FilterDropdown from './components/elements/FilterDropdown';
import SearchInput from "./components/elements/SearchInput";

export default function CountryList() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector(state => state.countries);

    // State pour la région sélectionnée
    const [selectedRegion, setSelectedRegion] = useState('All');

    // Charger les données lors du montage du composant
    useEffect(() => {
        dispatch(getData());
    }, [dispatch]);

    // Filtrer les données en fonction de la région sélectionnée
    const filteredData = selectedRegion === 'All' 
        ? data 
        : data.filter(country => country.region === selectedRegion);

    let contentData;
    if (loading) contentData = <img src={spinner} alt="spinner loader" />;
    if (error) contentData = <p className="text-red-600">An error has occurred</p>;
    if (filteredData) {
      contentData = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredData.map(country => (
            <div key={country.name} className="border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer transform transition-transform duration-200 hover:-translate-y-1">
              <img src={country.flag} alt={`${country.name} flag`} className="w-full h-32 object-cover rounded-t-md" />
              <h2 className="text-lg font-semibold mb-2 px-4 pt-4 pb-2">{country.name}</h2>
              <p className="px-4"><strong>Population:</strong> {country.population}</p>
              <p className="px-4"><strong>Region:</strong> {country.region}</p>
              <p className="px-4 pb-4"><strong>Capital:</strong> {country.capital}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <div className="relative flex justify-between p-8">
            <SearchInput /> 
            <FilterDropdown onSelectRegion={setSelectedRegion} />
        </div>
        <div className="items-center p-8">
            {contentData}
        </div>
      </div>
      
    );
}
