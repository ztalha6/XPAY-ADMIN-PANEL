import {IListGeneric} from "./ICommon";
import {IProductList} from "./IMenu";
import {ITransactionListing} from "./ITransactions";

export interface IOrdersFilters {
    order_id?: number
    date_range?:string[]
    status?:number[]
    platform?:string[]
    payment_type?: number[]
    order_type?: number
    establishment_id: number
}

export interface IOrderList extends IListGeneric {
    user_id: null | number,
    table_id: null | number,
    employee_id: null | number,
    establishment_id: number,
    user_address_id: null | number,
    type: number,
    delivery_customer_id: null | number,
    rider_id: null | number,
    payment_status: number,
    payment_type: number,
    promo_code_id: null | number,
    discount_id: null | number,
    type_text: string,
    payment_status_text: string,
    platform: string,
    order_taker: {
        full_name: string
        id: number
        meta:any
    } | null,
    delivery_customer: {
        name: string
        id: number
        meta:any
    } | null,
    mobile_customer: {
        full_name: string
        id: number
        meta:any
    } | null,
    order_items: IOrderItemList[],
    summary: {
        netAmount: number,
        serviceCharges: number,
        discount: number
        grossAmount: number
    }
    transactions: ITransactionListing[]
    discount_type: number|null
    tip: number
    gross_amount: number
    total_discount: number
    service_charges: number
    total_guests: number
    promo_code: string
    cart_id:number
    net_amount: number
    table: {
        table_number: number
        id: number
        is_reserved: boolean
    } | null
}

export interface IOrderItemList extends IListGeneric {
    product_id: number,
    order_id: number,
    payable_price: number,
    purchased_qty : number,
    instruction: null | string,
    product : IProductList
}
