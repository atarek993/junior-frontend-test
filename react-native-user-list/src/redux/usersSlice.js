import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';
const CACHE_KEY = 'cached-users';

const transformUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  address: `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`,
});

const mergeUniqueUsers = (baseUsers, incomingUsers) => {
  const mergedMap = new Map(baseUsers.map((user) => [user.id, user]));
  incomingUsers.forEach((user) => {
    mergedMap.set(user.id, user);
  });
  return [...mergedMap.values()];
};

export const fetchUsersPage = createAsyncThunk(
  'users/fetchUsersPage',
  async (_, { getState, rejectWithValue }) => {
    const { page, perPage, users } = getState().users;
    const nextPage = page + 1;

    try {
      const response = await fetch(`${USERS_API_URL}?_page=${nextPage}&_limit=${perPage}`);
      if (!response.ok) {
        throw new Error('Unable to fetch users');
      }

      const data = await response.json();
      const transformedUsers = data.map(transformUser);
      const mergedUsers = mergeUniqueUsers(users, transformedUsers);

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(mergedUsers));

      return {
        users: transformedUsers,
        page: nextPage,
        hasMore: transformedUsers.length === perPage,
        fromCache: false,
      };
    } catch (error) {
      if (users.length > 0) {
        return rejectWithValue('Using currently loaded users (network unavailable).');
      }

      const cachedUsersRaw = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedUsersRaw) {
        const cachedUsers = JSON.parse(cachedUsersRaw);
        return {
          users: cachedUsers,
          page: Math.ceil(cachedUsers.length / perPage),
          hasMore: false,
          fromCache: true,
        };
      }

      return rejectWithValue(error.message || 'Failed to fetch users.');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    page: 0,
    perPage: 4,
    hasMore: true,
    loading: false,
    error: null,
    searchQuery: '',
    usingOfflineCache: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersPage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.usingOfflineCache = action.payload.fromCache;
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;

        if (action.payload.fromCache) {
          state.users = action.payload.users;
        } else {
          state.users = mergeUniqueUsers(state.users, action.payload.users);
        }
      })
      .addCase(fetchUsersPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch users.';
      });
  },
});

export const { setSearchQuery } = usersSlice.actions;
export default usersSlice.reducer;
