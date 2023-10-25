import React, { useState } from 'react';
import { LISTPROPERTY } from './listProperty';

function PropertySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  
  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    // Generate search suggestions based on the input
    const suggestedProperties = generateSuggestions(newSearchTerm);
    setSuggestions(suggestedProperties);
  };

  const handleSearch = () => {
    const result = searchPropertyByName(searchTerm);
    setSearchResult(result);
  };

  const searchPropertyByName = (propertyName) => {
    const property = LISTPROPERTY.find((property) => property.propertyName === propertyName);
    return property;
  };

  const generateSuggestions = (input) => {
    if (input === '') {
      return [];
    }
    const filteredProperties = LISTPROPERTY.filter((property) =>
      property.propertyName.toLowerCase().includes(input.toLowerCase())
    );
    return filteredProperties.map((property) => property.propertyName);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  return (
    <div>
      <h1>Property Search</h1>
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
        <div>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        {searchResult ? (
          <div>
            <h2>Thông tin bất động sản {searchResult.propertyName}</h2>
            <p>Địa chỉ: {searchResult.address}</p>
            <p>Ngày đăng ký: {searchResult.registrationDate}</p>
            <p>Đơn vị cho thuê: {searchResult.unitForRent}</p>
            <p>Chức năng bất động sản: {searchResult.propertyRole}</p>
            <p>Chủ sở hữu: {searchResult.owner}</p>
            <p>Email chủ sở hữu: {searchResult.ownerEmail}</p>
            <p>Trạng thái: {searchResult.status}</p>
            {searchResult.pictureUrl && (
              <div>
                <h3>Hình ảnh</h3>
                <img src={searchResult.pictureUrl} alt="Hình ảnh bất động sản" />
              </div>
            )}
          </div>
        ) : (
          <p>Không tìm thấy bất động sản.</p>
        )}
      </div>
    </div>
  );
}

export default PropertySearch;
