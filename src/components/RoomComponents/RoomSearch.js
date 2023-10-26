import React, { useState, useEffect } from 'react';
import { LISTROOMS } from './listRooms';

function RoomSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tagSearch, setTagSearch] = useState('');
  const [roomSuggestions, setRoomSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  useEffect(() => {
    // Extract all unique tags from the LISTROOMS
    const allTags = LISTROOMS.reduce((tags, room) => {
      room.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
      return tags;
    }, []);
    setTagSuggestions(allTags);
  }, []);

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(event.target.value);
    const suggestedRooms = generateSuggestions(newSearchTerm);
    setRoomSuggestions(suggestedRooms);
  };

  const handleSearch = () => {
    // Filter rooms based on the selected tag
    const filteredRoomsByTag = LISTROOMS.filter((room) =>
      room.tags.includes(tagSearch)
    );

    // Update the filtered rooms
    setFilteredRooms(filteredRoomsByTag);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
    filterRooms();
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
    filterRooms();
  };

  const handleTagSearchChange = (event) => {
    setTagSearch(event.target.value);
  };

  const generateSuggestions = (input) => {
    if (input === '') {
      return [];
    }
    const filteredRooms = LISTROOMS.filter((room) =>
      room.roomName.toLowerCase().includes(input.toLowerCase())
    );
    return filteredRooms.map((room) => room.roomName);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setRoomSuggestions([]); // Clear the suggestions
    const result = searchRoomByRoomNumber(suggestion); // Search for the room immediately
    setSearchResult(result);
  };

  const filterRooms = () => {
    const filtered = filterRoomsByPrice(minPrice, maxPrice);
    // If a tag is selected, also filter by tag
    const filteredRoomsByTag = tagSearch
      ? filtered.filter((room) =>
          room.tags.includes(tagSearch)
        )
      : filtered;
    setFilteredRooms(filteredRoomsByTag);
  };

  const filterRoomsByPrice = (minPrice, maxPrice) => {
    return LISTROOMS.filter((room) => {
      const price = room.price;
      return price >= minPrice && price <= maxPrice;
    });
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
  };

  const searchRoomByRoomNumber = (roomNumber) => {
    const room = LISTROOMS.find((room) => room.roomName === roomNumber);
    return room;
  };

  const sortRoomsByTags = (rooms) => {
    return rooms.sort((a, b) => {
      if (!a.tags && b.tags) {
        return 1;
      }
      if (a.tags && !b.tags) {
        return -1;
      }
      if (a.picturesURL.length === 0 && b.picturesURL.length > 0) {
        return 1;
      }
      if (a.picturesURL.length > 0 && b.picturesURL.length === 0) {
        return -1;
      }
      return 0;
    });
  };

  const sortedRooms = sortRoomsByTags(filteredRooms);
  return (
    <div>
      <h1>Room Search</h1>
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm phòng theo số phòng"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        
        <div>
          <ul>
            {roomSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
     <div>
     <input
       type="text"
       placeholder="Tìm kiếm theo tag"
       value={tagSearch}
       onChange={handleTagSearchChange}
     />
     <button onClick={handleSearch}>Tìm kiếm theo tags</button>
     <ul>
       {tagSuggestions
         .filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))
         .map((suggestion, index) => (
           <li key={index} onClick={() => setTagSearch(suggestion)}>
             {suggestion}
           </li>
         ))}
     </ul>
   </div>
   <div>
      <label htmlFor="minPrice">Giá tối thiểu:</label>
      <input
        type="number"
        id="minPrice"
        value={minPrice}
        onChange={handleMinPriceChange}
      />
    </div>
    <div>
      <label htmlFor="maxPrice">Giá tối đa:</label>
      <input
        type="number"
        id="maxPrice"
        value={maxPrice}
        onChange={handleMaxPriceChange}
      />
    </div>
    {searchResult ? (
      <div>
        <h2>Thông tin phòng {searchResult.roomName}</h2>
        <p>Địa chỉ: {searchResult.address}</p>
        <p>Mô tả: {searchResult.description}</p>
        <p>Diện tích: {searchResult.acreage}</p>
        <p>Giá: {searchResult.price}</p>
        <p>Số người tối đa: {searchResult.maxQuantity}</p>
        <p>Trạng thái: {searchResult.status}</p>
        {searchResult.picturesURL.length > 0 && (
          <div>
            <h3>Hình ảnh</h3>
            {searchResult.picturesURL.map((url, index) => (
              <img key={index} src={url} alt={`Hình ${index + 1}`} />
            ))}
          </div>
        )}
        {searchResult.tags && searchResult.tags.length > 0 && (
          <div>
            <h3>Tags</h3>
            <ul>
              {searchResult.tags.map((tag, index) => (
                <li key={index}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ) : (
      <div>
        <h2>Danh sách phòng (theo giá)</h2>
        <ul>
          {sortedRooms.map((room) => (
            <li key={room.room_id}>
              <strong>{room.roomName}</strong> - Giá: {room.price}
              <button onClick={() => handleViewRoom(room)}>Xem phòng</button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {selectedRoom && (
      <div>
        <h2>Thông tin chi tiết của phòng {selectedRoom.roomName}</h2>
        <p>Địa chỉ: {selectedRoom.address}</p>
        <p>Mô tả: {selectedRoom.description}</p>
        <p>Diện tích: {selectedRoom.acreage}</p>
        <p>Giá: {selectedRoom.price}</p>
        <p>Số người tối đa: {selectedRoom.maxQuantity}</p>
        <p>Trạng thái: {selectedRoom.status}</p>
        {selectedRoom.picturesURL.length > 0 && (
          <div>
            <h3>Hình ảnh</h3>
            {selectedRoom.picturesURL.map((url, index) => (
              <img key={index} src={url} alt={`Hình ${index + 1}`} />
            ))}
          </div>
        )}
        {selectedRoom.tags && selectedRoom.tags.length > 0 && (
          <div>
            <h3>Tags</h3>
            <ul>
              {selectedRoom.tags.map((tag, index) => (
                <li key={index}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}
  </div>
   
     
  );
      
  
  
  }

export default RoomSearch;
