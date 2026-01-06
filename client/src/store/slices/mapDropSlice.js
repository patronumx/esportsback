import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

// Thunks defined BEFORE slice to avoid hoisting issues

export const fetchMapDrop = createAsyncThunk(
    'mapDrop/fetchMapDrop',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/map-drops/latest');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const publishMapDrop = createAsyncThunk(
    'mapDrop/publishMapDrop',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/map-drops', payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchMapHistory = createAsyncThunk(
    'mapDrop/fetchMapHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/map-drops');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const loadMapFromHistory = createAsyncThunk(
    'mapDrop/loadMapFromHistory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/map-drops/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteMapDrop = createAsyncThunk(
    'mapDrop/deleteMapDrop',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/map-drops/${id}`);
            return id; // Return ID to remove from state
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    mapName: 'ERANGEL',
    objects: [],
    title: '', // Event Name
    stage: '', // Stage Name
    day: '', // Day Name
    matchNumber: '', // Match Number
    mapHistory: [], // List of saved maps
    loading: false,
    error: null,
    lastUpdated: null
};

const mapDropSlice = createSlice({
    name: 'mapDrop',
    initialState,
    reducers: {
        setMapName: (state, action) => {
            state.mapName = action.payload;
        },
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        setStage: (state, action) => {
            state.stage = action.payload;
        },
        setDay: (state, action) => {
            state.day = action.payload;
        },
        setMatchNumber: (state, action) => {
            state.matchNumber = action.payload;
        },
        setObjects: (state, action) => {
            state.objects = action.payload;
        },
        addLogo: (state, action) => {
            state.objects.push(action.payload);
        },
        updateLogo: (state, action) => {
            const { id, changes } = action.payload;
            const index = state.objects.findIndex(obj => obj.id === id);
            if (index !== -1) {
                state.objects[index] = { ...state.objects[index], ...changes };
            }
        },
        removeLogo: (state, action) => {
            state.objects = state.objects.filter(obj => obj.id !== action.payload);
        },
        clearMap: (state) => {
            state.objects = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Latest
            .addCase(fetchMapDrop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMapDrop.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.mapName = action.payload.mapName || 'ERANGEL';
                    state.objects = action.payload.objects || [];
                    state.title = action.payload.title || '';
                    state.stage = action.payload.stage || '';
                    state.day = action.payload.day || '';
                    state.matchNumber = action.payload.matchNumber || '';
                    state.lastUpdated = action.payload.updatedAt;
                }
            })
            .addCase(fetchMapDrop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Publish
            .addCase(publishMapDrop.pending, (state) => {
                state.loading = true;
            })
            .addCase(publishMapDrop.fulfilled, (state, action) => {
                state.loading = false;
                state.lastUpdated = action.payload.updatedAt;
                state.title = action.payload.title;
                state.stage = action.payload.stage;
                state.day = action.payload.day;
                state.matchNumber = action.payload.matchNumber;
            })
            .addCase(publishMapDrop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch History
            .addCase(fetchMapHistory.fulfilled, (state, action) => {
                state.mapHistory = action.payload;
            })
            // Load from History
            .addCase(loadMapFromHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadMapFromHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.mapName = action.payload.mapName;
                state.objects = action.payload.objects;
                state.title = action.payload.title;
                state.stage = action.payload.stage;
                state.day = action.payload.day || '';
                state.matchNumber = action.payload.matchNumber || '';
                state.lastUpdated = action.payload.updatedAt;
            })
            // Delete Map Drop
            .addCase(deleteMapDrop.fulfilled, (state, action) => {
                state.mapHistory = state.mapHistory.filter(item => item._id !== action.payload);
            });
    }
});

export const { setMapName, setTitle, setStage, setDay, setMatchNumber, setObjects, addLogo, updateLogo, removeLogo, clearMap } = mapDropSlice.actions;
export default mapDropSlice.reducer;
