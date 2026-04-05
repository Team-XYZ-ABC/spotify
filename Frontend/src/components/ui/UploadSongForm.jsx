import React from "react";

const UploadSongForm = ({openUploadTrackForm}) => {
    return (
        <div className={`inset-0 top-0 left-0 bg-black/50 backdrop-blur-xs text-white h-screen w-full z-99 flex items-center justify-center ${openUploadTrackForm ? "fixed" : "hidden"}`}>
            <h1>Upload Song Form</h1>
        </div>
    );
};

export default UploadSongForm;
