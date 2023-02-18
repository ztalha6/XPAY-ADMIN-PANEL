import React, {useEffect, useState} from "react";
import ViewCard from "../../../components/dashboard/ViewCard";
import {useUserContext} from "../../../providers/UserProvider";
import {InboxOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {message, Skeleton, Upload} from 'antd';
import "../../../../assets/css/views/dashboard/gallery.scss"
import GalleryImage from "./GalleryImage";
import ImageUpload from "../../../components/dashboard/ImageUpload";
import {useForm} from "react-hook-form";
import {AttachmentServices} from "../../../services/api-services/attachment.services";
import {toast} from "react-toastify";
import {BACKEND_CONSTANTS} from "../../../config/constants";
import {IAttachmentListing} from "../../../interfaces/IAttachement";

const { Dragger } = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

interface IMediaUpload  {
    media:{
        path: string
    }[]
}

const content = (
    <div>
        <p className="ant-upload-drag-icon">
            <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
        </p>
    </div>
);


export default function Gallery() {
    const [images, setImages] = useState<IAttachmentListing[]>([]);
    const [imageUpdate, setImageUpdate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const {setTitle, establishmentId} = useUserContext()
    useEffect(()=>{
        setTitle("Media Library")
    },[])
    const methods = useForm<IMediaUpload>({
        shouldUnregister: false,
        mode: "onChange",
    });

    useEffect(()=>{
        const media = methods.watch('media')
        if(media?.length > 0){
            AttachmentServices.store({
                path: media[0].path || ""
            }).then(()=>{
                setImageUpdate(!imageUpdate)
            }).catch((e)=>{
                toast.error(e.message)
            })
        }
    },[methods.watch('media')])

    useEffect(()=>{
        AttachmentServices.index({instance_type: BACKEND_CONSTANTS.ATTACHMENT_INSTANCE_TYPE.GALLERY}, 50).then((res)=>{
            setImages(res.data.data);
            setLoading(false)
        })
    },[imageUpdate])

    return(
        <ViewCard>
            <div className={"media-gallery"}>
                <div>
                    {/*<Dragger {...props}>*/}
                    {/*    <p className="ant-upload-drag-icon">*/}
                    {/*        <InboxOutlined />*/}
                    {/*    </p>*/}
                    {/*    <p className="ant-upload-text">Click or drag file to this area to upload</p>*/}
                    {/*    <p className="ant-upload-hint">*/}
                    {/*        Support for a single or bulk upload. Strictly prohibit from uploading company data or other*/}
                    {/*        band files*/}
                    {/*    </p>*/}
                    {/*</Dragger>*/}

                    <ImageUpload maxCount={10} setValue={methods.setValue} fieldName={"media"} body={content} autoHideAfterUpload={true} />
                </div>
                <div className={"mt-3"}>
                    <ul>
                        {
                            images.map((image)=>{
                                return(
                                    image.mediaUrl && <li key={image.id}>
                                        <GalleryImage path={image.path} fullPath={image.mediaUrl}/>
                                    </li>
                                )
                            })
                        }
                        {
                            // show Image Loading Skeletons while api call in pending...
                            loading &&
                            <div className={"loader-container"}>
                                {/* Create an array of 15 length & fill empty object on all index
                                 then return skeleton on all iteration  with the help of map*/}
                                {Array(15).fill({})
                                    .map((_, index)=>
                                        <div key={index} className={"loader-item"} >
                                            <Skeleton.Image active={true} />
                                        </div>)}
                            </div>
                        }
                    </ul>
                </div>
            </div>
        </ViewCard>
    )
}