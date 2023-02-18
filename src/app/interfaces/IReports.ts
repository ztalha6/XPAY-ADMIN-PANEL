import {IOrdersFilters} from "./IOrder";
import {IProductList} from "./IMenu";

export interface IReportsFilters extends IOrdersFilters{
    start_date?: string
    end_date?:string
}

export interface IItemSummaryReportsFilters {
    start_date?: string
    end_date?:string
    order_type: number[]
    date_range?:string[]
    establishment_id: number
}

export interface IItemSummaryReport {
    unit_price: number
    product_id: number
    product: IProductList
    meta : IItemSummaryReportMeta
}
interface IItemSummaryReportMeta {
    sold_qty : number
}

export interface IReportList {
    net_amount: IReportBody
    gross_amount: IReportBody
    service_charges: IReportBody
    tip: IReportBody
    promo_discount: IReportBody
    discount: IReportBody
    cash_amount_received: IReportBody
    cash_amount_returned: IReportBody
    card_amount_received: IReportBody
    card_amount_returned: IReportBody
    dinein_net_amount: IReportBody
    dinein_avg_amount: IReportBody
    dinein_check: IReportBody
    takeaway_net_amount: IReportBody
    takeaway_avg_amount: IReportBody
    takeaway_check: IReportBody
    delivery_net_amount: IReportBody
    delivery_avg_amount: IReportBody
    delivery_check: IReportBody
    online_net_amount: IReportBody
    online_avg_amount: IReportBody
    online_check: IReportBody
}

interface IReportBody{
    current: number
    past: number
    diff: string
}

export interface IDashboardAnalyticsParams {
    compare_to: number
    compare_from: number
    date: string
    establishment_id: number
}

export interface IDashboardAnalytics extends IReportList{
    net_amount: IReportBody
    android_platform_orders: IReportBody
    pos_platform_orders: IReportBody
    desktop_platform_orders: IReportBody
    ios_platform_orders: IReportBody
    dinein_result: ITimeGraph[]
    takeaway_result: ITimeGraph[]
    delivery_result: ITimeGraph[]
    online_result: ITimeGraph[]
    heat_map_result: IHeatMap[]
}

export interface IBarChartResult {
    x_label: number
    net_amount: number
    order_type: number
}

export interface IDashboardAnalyticsResponse extends IReportList{
    all_sales_net_amount: IReportBody
    android_platform_orders: IReportBody
    pos_platform_orders: IReportBody
    desktop_platform_orders: IReportBody
    ios_platform_orders: IReportBody
    bar_chart_result: IBarChartResult[]
    heat_map_result: IHeatMap[]
}

export interface IProductSaleBreakdown {
    product_id: number
    product: IProductList
    meta: {
        sale: number | null
    }
}



export interface ITimeGraph {
    x_label: number ,
    net_amount: number | null
}

export interface IHeatMap {
    lat: number
    lng: number
}