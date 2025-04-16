"use client"

import { createContext, useState } from "react";

export const CartUpdateContext = createContext();

export const CartUpdateProvider = ({ children }) => {
  const [updateCart, setUpdateCart] = useState(false);

  return (
    <CartUpdateContext.Provider value={{ updateCart, setUpdateCart }}>
      {children}
    </CartUpdateContext.Provider>
  );
};