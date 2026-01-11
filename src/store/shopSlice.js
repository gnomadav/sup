import { createSlice,createAsyncThunk} from '@reduxjs/toolkit';

export const fetchProd = createAsyncThunk(
    "shop/fetchProd",
    async () => {
        const res = await fetch("https://api.jsonbin.io/v3/b/6962ad1cae596e708fd3309e/latest");
        const data = await res.json();
        console.log(data);
        console.log("API response:", data); // ← добавь эту строку
        console.log("data.record:", data.record);
        return data.record.products;
    }
)

const initialState = {
    products:[],
    cart:JSON.parse(localStorage.getItem('cart')) || [],
    selectedProduct: null,
    status : "idle",
}

const shopSlice = createSlice({
    name:'shop',
    initialState,
    reducers:{
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        addToCart: (state,action) => {
            const existingItem = state.cart.find(
                item => item.id === action.payload.id && item.size === action.payload.size
            );
            
            if (existingItem) {
                existingItem.quantity += 1;  
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeFromCart: (state,action) => {
            state.cart = state.cart.filter (item => item.id !== action.payload)
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        setSelectedProduct: (state,action)  => {
            state.selectedProduct = action.payload;
        },
        updateQuantity: (state, action) => {
            const { index, quantity } = action.payload;
            if (quantity <= 0) {
                state.cart = state.cart.filter((_, i) => i !== index);
            } else {
                state.cart[index].quantity = quantity; 
            }
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        clearCart: (state) => {
            state.cart = [];
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
    },
    extraReducers: (builder) => {
            builder
            .addCase(fetchProd.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProd.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProd.rejected, (state) => {
                state.status = 'failed';
            });
        },
})

export const { setProducts, addToCart, removeFromCart, setSelectedProduct,updateQuantity,clearCart} = shopSlice.actions;
export default shopSlice.reducer;