import React, {useEffect, useState} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import TextInput from "../../../components/authentication/TextInput";
import "../../../../assets/css/views/dashboard/establishment.scss";
import ThemeBtn from "../../../components/authentication/ThemeBtn";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {maxLength, MaxLength, minLength, MinLength, Required} from "../../../utils/patterns";
import {ICreateEstablishment, ITimetable} from "../../../interfaces/IGetEstablishment";
import {EstablishmentServices} from "../../../services/api-services/establishment.services";
import {useNavigate, useParams} from "react-router-dom";
import TimeTable from "../../../components/dashboard/TimeTable";
import ViewCard from "../../../components/dashboard/ViewCard";
import PlacesAutocomplete, {geocodeByAddress, getLatLng, Suggestion} from "react-places-autocomplete";
import {BACKEND_CONSTANTS} from "../../../config/constants";
import {toast} from "react-toastify";

export default function EditRestaurants() {
    const [change,setChange] = useState<boolean>(false)
    const [loader,setLoader] = useState<boolean>(false)
    const [latitude, setLatitude] = useState<null|number>(null)
    const [longitude, setLongitude] = useState<null|number>(null)
    const [timeSchedule, setTimeSchedule] = useState<ITimetable[]>()

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
            setLatitude(result.data.latitude)
            setLongitude(result.data.longitude)
            methods.reset(result.data)
            setLoader(false);
            setTimeSchedule(result.data?.time_tables)
        }
    }

    useEffect(() => {
        getSingleEstablishment()
    },[change])

    const onSubmit = async (data:ICreateEstablishment)=>{
        if(latitude && longitude) {
            data.establishment_order_types = data.establishment_order_types.filter(type => type.order_type != null)
            data.establishment_online_order_types = data.establishment_online_order_types.filter(type => type.online_order_type != null)
            data.latitude = latitude
            data.longitude = longitude
            data.status = 10
            data.time_tables = data.time_tables.filter((timetable) => timetable.status === BACKEND_CONSTANTS.CUSTOM_MENU.TIMETABLE_STATUS.ACTIVE)
            const res = await EstablishmentServices.updateEstablishment(id, data)
            if (res.status) {
                toast.success(res.message)
                methods.reset();
                navigator('/establishments')
            }
        }else {
            toast.success("Invalid Coordinates")
        }
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
    return(
        <>
            <ViewCard>
                <div className={"establishment-section"}>
                    <FormProvider {...methods}>
                        <Form onSubmit={methods.handleSubmit(onSubmit)}>
                            <Row className={"h-100"}>
                                    <Col md={5}>
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
                                                <div className="errors">
                                                    {methods.formState.errors.address && (
                                                        <small className="field-success">{methods.formState.errors.address.message}</small>
                                                    ) }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={7}>
                                        <div className={"right-col"}>
                                            {timeSchedule && <TimeTable apiData={timeSchedule}/>}
                                        </div>
                                    </Col>
                                    <Col className={"mb-4"} md={12}>
                                        <div className={"estab-bts"}>
                                            <ThemeBtn size={"lg"} text={"Cancel"} type={"button"}/>
                                            <ThemeBtn size={"lg"} text={"Save"} type={"submit"}/>
                                        </div>
                                    </Col>
                                </Row>
                        </Form>
                    </FormProvider>
                </div>
            </ViewCard>
        </>
    );
}