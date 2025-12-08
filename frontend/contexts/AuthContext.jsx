import React, { Children, createContext, useContext, useState } from 'react';

const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [account,setAccount] = useState();

    return (
      <AuthContext.Provider value = {{
        account,
        setAccount
      }}>
       {children}
      </AuthContext.Provider>   
    )
}

export const useAuth = () => useContext(AuthContext)