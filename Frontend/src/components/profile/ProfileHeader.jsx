const ProfileHeader = ({ user, fileInputRef, onUpload, isUploading = false }) => (
  <div className="bg-linear-to-b from-[#3a3a3a] to-black px-6 py-10">
    <div className="flex items-center gap-6">

      <div
        onClick={() => !isUploading && fileInputRef.current.click()}
        className="relative group w-32 h-32 rounded-full bg-[#1f1f1f] flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {user.avatar ? (
          <img src={user.avatar} className="w-full h-full object-cover" />
        ) : (
          <i className="ri-user-line text-5xl text-gray-400"></i>
        )}

        <div className={`absolute inset-0 bg-black/60 flex justify-center items-center transition-opacity ${isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          {isUploading ? (
            <div className="w-8 h-8 border-2 border-zinc-300 border-t-white rounded-full animate-spin" />
          ) : (
            <i className="ri-pencil-line text-white text-xl"></i>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        className="hidden"
      />

      <div>
        <p className="text-sm text-gray-300">Profile</p>
        <h1 className="md:text-5xl text-2xl font-bold text-white">
          {user?.displayName || user?.username || "user"}
        </h1>
      </div>
    </div>
  </div>
);

export default ProfileHeader