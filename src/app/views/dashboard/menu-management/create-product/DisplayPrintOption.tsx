import React, {Dispatch, useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Controller, useFormContext} from "react-hook-form";
import {Required} from "../../../../utils/patterns";
import MultiSelectField from "../../../../components/dashboard/MultiSelectField";
import {IPrinterList} from "../../../../interfaces/IPrinter";
import {PrinterServices} from "../../../../services/api-services/printer.services";
import {IAPIResponse} from "../../../../interfaces/ICommon";
import {useUserContext} from "../../../../providers/UserProvider";

export default function DisplayPrintOption({setIsValid}:{setIsValid:Dispatch<boolean>}) {
    const { control, reset, formState: { errors, isValid , isSubmitting}, setError, clearErrors, setValue } = useFormContext();
    const [printers , setPrinters] = useState<IPrinterList[]>([])

    const {establishmentId} = useUserContext()
    useEffect(()=>{
        /*Fetch All Printers*/
        PrinterServices.all({establishment_id:establishmentId}).then((res:IAPIResponse<IPrinterList[]>)=>{
            setPrinters(res.data)
        })
    },[establishmentId])

    useEffect(() => {
        const errorsArray = Object.keys(errors)
        const fields = ['product_printers']
        for (const field of fields){
            if(errorsArray?.includes(field)){
                setIsValid(false)
                break
            }else{
                setIsValid(true)
            }
        }
    },[isSubmitting]);
    return(
        <>
            <div className={"display-print-options"}>
                <Row>
                        <Col md={6}>
                            <div className={"dfields menu-manage-fields"}>
                                <Controller
                                    name="product_printers"
                                    control={control}
                                    rules = {{required : Required}}
                                    render={({ field:{name,...field} }) => {
                                        return (
                                            <MultiSelectField
                                                label={"Select Printers"}
                                                errors={errors.product_printers}
                                                field = {field}
                                                selectOptions={printers}
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
            </div>
        </>
    )
}