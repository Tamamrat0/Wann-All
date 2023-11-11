import { createContext, useEffect, useState ,useContext} from "react";

import { UserContext } from "./UserContext";
import axios from "axios";
export const TicketConntext  = createContext({});


export function TicketContextProvider({children}){

    const {user} = useContext(UserContext)
    const [ticketlist , setTicketlist] = useState([])

    // console.log(user)

    useEffect(()=>{
        const getListTicket = async () => {
            try{
                const respone = await axios.get('/ticket/')
                setTicketlist(respone.data)
                console.log(respone.data)
                console.log(1)
            }catch(err){

            }
        }
        
        if(ticketlist.length <1){   
            getListTicket()
        }

    },[user])
    
    return( 
        <TicketConntext.Provider value={{ticketlist , setTicketlist}}>
            {children}
        </TicketConntext.Provider>

    )
}
