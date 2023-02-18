import {IOrderList} from "./IOrder";

export interface ICustomerManagementFilter {
    start_date?: string
    end_date?:string
    order_type?: number[]
    date_range?:string[]
    establishment_id: number
    min_order_amount?:number
    max_order_amount?:number
    min_order_count?:number
    max_order_count?:number
}


export interface ICustomerListing{
    id: number
    ref_id:  number
    type:  number
    full_name: string
    email:string
    phone: string
    created_at:string
    updated_at: string
    deleted_at: null
    created_ago: string
    type_text: string
    meta:ICustomerMeta
}

export interface ICustomerOrderItemListing{
    product_id: number
    name: string
    category_id: number
    category_name: string
    total_payable_price: number
    total_purchase_qty: number
}

interface ICustomerMeta{
    user_orders_count: number
    delivery_user_orders_count: number
    last_order: string,
    order_count: number,
    total_amount_spent: number,
    average_amount_spent: number,
    average_tip_spent: number,
    orders: IOrderList[]
}

export interface IPushNotifications{
    title:string
    message:string
    image:string
    images : {
        path:string
    }[]
    date_range?:string[]
    min_order_amount?:number
    max_order_amount?:number
    min_order_count?:number
    max_order_count?:number
}

export interface IEmailMarketing{
    title:string
    description:string
    notification_image:string
    platform:number
    users: number[] //to hold temporary data
    include_exclude: number //to hold temporary data
    applies_to:number
    type: number
    address: string,
    latitude: number,
    longitude: number,
    reply_email:string
    res_website_url:number
}

