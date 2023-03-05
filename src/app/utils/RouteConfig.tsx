import React, {useEffect} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import Login from "../views/authentications/Login";
import ForgotPassword from "../views/authentications/ForgotPassword";
import Verification from "../views/authentications/Verification";
import ResetPassword from "../views/authentications/ResetPassword";
import {ProtectedRoutes} from "../components/authentication/ProtectedRoutes";
import UserProvider from "../providers/UserProvider";
import CreateRoles from "../views/dashboard/roles/create-roles/CreateRoles";
import CreateUsers from "../views/dashboard/users/create-users/CreateUsers";
import DashboardLayout from "../layouts/DashboardLayout";
import NotFound from "../views/dashboard/pages/NotFound";
import UserListing from "../views/dashboard/users/UserListings";
import RoleListing from "../views/dashboard/roles/RoleListings";
import EditAPUser from "../views/dashboard/users/edit-users/EditAPUser";
import EditAPRoles from "../views/dashboard/edit-roles/EditAPRoles";
import {AnimatePresence} from "framer-motion";
import OrderTabs from "../views/dashboard/orders/OrderTabs";
import OrderDetail from "../views/dashboard/orders/OrderDetail";
import CreateRestaurantAdmin from "../views/dashboard/users/create-restaurant-admin/CreateRestaurantAdmin";
import AdminListing from "../views/dashboard/users/AdminListings";
import CustomerManagementListing from "../views/dashboard/customer-management/CustomerManagementListing";
import CustomerDetails from "../views/dashboard/customer-management/CustomerDetails";
import SettingTabs from "../views/dashboard/settings/SettingTabs";
import {BACKEND_CONSTANTS} from "../config/constants";
import {PermissionProtectedRoutes} from "../components/authentication/PermissionProtectedRoutes";
import Testing from "../views/dashboard/Testing";
import DashboardAnalyticsR from "../views/dashboard/DashboardAnalyticsR";

function RouteConfig() {
    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return (

        <AnimatePresence>
            <Routes>
                {/*Split layout right and left*/}
                <Route element={<AuthenticationLayout />}>
                    <Route index element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verification" element={<Verification/>} />
                    <Route path="/reset-password" element={<ResetPassword/>} />
                </Route>
                {/*Dashboard Page Layouts*/}
                <Route element={
                    <ProtectedRoutes>
                        <UserProvider>
                            <DashboardLayout/>
                        </UserProvider>
                    </ProtectedRoutes>}
                >
                    <Route path="/testing" element={
                        <Testing/>
                    }/>


                    <Route path="/create-roles" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.ROLE_MANAGEMENT} permissionName={'pivot_create'}>
                            <CreateRoles/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/create-users" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.USER_MANAGEMENT} permissionName={'pivot_create'}>
                            <CreateUsers/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/users" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.USER_MANAGEMENT} permissionName={'pivot_read'}>
                            <UserListing/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/roles" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.ROLE_MANAGEMENT} permissionName={'pivot_read'}>
                            <RoleListing/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/edit-ap-role/:id" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.ROLE_MANAGEMENT} permissionName={'pivot_update'}>
                            <EditAPRoles/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/edit-ap-user/:id" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.USER_MANAGEMENT} permissionName={'pivot_update'}>
                            <EditAPUser/>
                        </PermissionProtectedRoutes>
                    }/>

                    <Route path="/order-listings" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.ORDER_MANAGEMENT} permissionName={'pivot_read'}>
                            <OrderTabs/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/order-detail/:id" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.ORDER_MANAGEMENT} permissionName={'pivot_read'}>
                            <OrderDetail/>
                        </PermissionProtectedRoutes>
                    }/>

                    <Route path="/dashboard" element={<DashboardAnalyticsR/>}/>

                    <Route path="/create-restaurant-admin" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.ADMIN_MANAGEMENT} permissionName={'pivot_create'}>
                            <CreateRestaurantAdmin/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/admins" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.ADMIN_MANAGEMENT} permissionName={'pivot_read'}>
                            <AdminListing/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/customer-management-listing" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.CUSTOMER_MANAGEMENT} permissionName={'pivot_read'}>
                            <CustomerManagementListing/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/customer-details/:id" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.CUSTOMER_MANAGEMENT} permissionName={'pivot_read'}>
                            <CustomerDetails/>
                        </PermissionProtectedRoutes>
                    }/>
                    <Route path="/settings" element={
                        <PermissionProtectedRoutes moduleId={BACKEND_CONSTANTS.MODULES.SETTINGS} permissionName={'pivot_create'}>
                            <SettingTabs/>
                        </PermissionProtectedRoutes>
                    }/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </AnimatePresence>

    );
}

export default RouteConfig;