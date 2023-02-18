import {Layout, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import "../../../assets/css/components/dashboard/dashboardheader.scss";
import {BsSearch, BsSun} from "react-icons/bs";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import ThemeModal from "../Modal";
import SelectField from "../dashboard/SelectField";
import {useUserContext} from "../../providers/UserProvider";
import {IoMoonOutline} from "react-icons/io5"
// import {onMessageListener} from "../../services/helper/firebase";
import {toast} from "react-toastify";
import {ROLES} from "../../config/constants";
import {RiMenuUnfoldFill} from "react-icons/ri"
import {RxDragHandleDots2} from "react-icons/rx"
import DashboardOffCanvas from "./DashboardOffCanvas";
import EditModifier from "../../views/dashboard/modifiers/EditModifier";
import ViewCard from "./ViewCard";
const { Header} = Layout;


export default function DashboardHeader(){
    const {sidebarSwitcher, setNewNotification,newNotification,title,switchTheme,theme,isRestaurantAdmin, user, isUserReady,establishments,establishmentId, setEstablishmentId} = useUserContext()
    const [dropdown , setdropdown] = useState({
        notification: false,
        profile: false,
    });
    const [mobileOffcanvas, setmobileOffcanvas] = useState(false);
    const [search, setSearch] = useState(false)
    function searchHanlder(){
        setSearch(!search)
    }

    // onMessageListener().then((payload:any) => {
    //     console.log(`payload`,payload)
    //     if(payload){
    //         toast.success(payload?.notification?.body)
    //         setNewNotification(!newNotification)
    //     }
    //
    // }).catch(err => console.log('failed: ', err));

    function openMobileCanvas(){
        setmobileOffcanvas(!mobileOffcanvas)
    }


    return(
        // <Header className="site-layout-background" style={{ padding: 0 }} >
        <div className={"dashboard-header"}>
            <div className={"menu-active"}>
                <div className={"menu-icon d-block d-xl-none"} onClick={sidebarSwitcher}>
                    <RiMenuUnfoldFill/>
                </div>
                <div className={"heading"}>
                    <h3>{title}</h3>
                </div>
                {/*<div className={"date"}>*/}
                {/*    <h6>Last Login Date: 17-08-2021 | Tuesday</h6>*/}
                {/*</div>*/}
            </div>
            <div className={"header-options"}>
                <div className={"establishment-select"}>
                    {/*<SelectField placeholder={"Select Restaurant"}/>*/}
                    {(isUserReady && user.roles[0].id > ROLES.ADMIN) && <SelectField
                        defaultValue={establishmentId}
                        placeholder={"Select Estabishment"}
                        selectOptions={establishments}
                        disabled={!isRestaurantAdmin}
                        setSelectedEstablishment={setEstablishmentId}
                    />
                    }
                </div>
                <div className={"d-none"} >
                    <BsSearch onClick={searchHanlder} />
                </div>

                <div className={"switcher-icon"} onClick={switchTheme}>
                    {theme === 'light' ?
                        <Tooltip placement="bottom" title={"Dark Mood"}>
                            <IoMoonOutline/>
                        </Tooltip>

                        :
                        <Tooltip placement="bottom" title={"Light Mood"}>
                            <BsSun/>
                        </Tooltip>
                    }
                </div>
                <NotificationDropdown dropdown={dropdown.notification} setDropdown={setdropdown}/>
                <ProfileDropdown dropdown={dropdown.profile} setDropdown={setdropdown}/>
                <div className={"mobile-options d-block d-md-none"} onClick={openMobileCanvas}>
                    <RxDragHandleDots2/>
                </div>
                <ThemeModal children={<SelectField/>} setActive={setSearch} active={search}/>
                <DashboardOffCanvas
                    state={mobileOffcanvas}
                    setActive={setmobileOffcanvas}
                    children={
                        <div className={"establishment-select"}>
                            {/*<SelectField placeholder={"Select Restaurant"}/>*/}
                            {(isUserReady && user.roles[0].id > ROLES.ADMIN) && <SelectField
                                label={'Select Restaurant'}
                                defaultValue={establishmentId}
                                placeholder={"Select Estabishment"}
                                selectOptions={establishments}
                                disabled={!isRestaurantAdmin}
                                setSelectedEstablishment={setEstablishmentId}
                            />
                            }
                        </div>
                    }
                    heading={"Settings"}
                />
            </div>
        </div>



        // </Header>
    )

}