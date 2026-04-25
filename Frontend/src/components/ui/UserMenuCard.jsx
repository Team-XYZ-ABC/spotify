import MenuItem from "./MenuItem";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

const UserMenuCard = ({ setShowProfile, profileRef }) => {
  const { logoutUser } = useAuth();
  const {user} = useSelector((state) => state.user);
  const menuContainerRef = useRef(null);

  useEffect(() => {
      const handleClickOutside = (e) => {
        console.log(e.target)
        if (menuContainerRef.current && !menuContainerRef.current.contains(e.target) && !profileRef.current.contains(e.target)) {
          setShowProfile(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuContainerRef} className="
      fixed md:absolute 
      inset-0 md:inset-auto 
      md:right-0 md:top-14 
      w-full md:w-80 
      h-screen md:h-auto 
      bg-[#121212] text-white 
      md:rounded-lg shadow-lg 
      p-4 md:p-2 
      z-50 overflow-y-auto
    ">

      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <button onClick={() => setShowProfile(false)} className="text-2xl">
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <MenuItem setShowProfile={setShowProfile} icon="ri-user-line" text="Account" path="/account" />
        {user?.role == "artist" && (
          <MenuItem setShowProfile={setShowProfile} icon="ri-dashboard-horizontal-line" text="Dashboard" path="/analytics" isArtist/>
        )}
        <MenuItem setShowProfile={setShowProfile} icon="ri-profile-line" text="Profile" path="/profile" />
        <MenuItem setShowProfile={setShowProfile} icon="ri-vip-crown-line" text="Upgrade to Premium" external />
        <MenuItem setShowProfile={setShowProfile} icon="ri-customer-service-2-line" text="Support" external />
        <MenuItem setShowProfile={setShowProfile} icon="ri-download-line" text="Download" external />
        <MenuItem setShowProfile={setShowProfile} icon="ri-settings-3-line" text="Settings" />
      </div>

      <div className="my-3 border-t border-gray-700"></div>

      <MenuItem setShowProfile={setShowProfile} icon="ri-logout-box-r-line" text="Log out" onClick={logoutUser} />

      <div className="mt-4">
        <p className="text-gray-400 text-xs mb-2">Your Updates</p>

        <div className="flex gap-3 items-start bg-[#1e1e1e] p-3 rounded-md hover:bg-[#2a2a2a] transition">
          <i className="ri-megaphone-line text-xl"></i>
          <p className="text-sm text-gray-300 leading-tight">
            Say hello to Your Updates. Check here for news on your followers,
            playlists, events and more
            <span className="text-gray-500"> • 6d</span>
          </p>
        </div>
      </div>
    </div>
  );
};


export default UserMenuCard;