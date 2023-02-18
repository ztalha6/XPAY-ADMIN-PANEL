import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import TextInput from "../../../components/authentication/TextInput";
import "../../../../assets/css/views/dashboard/establishment.scss";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {maxLength, MaxLength, minLength, MinLength, Required} from "../../../utils/patterns";
import {ICreateEstablishment, IGetEstablishment, ITimetable} from "../../../interfaces/IGetEstablishment";
import {EstablishmentServices} from "../../../services/api-services/establishment.services";
import {useNavigate, useParams} from "react-router-dom";
import TimeTable from "../../../components/dashboard/TimeTable";
import ViewCard from "../../../components/dashboard/ViewCard";
import DashCheckboxWithValue from "../../../components/dashboard/DashCheckboxWithValue";
import {onlineOrderTypes, orderTypes} from "./CreateEstablishment";
import PlacesAutocomplete, {geocodeByAddress, getLatLng, Suggestion} from "react-places-autocomplete";
import {BACKEND_CONSTANTS} from "../../../config/constants";
import {toast} from "react-toastify";
import axios from "axios";
import moment from "moment";
import ThemeButton from "../../../components/dashboard/ThemeButton";
import {useUserContext} from "../../../providers/UserProvider";
import EditEstablishmentSkeleton from "../../../skeletons/establishment/EditEstablishmentSkeleton";

