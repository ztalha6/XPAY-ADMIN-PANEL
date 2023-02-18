import React, {useEffect, useState} from "react";
import ViewCard from "../../../components/dashboard/ViewCard";
import {Col, Row} from "react-bootstrap";
import {BiUser} from "react-icons/bi";
import {BsEnvelope, BsPhone} from "react-icons/bs";
import "../../../../assets/css/views/dashboard/customer-detail.scss"
import {Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {useUserContext} from "../../../providers/UserProvider";
import {CustomerServices} from "../../../services/api-services/customer-listing-service";
import {useParams} from "react-router-dom";
import {ICustomerListing, ICustomerOrderItemListing} from "../../../interfaces/ICustomerManagement";
import {IOrderList} from "../../../interfaces/IOrder";
import moment from "moment";
import {TablePaginationConfig} from "antd/lib/table";
import {PAGINATION} from "../../../config/constants";
import {IDatatableParams} from "../../../interfaces/IDatatable";
import {FilterValue, SorterResult} from "antd/lib/table/interface";
import CustomerDetailSkeleton from "../../../skeletons/customer-management/CustomerDetailSkeleton";
import Heading from "../../../components/dashboard/Heading";

interface OrderDetailsTable {
    key: string;
    category: string;
    products: string[];
    quantity: number;
    total: number;
}

const recentOrdersTable: ColumnsType<IOrderList> = [
    {
        title: 'Order Date & Time',
        dataIndex: 'created_at',
        render: (created_at) => <a>{moment(created_at).format("MM/DD/YYYY")}</a>,
    },
    {
        title: 'Tip',
        dataIndex: 'tip',
        render: (tip) => `$${tip || 0}`
    },
    {
        title: 'Bill',
        dataIndex: 'net_amount',
        render: (net_amount) => `$${net_amount}`
    },
    {
        title: 'Platform',
        dataIndex: 'platform',
        render: (platform, row) => (
            <Tag color={platform === 'online' ? 'volcano' : 'geekblue'} >
                {platform.toUpperCase()}
            </Tag>
        ),
    },
];


const OrderDetails: ColumnsType<ICustomerOrderItemListing> = [
    {
        title: 'Category',
        dataIndex: 'category_name'
    },

    {
        title: 'Products',
        dataIndex: 'name'
    },
    {
        title: 'Quantity',
        dataIndex: 'total_purchase_qty'
    },
    {
        title: 'Total',
        dataIndex: 'total_payable_price',
    },
];

const OrderDetailData: OrderDetailsTable[] = [
    {
        key: '1',
        category: 'Fast Food',
        products: ['Cheese Roll' , 'Burger'],
        quantity: 5,
        total: 120,
    },
    {
        key: '2',
        category: 'Fast Food',
        products: ['Cheese Roll' , 'Burger'],
        quantity: 5,
        total: 120,
    },
    {
        key: '3',
        category: 'Fast Food',
        products: ['Cheese Roll' , 'Burger'],
        quantity: 5,
        total: 120,
    },
];


export default function CustomerDetails() {

    const {setTitle, establishmentId} = useUserContext()
    useEffect(()=>{
        setTitle("Customer Details")
    })

    const [customer, setCustomer] = useState<ICustomerListing>()
    const [customerOrderItems, setCustomerOrderItems] = useState<ICustomerOrderItemListing[]>([])
    const [customerOrders, setCustomerOrders] = useState<IOrderList[]>([])
    const [recentOrders, setRecentOrders] = useState<IOrderList[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const {id} = useParams()
    const [orderItemPagination, setOrderItemPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: PAGINATION.perPage,
        showSizeChanger:true,
        defaultPageSize: PAGINATION.perPage
    });
    const [orderPagination, setOrderPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: PAGINATION.perPage,
        showSizeChanger:true,
        defaultPageSize: PAGINATION.perPage
    });

    /*
    * Fetch data from the api
    * */
    const fetchData = ()=>{

        CustomerServices.getById(id).then((res)=>{
            setCustomer(res.data)
            fetchOrderItems(res.data.ref_id,res.data.type,{ pagination : orderItemPagination });
            fetchCustomerOrders(res.data.ref_id,res.data.type,{ pagination : orderPagination });
            setLoader(false)
        })
    }

    const fetchOrderItems = async (customerId:number,type:number,params: IDatatableParams = {}) => {
        const res = await CustomerServices.getCustomerOrderItems({customer_id:customerId,type:type},params.pagination?.pageSize, params.pagination?.current)
        if(res.status){
            setCustomerOrderItems(res.data.data)
            setOrderItemPagination({
                ...params.pagination,
                total: res.data.meta.total,
            });
        }

    };

    const fetchCustomerOrders = async (customerId:number,type:number,params: IDatatableParams = {}) => {
        const res = await CustomerServices.getCustomerOrders({customer_id:customerId,type:type},params.pagination?.pageSize, params.pagination?.current)
        if(res.status){
            setCustomerOrders(res.data.data)
            setOrderItemPagination({
                ...params.pagination,
                total: res.data.meta.total,
            });
        }

    };

    const handleTableChange:any = (
        newPagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<ICustomerListing>,
    ) => {
        customer?.ref_id && fetchOrderItems(customer.ref_id,customer.type,{
            sortField: sorter.field as string,
            sortOrder: sorter.order as string,
            pagination: newPagination,
            ...filters,
        });
    };

    const handleOrderTableChange:any = (
        newPagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<IOrderList>,
    ) => {
        customer?.ref_id && fetchCustomerOrders(customer.ref_id,customer.type,{
            sortField: sorter.field as string,
            sortOrder: sorter.order as string,
            pagination: newPagination,
            ...filters,
        });
    };

    useEffect(()=>{
        fetchData()
    },[])


    return(
        <ViewCard>
            {!loader ?
                <div className={"customer-detail"}>
                    <Row>
                        <Col md={12}>
                            <Heading><h2><span>Customer Detail</span></h2></Heading>
                            <div className={"user-detail"}>
                                <ul>
                                    <li><BiUser/>{customer?.full_name || '-'}</li>
                                    <li><BsPhone/>{customer?.phone || '-'}</li>
                                    <li><BsEnvelope/> {customer?.email || '-'} </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <h2 className={"dash-heading"}>Order Details</h2>
                            <ul className={"cd-detail"}>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Last order</h3>
                                        <p>{customer?.meta.last_order || '-'}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Total Orders Placed</h3>
                                        <p>{customer?.meta.order_count || 0}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Total Amount Spent</h3>
                                        <p>${customer?.meta.total_amount_spent || 0}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Avg Amount Spent</h3>
                                        <p>${customer?.meta.average_amount_spent || 0}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Avg Tip Spent</h3>
                                        <p>${customer?.meta.average_tip_spent}</p>
                                    </div>
                                </li>
                            </ul>
                        </Col>
                        <Col md={12}>
                            <Heading><h2><span>Orders via Platform</span></h2></Heading>
                            <ul className={"cd-detail"}>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Mobile App</h3>
                                        <p>3 days ago</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Website</h3>
                                        <p>06</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={"rd-box"}>
                                        <h3>Delivery</h3>
                                        <p>$350.00</p>
                                    </div>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} xl={6}>
                            <Heading><h2><span>Activity</span></h2></Heading>
                            <Table
                                columns={recentOrdersTable}
                                dataSource={customerOrders}
                                pagination={orderPagination}
                                onChange={handleOrderTableChange}
                                scroll={{ x: 'calc(600px + 50%)'}}
                            />
                        </Col>
                        <Col lg={12} xl={6}>
                            <Heading><h2><span>Order Details</span></h2></Heading>
                            <Table
                                columns={OrderDetails}
                                dataSource={customerOrderItems}
                                pagination={orderItemPagination}
                                onChange={handleTableChange}
                                scroll={{ x: 'calc(600px + 50%)'}}
                            />
                        </Col>
                    </Row>
                </div>
                :
                <CustomerDetailSkeleton/>
                 }

        </ViewCard>
    )
}