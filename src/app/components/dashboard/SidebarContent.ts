import {BACKEND_CONSTANTS} from "../../config/constants";
import {
    cmsIcon,
    dashbaordIcons,
    discountIcon,
    galleryIcon,
    menuMIcon,
    orderMIcon,
    paymentIcon,
    printerIcon,
    promoIcon,
    reportIcon,
    restaurantMIcon,
    roleMIcon,
    settingIcon,
    tableMIcon,
    userMIcon
} from "../../../assets/images/icons/menu-icons/sideMenuIcons";
import {
    menuIcon,
    SideModifierIcon,
    SidePromoIcon,
    SideUserMIcon
} from "../../../assets/images/icons/menu-icons/performances";

const PERMISSION_ENUM = {
    ALLOWED: true, // no need to check from api
    NOT_ALLOWED: false // need to check from api
}

export const SidebarContent = [
    {
        id: 0,
        route: '/dashboard',
        icon: dashbaordIcons,
        permission: PERMISSION_ENUM.ALLOWED,
        title: "Dashboard",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.MENU_MANAGEMENT,
        route: '/',
        icon: menuMIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: 'Menu Management',
        childrens:[
            {
                id:0,
                route: '/menu',
                permission: PERMISSION_ENUM.ALLOWED,
                icon: null,
                title: "Menu Inventory"
            },
            {
                id:0,
                route: '/custom-menu',
                permission: PERMISSION_ENUM.ALLOWED,
                icon: null,
                title: "Custom Menu"
            },
            {
                id:0,
                route: '/deal-combo-listing',
                permission: PERMISSION_ENUM.ALLOWED,
                icon: null,
                title: "Deals & Combos"
            },
            {
                id: BACKEND_CONSTANTS.MODULES.MODIFIERS,
                route: '/modifiers',
                permission: PERMISSION_ENUM.NOT_ALLOWED,
                icon: SideModifierIcon,
                title: "Modifiers"
            },
            {
                id: BACKEND_CONSTANTS.MODULES.MODIFIERS,
                route: '/product-classes',
                permission: PERMISSION_ENUM.NOT_ALLOWED,
                icon: SideModifierIcon,
                title: "Product Classes"
            },
        ]
    },
    {
        id: 0,
        route: '/media',
        icon: galleryIcon,
        permission: PERMISSION_ENUM.ALLOWED,
        title: "Gallery",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.ORDER_MANAGEMENT,
        route: '/order-listings',
        icon: orderMIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Order Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.PAYMENT,
        route: '/transactions',
        icon: paymentIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Payments",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.PROMO,
        route: '/promo-listings',
        icon: promoIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Promo",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.TABLE,
        route: '/table-listings',
        icon: tableMIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Table Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.DISCOUNT,
        route: '/discounts',
        icon: discountIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Discounts",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.REPORTS,
        route: '/reports',
        icon: reportIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Reports",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.USER_MANAGEMENT,
        route: '/users',
        icon: userMIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "User Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.SETTINGS,
        route: '/settings',
        icon: settingIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Settings",
        childrens: []
    },

    {
        id: BACKEND_CONSTANTS.MODULES.ROLE_MANAGEMENT,
        route: '/roles',
        icon: roleMIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Role Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.ESTABLISHMENT_MANAGEMENT,
        route: '/establishments',
        icon: restaurantMIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Establishment Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.ESTABLISHMENT_MANAGEMENT,
        route: '/pos-devices',
        icon: cmsIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "POS Devices",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.PRINTER,
        route: '/printers',
        icon: printerIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Printer",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.RESTAURANT_MANAGEMENT,
        route: '/restaurants',
        icon: menuIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Restaurant Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.ADMIN_MANAGEMENT,
        route: '/admins',
        icon: SideUserMIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Admin Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.CUSTOMER_MANAGEMENT,
        route: '/customer-management-listing',
        icon: cmsIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Customer Management",
        childrens: []
    },
    {
        id: 0,
        route: '/cms',
        icon: cmsIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "CMS",
        childrens: [],
        isAdminRequired: PERMISSION_ENUM.ALLOWED,
    },
    {
        id: 0,
        route: '/push-notifications',
        icon: SidePromoIcon,
        permission: PERMISSION_ENUM.NOT_ALLOWED,
        title: "Push Messages",
        childrens: [],
        isAdminRequired: PERMISSION_ENUM.ALLOWED,
    }
];

export const SuperAdminSidebarContent = [
    {
        id: BACKEND_CONSTANTS.MODULES.RESTAURANT_MANAGEMENT,
        route: '/restaurants',
        icon: menuIcon,
        permission: PERMISSION_ENUM.ALLOWED,
        title: "Restaurant Management",
        childrens: []
    },
    {
        id: BACKEND_CONSTANTS.MODULES.ADMIN_MANAGEMENT,
        route: '/admins',
        icon: SideUserMIcon,
        permission: PERMISSION_ENUM.ALLOWED,
        title: "Admin Management",
        childrens: []
    }
]