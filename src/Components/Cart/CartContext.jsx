import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
    cart: [],
    history: [], 
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return {
                ...state,
                cart: [...state.cart, action.payload],
                history: [...state.history, { timestamp: new Date(), type: 'ADD', item: action.payload }], 
            };
        case 'REMOVE_FROM_CART':
            const removedItem = state.cart.find(item => item.id === action.payload);
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload),
                history: [...state.history, { timestamp: new Date(), type: 'REMOVE', item: removedItem }], 
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cart: [],
                history: [...state.history, { timestamp: new Date(), type: 'CLEAR' }], 
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (item) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    const removeFromCart = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{ cart: state.cart, history: state.history, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);