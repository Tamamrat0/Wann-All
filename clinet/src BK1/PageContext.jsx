import { createContext, useEffect, useState } from "react";


export const PageContext  = createContext({});

export function PageContextProvider({children}){

    const [hidesidebar , setHidesidebar ] = useState(false)
    const [darkmode , setDarkmode] = useState(false)
    return( 
        <PageContext.Provider value={{hidesidebar , setHidesidebar , darkmode , setDarkmode }}>
            {children}
        </PageContext.Provider>

    )
}
