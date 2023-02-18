import React, {useState} from "react";
import img from "../../../../assets/images/product.png";
import {AiOutlineLink} from "react-icons/ai";
import {Popconfirm, Skeleton} from "antd";
import {RiDeleteBin4Line} from "react-icons/ri";
import ImgNotFound from "../../../../assets/images/image-not-found.webp";

export default function GalleryImage({path, fullPath}:{path:string,  fullPath:string}) {
    const [overlay, setOverlay] = useState(false);
    const [link, setLink] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const handleChange = () =>{
        setOverlay(!overlay)
    }
    const handleLink = () =>{
        setLink(true)
        setOverlay(true)

        navigator.clipboard.writeText(path).then(()=>{
            setTimeout(() => {
                setLink(false)
                setOverlay(false)
            }, 1000);
        })
    }
    // function for false Image Loading state when network image load successfully
    const onImageLoad = ()=>{
        setIsImageLoading(false)
    }

    return(
        <>
            {/* show Image Skeleton when network image loading */}
            {isImageLoading && <Skeleton.Image active={true} className={"img-skeleton"} />}

            {/* then auto show network image after successfully loaded */}
            <div className={`img-box ${overlay? 'img-overlay' : ''}`}>
                <img loading="lazy" alt="…" className={`img-fluid`} src={fullPath} onLoad={onImageLoad}
                     onError={({currentTarget })=>currentTarget.src=ImgNotFound} />
                <div className={"action-btns"}>
                    <button onClick={handleLink}
                            className={"btn btn-link"}><AiOutlineLink/></button>
                    <button className={"btn btn-delete"}>
                        <Popconfirm onCancel={handleChange} onConfirm={handleChange} className={"hello"} title="Sure to delete?">
                            <a onClick={handleChange} className={"table-icon delete"}><RiDeleteBin4Line/></a>
                        </Popconfirm>
                    </button>
                </div>
                <div onClick={handleLink} className={`linked-copied ${link? 'show' : 'hide'}`}>
                    <p>Link Copied !</p>
                </div>
            </div>
        </>
    )
}