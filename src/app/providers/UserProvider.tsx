import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {UserAuthService} from "../services/api-services/user-auth-api.service";
import {IProfile, IUserProvider} from "../interfaces/IAuth";
import {defaultUser, IUser} from "../interfaces/IUser";
import {IAPIResponse} from "../interfaces/ICommon";
import {ROLES} from "../config/constants";
import {IGetEstablishmentDropdown} from "../interfaces/IGetEstablishment";
import {EstablishmentServices} from "../services/api-services/establishment.services";

const defaultUserProvider:IUserProvider = {
    loader: true,
    setLoader: ()=>{},
    title:"",
    setTitle: ()=>{},
    user: defaultUser,
    isRestaurantAdmin: false,
    matchUserRole: (number)=>Promise.resolve(true),
    token:null,
    setToken: ()=>{},
    onLogout:()=>{},
    theme: 'light',
    switchTheme: ()=>{},
    isUserReady:false,
    establishments: [],
    establishmentId: 0,
    setEstablishmentId: ()=>{},
    newNotification: false,
    setNewNotification: ()=>{},
    sidebarSwitcher:()=>{},
    sidebarCollapse:false,
    setSidebarCollapse:()=>{},
    isSuperAdmin: false
}
const UserContext = React.createContext<IUserProvider>(defaultUserProvider);

export const useUserContext = () => useContext(UserContext)


export default function UserProvider ({ children }:any){
    const navigate = useNavigate();
    const [title, setTitle] = React.useState<string>("");
    const [loader, setLoader] = React.useState<boolean>(true);
    const [token, setToken] = React.useState<string|null|undefined>(null);
    const [user, setUser] = React.useState<IUser>(defaultUser);
    const [isUserReady, setIsUserReady] = useState<boolean>(false)
    const [isRestaurantAdmin, setIsRestaurantAdmin] = useState<boolean>(false)
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false)
    const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light')
    const [establishmentId, setEstablishmentId] = useState<number>(0)
    const [establishments, setEstablishments] = useState<IGetEstablishmentDropdown[]>([])
    const [newNotification, setNewNotification] = useState<boolean>(false)
    const [sidebarCollapse, setSidebarCollapse] = useState<boolean>(false)
    const switchTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme)
        console.log(localStorage.getItem('theme'))
    }

    const sidebarSwitcher=()=>{
        setSidebarCollapse(!sidebarCollapse)
    }
    const setAuthUser = async() : Promise<IProfile> => {
        const profile:IAPIResponse<IProfile> = await UserAuthService.getUser()
        setUser(profile.data.profile)
        return profile.data
    }


    /*
    * SETUP ESTABLISHMENT ID
    * */
    const getEstablishments= async () => {
        const res = await EstablishmentServices.all()
        // console.log(res)
        if(res.status){
            setEstablishments(res.data)
            if(isUserReady && res.data.length > 0 && !localStorage.getItem('establishmentId')){
                localStorage.setItem('establishmentId',String(isRestaurantAdmin ? res.data[0].id : user.establishment_id))
                setEstablishmentId(isRestaurantAdmin ? res.data[0].id : user.establishment_id)
            }else{
                setEstablishmentId(Number(localStorage.getItem('establishmentId')))
            }
        }
    }
    useEffect(()=>{
        if(establishmentId > 0){
            localStorage.setItem('establishmentId',(establishmentId).toString())
            console.log(`selected establishment in localstorage`, localStorage.getItem('establishmentId'))
        }
    },[establishmentId])
    /*
    * END
    * */

    useEffect(()=>{
        if(user.id > 0){
            setIsUserReady(true)
        }
    },[user, establishmentId])

    useEffect(()=>{
        if(user.roles[0].id > ROLES.ADMIN) getEstablishments()
    },[isUserReady])

    const handleLogout = () => {
        setToken(null);
    }

    const matchUserRole = async(matchingRole:number, userProfile:IProfile):Promise<boolean> =>{
        const roles:any = userProfile.profile.roles
        return !!(roles.find((role:any)=>role.id === matchingRole))
    }

    const checkAndSetRestaurantAdmin = async(user:IProfile): Promise<void> =>{
        setIsRestaurantAdmin(await matchUserRole(ROLES.RESTAURANT_ADMIN, user))
    }

    const checkAndSetSuperAdmin = async(user: IProfile): Promise<void> =>{
        setIsSuperAdmin(await matchUserRole(ROLES.ADMIN, user))
    }

    const initializeUser = async ()=>{
        const user = await setAuthUser()
        checkAndSetRestaurantAdmin(user)
        checkAndSetSuperAdmin(user)
    }

    useEffect(()=>{
        setLoader(true)
        initializeUser()
    },[])


    const value = {
        theme,
        switchTheme,
        loader,
        setLoader,
        setTitle,
        title,
        user,
        isRestaurantAdmin,
        matchUserRole,
        token,
        setToken,
        onLogout: handleLogout,
        isUserReady,
        establishmentId,
        establishments,
        setEstablishmentId,
        newNotification,
        setNewNotification,
        sidebarCollapse,
        sidebarSwitcher,
        setSidebarCollapse,
        isSuperAdmin
    };

    return (
        <UserContext.Provider value={value}>
            {/*{isUserReady ? children : <></>}*/}
            {children}
        </UserContext.Provider>
    );
}

