import { useRef } from "react";

const EditProfileModal = ({
  isOpen,
  onClose,
  name,
  setName,
  profileImg,
  setProfileImg,
  handleNameSave
}) => {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setProfileImg(URL.createObjectURL(file)); 
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#181818] w-[90%] sm:w-100 rounded-lg p-6 text-white relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <div
          onClick={() => fileInputRef.current.click()}
          className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#2a2a2a] flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {profileImg ? (
            <img
              src={profileImg}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <i className="ri-user-line text-3xl text-gray-400"></i>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-[#2a2a2a] outline-none mb-4"
          placeholder="Enter name"
        />

        <button
          onClick={handleNameSave}
          className="w-full bg-white text-black py-2 rounded font-semibold hover:scale-105 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;