import React, {useEffect, useState} from "react";
import "../../../../assets/css/views/dashboard/order-detail.scss";
import ViewCard from "../../../components/dashboard/ViewCard";
import {Col, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {IOrderItemList, IOrderList} from "../../../interfaces/IOrder";
import {OrderServices} from "../../../services/api-services/order.service";
import {BACKEND_CONSTANTS, GENERIC} from "../../../config/constants";
import OrderDetailSkeleton from "../../../skeletons/order-management/OrderDetailSkeleton";

export default function OrderDetail() {
    const [singleOrder, setSingleOrder] = useState<IOrderList>();
    const [orderItems, setOrderItems] = useState<IOrderItemList[]>();
    const [loading, setLoading] = useState<boolean>(false)
    const {id} = useParams<any>()

    const getSingleOrder = async () => {
        setLoading(true)
        const res = await OrderServices.getById(id)
        if(res.status){
            setSingleOrder(res.data)
        }
        setLoading(false)
    }
    const getSingleOrderItems = async () => {
        setLoading(true)
        const res = await OrderServices.getOrderItems(id)
        if(res.status){
            setOrderItems(res.data)
        }
        setLoading(false)
    }
    useEffect(()=> {
        getSingleOrder()
        getSingleOrderItems()
    },[])
    return(
        <>
            <ViewCard>
                {!loading ?
                    <div className={"order-detail"}>
                        {/*<Row>*/}
                        {/*    <Col md={12}>*/}
                        {/*        <div className={"order-detail-header"}>*/}
                        {/*            <div className={"user-detail-box"}>*/}
                        {/*                <span> <FiUser/> </span>*/}
                        {/*                <p> M.Martin</p>*/}

                        {/*            </div>*/}
                        {/*            <div className={"user-detail-box"}>*/}
                        {/*                <span> <VscDeviceMobile/> </span>*/}
                        {/*                <p> +1 123 456 78</p>*/}
                        {/*            </div>*/}
                        {/*            <div className={"user-detail-box"}>*/}
                        {/*                <span><BsEnvelope/></span>*/}
                        {/*                <p> m.martin@gmail.com</p>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </Col>*/}
                        {/*/!*</Row>*!/*/}
                        {/*<hr/>*/}
                        <Row>
                            <Col md={12}>
                                <div className={"order-status"}>
                                    <h2>Order Detail</h2>
                                    <ul>
                                        <li>
                                            <span>Order Status</span>
                                            <p>{singleOrder?.status_text}</p>
                                        </li>
                                        <li>
                                            <span>Order Type</span>
                                            <p>{singleOrder?.type_text}</p>
                                        </li>
                                        <li>
                                            <span>ID</span>
                                            <p>{singleOrder?.id}</p>
                                        </li>
                                        <li>
                                            <span>Time & Date</span>
                                            <p>{singleOrder?.created_ago}</p>
                                        </li>
                                        <li>
                                            <span>Order Taker</span>
                                            {singleOrder?.order_taker && <p>{singleOrder?.order_taker.full_name || '-'}</p>}
                                        </li>
                                        <li>
                                            <span>Transactions</span>
                                            <p><Link to={`/order-transactions/${singleOrder?.id}`}>View All</Link></p>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col md={12}>
                                <div className={""}>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col" style={{width:'50%'}}>Special Instruction</th>
                                            <th scope="col">QTY</th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orderItems && orderItems.map((item) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td>{item.product.name}</td>
                                                    <td>{item.instruction}</td>
                                                    <td>{item.purchased_qty}</td>
                                                    <td>{GENERIC.currency}{ item.payable_price}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr className={"calculation"}>
                                            <td colSpan={2}></td>
                                            <td>
                                                <div className={"cal-title"}>Sub Total:</div>
                                            </td>
                                            <td>{GENERIC.currency}{singleOrder?.gross_amount}</td>
                                        </tr>
                                        <tr className={"calculation"}>
                                            <td colSpan={2}></td>
                                            <td><div className={"cal-title"}>Manual Discount:</div></td>
                                            <td>{GENERIC.currency}{singleOrder?.discount_type === BACKEND_CONSTANTS.ORDERS.ORDER_DISCOUNT_TYPE.DISCOUNT ? singleOrder?.total_discount : 0 }</td>
                                        </tr>

                                        <tr className={"calculation"}>
                                            <td colSpan={2}></td>
                                            <td> <div className={"cal-title"}>Service Charges:</div></td>
                                            <td>{GENERIC.currency}{singleOrder?.service_charges}</td>
                                        </tr>
                                        <tr className={"calculation"}>
                                            <td colSpan={2}></td>
                                            <td> <div className={"cal-title"}>Tip:</div></td>
                                            <td>{GENERIC.currency}{singleOrder?.tip || 0}</td>
                                        </tr>
                                        <tr className={"calculation"}>
                                            <td colSpan={2}></td>
                                            <td><div className={"cal-title"}>Delivery Charges:</div></td>
                                            <td>{GENERIC.currency}{singleOrder?.delivery_charges || 0}</td>
                                        </tr>
                                        <tr className={"calculation"}>
                                            <td colSpan={2}></td>
                                            <td> <div className={"cal-title"}>Promo Code Discount:</div></td>
                                            <td>{GENERIC.currency}{singleOrder?.discount_type === BACKEND_CONSTANTS.ORDERS.ORDER_DISCOUNT_TYPE.PROMO ? singleOrder?.total_discount : 0}</td>
                                        </tr>
                                        <tr className={"calculation"}>
                                            <td colSpan={2}></td>
                                            <td> <div className={"cal-title"}>Sales Tax:</div></td>
                                            <td>{GENERIC.currency}{singleOrder?.tax}</td>
                                        </tr>
                                        <tr className={"calculation total"}>
                                            <td colSpan={2}></td>
                                            <td> <div className={"cal-title"}>Total:</div></td>
                                            <td className={"total-count"}>{GENERIC.currency}{singleOrder?.net_amount}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </Col>
                        </Row>
                    </div>
                    :
                    <OrderDetailSkeleton/>
                }
            </ViewCard>
        </>
    )
}