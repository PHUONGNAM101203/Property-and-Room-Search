import { createSlice } from '@reduxjs/toolkit';
const initialState = {};

const roomRentalStatusSlice = createSlice({
  name: 'roomRentalStatus',
  initialState,
  reducers: {
    setRentalStatus: (state, action) => {
      const { roomId, isRentalRequested } = action.payload;
      state[roomId] = isRentalRequested;
    },
  },
});

export const { setRentalStatus } = roomRentalStatusSlice.actions;
export default roomRentalStatusSlice.reducer;
