import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import TextInput from "../../../components/authentication/TextInput";
import "../../../../assets/css/views/dashboard/establishment.scss";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {maxLength, MaxLength, minLength, MinLength, Required} from "../../../utils/patterns";
import {ICreateEstablishment} from "../../../interfaces/IGetEstablishment";
import TimeTable from "../../../components/dashboard/TimeTable";
import {BACKEND_CONSTANTS} from "../../../config/constants";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import ViewCard from "../../../components/dashboard/ViewCard";
import DashCheckboxWithValue from "../../../components/dashboard/DashCheckboxWithValue";
import PlacesAutocomplete, {geocodeByAddress, getLatLng, Suggestion} from 'react-places-autocomplete';
import {useUserContext} from "../../../providers/UserProvider";
import ThemeButton from "../../../components/dashboard/ThemeButton";
import {EstablishmentServices} from "../../../services/api-services/establishment.services";
import axios from "axios";
import moment from "moment";

export const orderTypes = [
    {
        id: BACKEND_CONSTANTS.ORDERS.TYPES.TAKEAWAY,
        name: "Take away"
    },
    {
        id: BACKEND_CONSTANTS.ORDERS.TYPES.DINE,
        name: "Dine In"
    },
    {
        id: BACKEND_CONSTANTS.ORDERS.TYPES.DELIVERY,
        name: "Delivery"
    },
    {
        id: BACKEND_CONSTANTS.ORDERS.TYPES.ONLINE,
        name: "Online"
    },
]

export const onlineOrderTypes = [
    {
        id: BACKEND_CONSTANTS.ORDERS.ONLINE_ORDER_TYPE.PICKUP,
        name: "Pickup"
    },
    {
        id: BACKEND_CONSTANTS.ORDERS.ONLINE_ORDER_TYPE.DELIVERY,
        name: "Delivery"
    }
]

export default function CreateEstablishment() {
    const {setTitle, user} = useUserContext()
    useEffect(()=>{
        setTitle("Create Establishment")
    },[])
    const navigator = useNavigate()
    const [latitude, setLatitude] = useState<null|number>(null)
    const [longitude, setLongitude] = useState<null|number>(null)
    const [loader, setLoader] = useState<boolean>(false)
    const [submitLoader, setSubmitLoader] = useState<boolean>(false)
    const methods = useForm<ICreateEstablishment>({
        shouldUnregister: false,
        mode: "onChange",
    });

    const onSubmit = async (data:ICreateEstablishment)=>{
        setSubmitLoader(true)
        if(latitude && longitude) {
            data.establishment_order_types = data.establishment_order_types.filter(type=>type.order_type!=null)
            data.establishment_online_order_types = data.establishment_online_order_types.filter(type=>type.online_order_type!=null)
            data.latitude = latitude
            data.longitude = longitude
            data.status = 10
            data.time_tables = data.time_tables.filter((timetable)=>timetable.status === BACKEND_CONSTANTS.CUSTOM_MENU.TIMETABLE_STATUS.ACTIVE)

            /*Get and set the timezone*/
            const timezone = await axios({
                url: `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=${moment().date()}&key=${process.env.REACT_APP_GOOGLE_LOCATION_API_KEY}`
            })
            if(!timezone?.data?.timeZoneId){
                toast.error("Unable to get the timezone, try some other location")
                return
            }
            data.timezone = timezone?.data?.timeZoneId
            const res = await EstablishmentServices.store(data)

            if(res.status){
                setLongitude(null)
                setLatitude(null)
                toast.success(res.message)
                methods.reset();
                navigator('/establishments')
            }
        }else {
            toast.success("Invalid Coordinates")
            setLoader(false)
        }
        setSubmitLoader(false)
    }

    // const watchAppliesTo = methods.watch("online_order_types", undefined); // you can supply default value as second argument
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



    return(
        <ViewCard>
            <FormProvider {...methods}>
                <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className={"establishment-section"}>
                       <Row className={"h-100"}>
                            <Col sm={12} md={6} lg={5}>
                                <h2 className={"dash-heading"}>Establishment</h2>
                                <div className={"lef-col"}>
                                    <div className={"dfields establishment-fields"}>
                                        <input type="hidden" value={20.34334} {...methods.register("latitude")}/>
                                        <input type="hidden" value={10.34234} {...methods.register("longitude")}/>
                                    </div>
                                    <div className={"dfields establishment-fields"}>
                                        <Controller
                                            name="name"
                                            defaultValue={""}
                                            control={methods.control}
                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                            render={({ field }) => (
                                                <TextInput
                                                    placeholder={"Establishment Name"}
                                                    variant={"field-white"}
                                                    label={"Establishment Name"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"text"}
                                                    field={field}
                                                    errors ={methods.formState.errors.name}
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
                                                                            <div className={"dfields  establishment-fields"}>
                                                                                <Controller
                                                                                    name={`establishment_order_types.${index}.order_type`}
                                                                                    defaultValue={orderType.id}
                                                                                    control={methods.control}
                                                                                    render={({ field:{name,value} }) => (
                                                                                        <DashCheckboxWithValue
                                                                                            checkedInput={false}
                                                                                            setValue={methods.setValue}
                                                                                            name={name}
                                                                                            label={orderType.name}
                                                                                            // disabled={}
                                                                                            value={orderType.id}
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
                                                <Col>
                                                    <div className={"ordertype-box"}>
                                                        <h5>Delivery/pickup options</h5>
                                                        <ul>
                                                            {
                                                                onlineOrderTypes.map((onlineOrderType,index)=>{
                                                                    return (
                                                                        <li>
                                                                            <div className={"dfields  establishment-fields"}>
                                                                                <Controller
                                                                                    name={`establishment_online_order_types.${index}.online_order_type`}
                                                                                    control={methods.control}
                                                                                    render={({ field:{name,value} }) => (
                                                                                        <DashCheckboxWithValue
                                                                                            checkedInput={false}
                                                                                            setValue={methods.setValue}
                                                                                            name={name}
                                                                                            label={onlineOrderType.name}
                                                                                            // disabled={}
                                                                                            value={onlineOrderType.id}
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

                                    <div className={"button-section"}>
                                        <ThemeButton onClick={()=>  navigator(-1)} type={"button"} className={"form-cancel"} text={"Cancel"}/>
                                        <ThemeButton loader={submitLoader} type={"submit"} className={"form-create"} text={"Create"}/>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={12} md={6} lg={7}>
                                <div className={"right-col"}>
                                    <TimeTable/>
                                </div>
                            </Col>
                            </Row>
                    </div>

                </Form>
            </FormProvider>
        </ViewCard>


    );
}