export default function EditEstablishment() {
    const [change,setChange] = useState<boolean>(false)
    const [loader,setLoader] = useState<boolean>(false)
    const [submitLoader, setSubmitLoader] = useState<boolean>(false)
    const [latitude, setLatitude] = useState<null|number>(null)
    const [longitude, setLongitude] = useState<null|number>(null)
    const [timeSchedule, setTimeSchedule] = useState<ITimetable[]>()
    const [singleEstablishment, setSingleEstablishment] = useState<IGetEstablishment>()
    const {setTitle, user} = useUserContext()
    useEffect(()=>{
        setTitle("Edit Establishment")
    },[])

    const {id} = useParams<any>()

    const navigator = useNavigate()
    const methods = useForm<ICreateEstablishment>({
        shouldUnregister: false,
        mode: "onChange",
    });

    const getSingleEstablishment = async () => {
        setLoader(true)
        const result = await EstablishmentServices.getById(id)
        if(result.status) {

            const updatedTimeTable = Array(7).fill({
                start_time:"",
                end_time:""
            }).map((item, index) => {
                let matchValue = result.data.time_tables.find(item => item.day_id === index+1);
                if(matchValue)
                    return matchValue
                else
                    return item;
            })

            const updateData:ICreateEstablishment = {
                ...result.data,
                time_tables: updatedTimeTable,
                establishment_order_types : orderTypes.map((orderType)=>(
                    { order_type: result.data.establishment_order_types.find(singleOrderType=> singleOrderType.order_type === orderType.id)?.order_type })),
                establishment_online_order_types : onlineOrderTypes.map((orderType)=>(
                    { online_order_type: result.data.establishment_online_order_types.find(singleOnlineOrderType=> singleOnlineOrderType.online_order_type === orderType.id)?.online_order_type })),
            }

            methods.reset(updateData)
            setLatitude(result.data.latitude)
            setLongitude(result.data.longitude)
            setLoader(false);
            setTimeSchedule(result.data?.time_tables)
            setSingleEstablishment(result.data)
        }
    }

    useEffect(() => {
        getSingleEstablishment()
    },[])

    const onSubmit = async (data:ICreateEstablishment)=>{
        setSubmitLoader(true)
        if(latitude && longitude) {
            data.establishment_order_types = data.establishment_order_types.filter(type => type.order_type)
            data.establishment_online_order_types = data.establishment_online_order_types.filter(type => type.online_order_type)
            data.latitude = latitude
            data.longitude = longitude
            data.status = 10
            data.time_tables = data.time_tables.filter((timetable) => timetable.status === BACKEND_CONSTANTS.CUSTOM_MENU.TIMETABLE_STATUS.ACTIVE)
            /*Get and set the timezone*/
            const timezone = await axios({
                url: `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=${moment().date()}&key=${process.env.REACT_APP_GOOGLE_LOCATION_API_KEY}`
            })
            if(!timezone?.data?.timeZoneId){
                toast.error("Unable to get the timezone, try some other location")
                return
            }
            data.timezone = timezone.data.timeZoneId

            const res = await EstablishmentServices.updateEstablishment(id, data)
            if (res.status) {
                toast.success(res.message)
                methods.reset();
                navigator('/establishments')
            }
        }else {
            toast.success("Invalid Coordinates")
        }
        setSubmitLoader(false)
    }
    const handleChange = (address:string) => {
        // setAddress(address);
        methods.setValue('address', address)
    };

    const handleSelect = (address:string) => {
        geocodeByAddress(address)
            .then((results:google.maps.GeocoderResult[]) => {
                // setAddress(results[0].formatted_address)
                methods.setValue('address', address)
                // setCity(results[0].address_components[3]?.short_name)
                // setState(results[0].address_components[6]?.short_name)
                return getLatLng(results[0])
            })
            .then((latLng:google.maps.LatLngLiteral) => {
                setLatitude(latLng.lat)
                setLongitude(latLng.lng)
            })
            .catch((error:any) => console.error('Error', error));
    };
    const updatedOrderTypes = methods.watch("establishment_order_types") || [];
    const updatedOnlinedOrderTypes = methods.watch("establishment_online_order_types") || [];

    const handleOnlineAutoCheck = (name:any, value:number|null) => {
        const onlineTypeIndex = orderTypes.findIndex((orderType)=> orderType.id === BACKEND_CONSTANTS.ORDERS.TYPES.ONLINE);
        const pickupTypeIndex = onlineOrderTypes.findIndex((orderType)=> orderType.id === BACKEND_CONSTANTS.ORDERS.ONLINE_ORDER_TYPE.PICKUP);
        const deliveryTypeIndex = onlineOrderTypes.findIndex((orderType)=> orderType.id === BACKEND_CONSTANTS.ORDERS.ONLINE_ORDER_TYPE.DELIVERY);
        let selectedOrderTypeOnline = updatedOrderTypes[onlineTypeIndex]?.order_type;
        let selectedOnlineOrderTypePickup = updatedOnlinedOrderTypes[pickupTypeIndex]?.online_order_type;
        let selectedOnlineOrderTypeDelivery = updatedOnlinedOrderTypes[deliveryTypeIndex]?.online_order_type;

        if(name === `establishment_order_types.${onlineTypeIndex}.order_type`){
            if(value){
                if(!selectedOnlineOrderTypePickup && !selectedOnlineOrderTypeDelivery){
                    methods.setValue(`establishment_online_order_types.${pickupTypeIndex}.online_order_type`, onlineOrderTypes[pickupTypeIndex].id);
                    methods.setValue(`establishment_online_order_types.${deliveryTypeIndex}.online_order_type`, onlineOrderTypes[deliveryTypeIndex].id);
                }
            }
            else{
                methods.setValue(`establishment_online_order_types.${pickupTypeIndex}.online_order_type`, undefined);
                methods.setValue(`establishment_online_order_types.${deliveryTypeIndex}.online_order_type`, undefined)
            }
        }
        else if(name === `establishment_online_order_types.${pickupTypeIndex}.online_order_type`){
            if(!value && !selectedOnlineOrderTypeDelivery && selectedOrderTypeOnline){
                methods.setValue(`establishment_order_types.${onlineTypeIndex}.order_type`, undefined);
            }
            else if(value && !selectedOnlineOrderTypeDelivery && !selectedOrderTypeOnline){
                methods.setValue(`establishment_order_types.${onlineTypeIndex}.order_type`, orderTypes[onlineTypeIndex].id);
            }
        }
        else if(name === `establishment_online_order_types.${deliveryTypeIndex}.online_order_type`){
            if(!value && !selectedOnlineOrderTypePickup && selectedOrderTypeOnline){
                methods.setValue(`establishment_order_types.${onlineTypeIndex}.order_type`, undefined);
            }
            else if(value && !selectedOnlineOrderTypePickup && !selectedOrderTypeOnline){
                methods.setValue(`establishment_order_types.${onlineTypeIndex}.order_type`, orderTypes[onlineTypeIndex].id);
            }
        }
    }

    const handleChangeCheckBox = (name:any, value:number|null) => {
        handleOnlineAutoCheck(name, value);
        methods.setValue(name, value);
    }

    return(
        <>
            <ViewCard>
                {!loader ?
                    <div className={"establishment-section"}>
                        <FormProvider {...methods}>
                            <Form onSubmit={methods.handleSubmit(onSubmit)}>
                                <Row className={"h-100"}>
                                    <Col sm={12} md={6} lg={5}>
                                        <div className={"lef-col"}>
                                            <h2 className={"dash-heading"}>Establishment</h2>
                                            <div className={"dfields establishment-fields"}>
                                                <input type="hidden" value={20.34334} {...methods.register("latitude")}/>
                                                <input type="hidden" value={10.34234} {...methods.register("longitude")}/>
                                                <Controller
                                                    name="name"
                                                    defaultValue={""}
                                                    control={methods.control}
                                                    rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                    render={({ field }) => (
                                                        <TextInput

                                                            placeholder={""}
                                                            variant={"field-white"}
                                                            label={"Establishment Name"}
                                                            labelPos={"out"}
                                                            labelColor={"dark"}
                                                            type={"text"}
                                                            field={field}
                                                            errors ={methods.formState.errors.name}
                                                            loader ={loader}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className={"dfields establishment-fields"}>
                                                <Controller
                                                    name="pos_devices"
                                                    defaultValue={0}
                                                    control={methods.control}
                                                    rules = {{required : Required, maxLength:maxLength(50)}}
                                                    render={({ field }) => (
                                                        <TextInput
                                                            placeholder={""}
                                                            variant={"field-white"}
                                                            label={"POS Devices"}
                                                            labelPos={"out"}
                                                            labelColor={"dark"}
                                                            type={"text"}
                                                            field={field}
                                                            errors ={methods.formState.errors.pos_devices}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className={"dfields establishment-fields"}>
                                                <div className={"location-field"}>
                                                    <Controller
                                                        name="address"
                                                        defaultValue={""}
                                                        control={methods.control}
                                                        rules = {{required : Required, minLength:MinLength, maxLength:MaxLength}}
                                                        render={({ field }) => (
                                                            <>
                                                                <Form.Label className={"label-light"}>
                                                                    Address
                                                                </Form.Label>
                                                                <PlacesAutocomplete
                                                                    value={field.value}
                                                                    onChange={handleChange}
                                                                    onSelect={handleSelect}
                                                                >
                                                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                                        <div className={"form-group"} >
                                                                            <input
                                                                                {...getInputProps({
                                                                                    placeholder: 'Search Places ...',
                                                                                    className: 'form-control location-search-input',
                                                                                })}

                                                                            />

                                                                            <div className="autocomplete-dropdown-container">
                                                                                {loading && <div>Loading...</div>}

                                                                                {suggestions.map((suggestion:Suggestion) => {
                                                                                    const className = suggestion.active
                                                                                        ? 'suggestion-item--active'
                                                                                        : 'suggestion-item';
                                                                                    // inline style for demonstration purpose
                                                                                    const style = suggestion.active
                                                                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                                    return (
                                                                                        <div
                                                                                            {...getSuggestionItemProps(suggestion, {
                                                                                                className,
                                                                                                style,
                                                                                            })}
                                                                                        >
                                                                                            <span className={"serach-data"}>{suggestion.description}</span>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </PlacesAutocomplete>
                                                            </>
                                                        )}
                                                    />
                                                </div>
                                                <div className="errors">
                                                    {methods.formState.errors.address && (
                                                        <small className="field-success">{methods.formState.errors.address.message}</small>
                                                    ) }
                                                </div>
                                            </div>
                                            <div className={"dfields establishment-fields"}>
                                                <div className={"delivery_type"}>
                                                    <Row>
                                                        <Col>
                                                            <div className={"ordertype-box"}>
                                                                <h5>Order Type</h5>
                                                                <ul>
                                                                    {
                                                                        orderTypes.map((orderType,index)=>{
                                                                            return (
                                                                                <li>
                                                                                    <div className={"dfields discount-fields"}>
                                                                                        <Controller
                                                                                            name={`establishment_order_types.${index}.order_type`}
                                                                                            // defaultValue={orderType.id}
                                                                                            control={methods.control}
                                                                                            render={({ field:{name,value} }) => {
                                                                                                return(
                                                                                                    <DashCheckboxWithValue
                                                                                                        checkedInput={!!updatedOrderTypes[index]?.order_type}
                                                                                                        setValue={handleChangeCheckBox}
                                                                                                        name={name}
                                                                                                        label={orderType.name}
                                                                                                        // disabled={}
                                                                                                        value={orderType.id}
                                                                                                        fieldValue={orderType.id}
                                                                                                    />
                                                                                                )}}
                                                                                        />
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className={"ordertype-box"}>
                                                                <h5>Delivery/pickup options</h5>
                                                                <ul>
                                                                    {
                                                                        onlineOrderTypes.map((onlineOrderType,index)=>{
                                                                            return (
                                                                                <li>
                                                                                    <div className={"dfields discount-fields"}>
                                                                                        <Controller
                                                                                            name={`establishment_online_order_types.${index}.online_order_type`}
                                                                                            control={methods.control}
                                                                                            render={({ field:{name,value} }) => (
                                                                                                <DashCheckboxWithValue
                                                                                                    checkedInput={!!updatedOnlinedOrderTypes[index]?.online_order_type}
                                                                                                    setValue={handleChangeCheckBox}
                                                                                                    name={name}
                                                                                                    label={onlineOrderType.name}
                                                                                                    // disabled={}
                                                                                                    value={onlineOrderType.id}
                                                                                                    fieldValue={onlineOrderType.id}
                                                                                                />
                                                                                            )}
                                                                                        />
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }


                                                                </ul>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} md={6} lg={7}>
                                        <div className={"right-col"}>
                                            {timeSchedule && <TimeTable apiData={timeSchedule}/>}
                                        </div>
                                    </Col>
                                    <Col className={"mb-4"} md={12}>
                                        <div className={"button-section"}>
                                            <ThemeButton onClick={()=>  navigator(-1)} type={"button"} className={"form-cancel"} text={"Cancel"}/>
                                            <ThemeButton loader={submitLoader} type={"submit"} className={"form-create"} text={"Save"}/>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </FormProvider>
                    </div>
                    :
                    <EditEstablishmentSkeleton/>
                }
            </ViewCard>
        </>
    );
}