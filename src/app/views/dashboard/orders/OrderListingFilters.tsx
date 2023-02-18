import React from "react"
import {Col, Row} from "react-bootstrap";
import {Controller, useFormContext} from "react-hook-form";
import TextInput from "../../../components/authentication/TextInput";
import DateRange from "../../../components/dashboard/DateRange";
import MultiSelectField from "../../../components/dashboard/MultiSelectField";
import {TbLayoutDashboard} from "react-icons/tb";
import {RiComputerLine} from "react-icons/ri";
import ThemeButton from "../../../components/dashboard/ThemeButton";
import {IOrdersFilters} from "../../../interfaces/IOrder";
import {BACKEND_CONSTANTS} from "../../../config/constants";


export default function OrderListingFilters({ loading, refreshLoading, handleRefresh}:
                                                {loading?: boolean, refreshLoading?: boolean, handleRefresh:()=>void}) {

    const {
        control,
        setValue,
        register,
        reset,
        formState: { errors } } = useFormContext<IOrdersFilters>();

    const orderStatus = [
        {
            id: BACKEND_CONSTANTS.ORDERS.STATUS.ORDERED,
            name:'Ordered'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.STATUS.HOLD,
            name:'Hold'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.STATUS.KITCHEN,
            name:'Kitchen'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.STATUS.DISPATCH,
            name:'Dispatch'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.STATUS.DELIVERED,
            name:'Delivered'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.STATUS.CANCELLED,
            name:'Cancelled'
        }
    ]
    const orderPlatforms = [
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.IOS,
            name:'iOS'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.ANDROID,
            name:'Android'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.WEB,
            name:'Web'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.POS,
            name:'POS'
        }
    ]

    return(
        <>
            <div className={"filter-sec"}>
                <Row>
                    <Col md={3} lg={2}>
                        <div className={"filter-fields"}>
                            <Controller
                                name="order_id"
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        placeholder={"Order Id"}
                                        variant={"field-white"}
                                        labelPos={"none"}
                                        labelColor={"dark"}
                                        type={"number"}
                                        field={field}
                                        errors ={errors.order_id}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md={3} lg={2}>
                        <div className={"filter-fields"}>
                            <Controller
                                name="date_range"
                                control={control}
                                render={({ field:{name} }) => (
                                    <DateRange
                                        setValue={setValue}
                                        fieldName={name}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md={3} lg={2}>
                        <div className={"filter-fields"}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelectField
                                        errors={errors.status}
                                        field = {field}
                                        selectOptions={orderStatus}
                                        maxTagCount={1}
                                        placeholder={'Select Status'}
                                        prefixIcon={<TbLayoutDashboard/>}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md={3} lg={2}>
                        <div className={"filter-fields"}>
                            <Controller
                                name="platform"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelectField
                                        errors={errors.platform}
                                        field = {field}
                                        selectOptions={orderPlatforms}
                                        maxTagCount={1}
                                        placeholder={'Select Platform'}
                                        prefixIcon={<RiComputerLine/>}
                                    />
                                )}
                            />
                        </div>

                    </Col>
                    <Col className={"gap-2 d-flex align-items-end"} md={3} lg={2}>
                        <ThemeButton className={"filter-btn"} text={"Filter"} type={"submit"} loader={loading}/>
                        <ThemeButton className={"filter-btn"} text={"refresh"}
                                     type="button"
                                     loader={refreshLoading} onClick={()=>{
                                         handleRefresh()
                        }}/>
                    </Col>
                </Row>
            </div>
        </>
    )
}