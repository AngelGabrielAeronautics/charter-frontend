import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UploadFile } from "antd";

import { API_BASE_URL } from "@/app/(config)/constants";

import { eModules } from "@/lib/enums/modules.enums";
import { IAsset } from "@/lib/models/IAssets";
import AssetService from "@/lib/services/asset.service";

const subject = eModules.AssetsModule;
const service = new AssetService(subject);

interface AssetsState {
  assets: IAsset[];
  selectedAsset?: IAsset;
  isFetchingAssets: boolean;
  loading: {
    getRecord: boolean;
    listRecords: boolean;
    createRecord: boolean;
    updateRecord: boolean;
  };
  success: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
  };
  error: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
  };
}

const initialState: AssetsState = {
  assets: [],
  isFetchingAssets: false,
  loading: {
    getRecord: false,
    listRecords: false,
    createRecord: false,
    updateRecord: false,
  },
  success: {
    getRecord: null,
    listRecords: null,
    createRecord: null,
    updateRecord: null,
  },
  error: {
    getRecord: null,
    listRecords: null,
    createRecord: null,
    updateRecord: null,
  },
};

// #region Async Thunks
export const findAll = createAsyncThunk(
  `${subject}/findAll`,
  async (_, thunk) => {
    return await service.findAll();
  }
);

export const filter = createAsyncThunk(
  `${subject}/filter`,
  async (payload: any, thunk) => {
    return await service.findByFilter(payload);
  }
);

export const findOne = createAsyncThunk(
  `${subject}/findOne`,
  async (id: string, thunk) => {
    return await service.findOne(id);
  }
);

export const create = createAsyncThunk(
  `${subject}/create`,
  async (
    { payload, images }: { payload: IAsset; images: UploadFile[] },
    thunk
  ) => {
    return await service.create({ payload, images });
  }
);

export const update = createAsyncThunk(
  `${subject}/update`,
  async ({ id, payload }: { id: string; payload: IAsset }, thunk) => {
    return await service.update(id, payload);
  }
);

export const addAssetThunk = createAsyncThunk(
  "assets/add",
  async (newAsset: IAsset) => {
    const response = await fetch(`${API_BASE_URL}/${subject}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAsset),
    });
    const data = await response.json();
    return data;
  }
);

export const updateAssetThunk = createAsyncThunk(
  `${subject}/update`,
  async (updatedAsset: IAsset) => {
    const response = await fetch(
      `${API_BASE_URL}/${subject}/${updatedAsset._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAsset),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update asset");
    }

    const data = await response.json();
    return data;
  }
);

export const deleteAssetThunk = createAsyncThunk(
  `${subject}/delete`,
  async (assetId: string) => {
    const response = await fetch(`${API_BASE_URL}/${subject}/${assetId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newData = await fetch(`${API_BASE_URL}/${subject}`);

    if (!response.ok) {
      throw new Error("Failed to delete asset");
    }

    return newData.json();
  }
);

export const fetchAssets = createAsyncThunk(`${subject}/fetchAll`, async () => {
  const response = await fetch(`${API_BASE_URL}/${subject}`);
  const data = await response.json();

  return data;
});

export const filterAssets = createAsyncThunk(
  `${subject}/filter`,
  async (operatorId: string) => {
    const response = await fetch(`${API_BASE_URL}/${subject}/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operatorId }),
    });
    const data = await response.json();

    return data;
  }
);

export const AssetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    setAssets(state, action: PayloadAction<IAsset[]>) {
      state.assets = action.payload;
    },
    addAsset(state, action: PayloadAction<IAsset>) {
      state.assets.push(action.payload);
    },
    updateAsset(state, action: PayloadAction<IAsset>) {
      const index = state.assets.findIndex(
        (asset: IAsset) => asset._id === action.payload._id
      );
      if (index !== -1) {
        state.assets[index] = action.payload;
      }
    },
    deleteAsset(state, action: PayloadAction<string>) {
      state.assets = state.assets.filter(
        (asset: IAsset) => asset._id !== action.payload
      );
    },
    resetActionStates: (state) => {
      state.loading = {
        getRecord: false,
        listRecords: false,
        createRecord: false,
        updateRecord: false,
      };
      state.success = {
        getRecord: null,
        listRecords: null,
        createRecord: null,
        updateRecord: null,
      };
      state.error = {
        getRecord: null,
        listRecords: null,
        createRecord: null,
        updateRecord: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(create.pending, (state, action) => {
      state.loading.createRecord = true;
      state.error.createRecord = false;
      state.success.createRecord = false;
    });
    builder.addCase(
      create.fulfilled,
      (state, action: PayloadAction<IAsset>) => {
        state.loading.createRecord = false;
        state.success.createRecord = true;
        state.assets = [action.payload, ...state.assets];
      }
    );
    builder.addCase(create.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(filter.pending, (state, action) => {
      state.isFetchingAssets = true;
    });
    builder.addCase(
      filter.fulfilled,
      (state, action: PayloadAction<IAsset[]>) => {
        state.isFetchingAssets = false;
        state.assets = action.payload.reverse();
      }
    );
    builder.addCase(filter.rejected, (state, action) => {
      state.isFetchingAssets = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(fetchAssets.pending, (state, action) => {
      state.isFetchingAssets = true;
    });
    builder.addCase(
      fetchAssets.fulfilled,
      (state, action: PayloadAction<IAsset[]>) => {
        state.isFetchingAssets = false;
        state.assets = action.payload.reverse();
      }
    );
    builder.addCase(fetchAssets.rejected, (state, action) => {
      state.isFetchingAssets = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(findOne.pending, (state, action) => {
      state.loading.getRecord = true;
    });
    builder.addCase(
      findOne.fulfilled,
      (state, action: PayloadAction<IAsset>) => {
        state.loading.getRecord = false;
        state.selectedAsset = action.payload;
      }
    );
    builder.addCase(findOne.rejected, (state, action) => {
      state.loading.getRecord = false;
      state.error.getRecord = action.error.message;
    });
    builder.addCase(findAll.pending, (state, action) => {
      state.loading.listRecords = true;
    });
    builder.addCase(
      findAll.fulfilled,
      (state, action: PayloadAction<IAsset[]>) => {
        state.loading.listRecords = false;
        state.assets = action.payload.reverse();
      }
    );
    builder.addCase(findAll.rejected, (state, action) => {
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(deleteAssetThunk.fulfilled, (state, action) => {
      state.assets = action.payload;
    });
    builder.addCase(updateAssetThunk.fulfilled, (state, action) => {
      state.assets = action.payload;
    });
  },
});

export const { setAssets, updateAsset, deleteAsset, resetActionStates } =
  AssetsSlice.actions;

export default AssetsSlice.reducer;
