import { combineReducers } from 'redux';
import roomRentalStatusReducer from '../slices/roomRentalStatusSlice';


const rootReducer = combineReducers({
  roomRentalStatus: roomRentalStatusReducer,

});

export default rootReducer;
