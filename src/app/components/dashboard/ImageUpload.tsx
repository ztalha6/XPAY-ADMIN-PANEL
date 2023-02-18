import {Upload, UploadProps} from 'antd';
import type {RcFile, UploadFile} from 'antd/es/upload/interface';
import React, {useEffect, useState} from 'react';
import {UseFormGetValues, UseFormSetValue} from "react-hook-form/dist/types/form";
import AWS from "aws-sdk";
import {BACKEND_CONSTANTS} from "../../config/constants";
import ImgCrop from "antd-img-crop";
import {optionCSS} from "react-select/dist/declarations/src/components/Option";
import "../../../assets/css/components/image-upload.scss"
interface IUploadBox {
    maxCount:number
    setValue: UseFormSetValue<any>
    getValues?: UseFormGetValues<any>
    fieldName: string
    body?:any
    autoHideAfterUpload?: boolean
    aspect?:number
    disabled?:boolean
    value? : any
    label? : string
}
export default function ImageUpload({maxCount, setValue, fieldName, body, autoHideAfterUpload,aspect,disabled,value, getValues,label} : IUploadBox){
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [error, setError] = useState<string|null>(null)
    const onChange: UploadProps['onChange'] = async (info) => {
        setError(null)
        console.log(`info`,info)
        if(info.file.status === 'uploading'){
            setFileList(info.fileList);
        }

        if(info.file.status === 'done'){
            console.log("status done")
            setFileList(info.fileList);
            if(autoHideAfterUpload){
                setTimeout(function(){
                    setFileList(fileList.filter(file=>file.uid !== info.file.uid));
                },1000)
            }
        }


        if(info.file.status === 'removed'){
            setFileList([]);
            setValue(fieldName, [])
        }
    };

    const uploadFiles = async(options:any)=>{

        const {action,
            data,
            file,
            filename,
            headers,
            onError,
            onProgress,
            onSuccess,
            withCredentials} = options

        const newFileName = `${new Date().getTime()}${file.name}`;
        const fileSize = file.size;


        if (fileSize > parseInt(BACKEND_CONSTANTS.S3CREDENTIAL.fileSize, 10)) {
            setFileList([]);
            setError("File size exceeded!")
            return false
        }


        AWS.config.update({
            accessKeyId: BACKEND_CONSTANTS.S3CREDENTIAL.accessKeyId,
            secretAccessKey: BACKEND_CONSTANTS.S3CREDENTIAL.secretAccessKey
        });

        const S3 = new AWS.S3({region:'ap-south-1'});
        const objParams = {
            Bucket: BACKEND_CONSTANTS.S3CREDENTIAL.bucketName,
            Key: BACKEND_CONSTANTS.S3CREDENTIAL.dirName + "/" + newFileName,
            Body: file,
            ACL:'public-read',
            ContentType: file.type // TODO: You should set content-type because AWS SDK will not automatically set file MIME
        };

        S3.putObject(objParams)
            .on("httpUploadProgress", function({ loaded, total }: {loaded: any, total: any}) {
                onProgress(
                    {
                        percent: Math.round((loaded / total) * 100)
                    },
                    file
                );
            })
            .send(function(err:any, data:any) {
                if (err) {
                    onError();
                    console.log(err.code);
                    console.log(err.message);
                    setFileList([]);
                } else {
                    console.log("uploaded successfully")
                    onSuccess("Ok", file);
                    if(maxCount > 1 && Array.isArray(value) && getValues){
                        /*
                        * For multiple images - Has Many relationship
                        * */
                        setValue(fieldName, [
                            ...getValues(fieldName),
                            {
                                path: `${objParams.Key}`
                            }
                        ])
                    }else{
                        /*
                        * For single image - HasOne relationship
                        * */
                        setValue(fieldName, [
                            {
                                path: `${objParams.Key}`
                            }
                        ])
                    }
                    console.log(`File uploaded`, `${BACKEND_CONSTANTS.S3CREDENTIAL.s3EndPoint}/${objParams.Key}`)

                }
            })


    };


    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    useEffect(()=> {

        if(maxCount > 1 && Array.isArray(value)) {
            /*
            * For multiple images - Has Many relationship
            * */
            // debugger
            const fileListStructure:UploadFile[] = []
            for(let v of value){
                fileListStructure.push({
                    uid: `-${v.id}`,
                    name: '',
                    status: 'done',
                    url: v.mediaUrl,
                })
            }
            setFileList(fileListStructure)
        }else{
            /*
            * For single image - HasOne relationship
            * */
            if(typeof value === 'string'){
                setFileList([
                    {
                        uid: '-1',
                        name: '',
                        status: 'done',
                        url: value,
                    }
                ])
            }
        }


    },[value])

    return(
        <div className={"image-upload"}>
            {label &&  <label>{label ? label : 'Upload Image'}</label>}
            <ImgCrop rotate  aspect={aspect? aspect : 1/1}>
                <Upload
                    beforeUpload={()=>true}
                    accept="image/*"
                    customRequest={uploadFiles}
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    maxCount={maxCount}
                    multiple={false}
                    disabled={disabled}
                >
                    {body? body : (fileList.length < maxCount && '+ Upload')  }
                </Upload>
            </ImgCrop>
            <small className={"error-message"}>{error}</small>
        </div>
    );
}