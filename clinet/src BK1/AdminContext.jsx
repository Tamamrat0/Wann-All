import { createContext, useEffect, useState , useContext } from "react";
import axios from "axios";
import {UserContext} from "./UserContext";
import moment from 'moment';


export const AdminContext  = createContext({});

export function AdminContextProvider({children}){
    const {socket , user} = useContext(UserContext);
    // USER PAGE
    let [userall , setUserall] = useState(null)

    // PERMISSION PAGE
    const [pageall, setPageall] = useState(null)
    const [listpermission, setListpermission] = useState([]);
    const [permissusercount , setPermissusercount] = useState('');

    // ASSETS PAGE
    const [categories , setCategories] = useState(null)
    const [assetsall , setAssetsall] = useState(null)
    const [typesall , setTypesall] = useState(null)

    useEffect(()=>{
        const getuserall = async () =>{
            try{
                const response = await axios.get('/users/usersall')

                setUserall(response.data.map(items => ({ ...items, key: JSON.stringify(items.id)})))
            } catch (err){
                
            }
        }
        const getpageall = async () =>{
            try{
                const response = await axios.get('/permiss/pageall')

                setPageall(response.data)
            } catch (err){
                
            }
        }

        const getpermissionall = async () =>{
            try{
                const response = await axios.get('/permiss/permiss_g')

                setListpermission(response.data[0].pageall)
                setPermissusercount(response.data[0].pageuser)
            } catch (err){
                
            }
        }

        const getCategories = async () =>{
            try{
                const response = await axios.get('/assets/allcate')
                setCategories(response.data)
                // console.log(response.data)
            } catch (err){
                
            }
        }

        const getAllassets = async () =>{
            try{
                const response = await axios.get('/assets/allassets')

                setAssetsall(response.data
                    .filter(asset => categories.map(cat => cat.id).includes(asset.categories_id))
                    .map(item => {

                    const warrantyEndDate = moment(item.receive_date).clone().add(item.warranty_day, 'days');
                    return {
                        ...item,
                        warranty_status: warrantyEndDate.format('DD/MM/YYYY'),
                        key: JSON.stringify(item.id)
                      };
                }))

                // console.log(assetsall.filter(asset => categories.map(cat => cat.id).includes(asset.categories_id)));
                
                
            } catch (err){
                
            }
        }
        // console.log(assetsall.filter(fitem => fitem.categories_id === (categories.map(id => id.id))))

        // console.log(categories.map(item => item.id))
        const getAlltypes = async () =>{
            try{
                const response = await axios.get('/assets/alltypes')
                setTypesall(response.data)
            } catch (err){

            }
        }

        if(!userall) {  
            getuserall()
        } 

        if(!pageall) {
            getpageall()
        } 

        if(listpermission.length === 0) {
            getpermissionall()
        } 

        if(!categories) {
            getCategories()
        }

        if(!typesall) {
            getAlltypes()
        }

        if(!assetsall) {
            getAllassets()
        }


    },[user , userall,pageall,listpermission,permissusercount])
    

    return( 
        <AdminContext.Provider value={{assetsall , setAssetsall , userall , setUserall , pageall, setPageall , listpermission, setListpermission , permissusercount , setPermissusercount ,categories , setCategories , typesall , setTypesall }}>
            {children}
        </AdminContext.Provider>

    )
}
