import Dropdown from "./common/Dropdown";
import DropdownItem from "./common/DropdownItem";
import IconButton from "./common/IconButton";
import { Link } from "react-router";

const ProfileMenu = ({ menuRef, openMenu, setOpenMenu, onEdit }) => (
  <div className="flex justify-end gap-4 mb-4" ref={menuRef}>
    
    <div className="relative">
      <IconButton
        icon="ri-settings-3-line"
        onClick={() =>
          setOpenMenu(openMenu === "settings" ? null : "settings")
        }
      />

      {openMenu === "settings" && (
        <Dropdown>
          <DropdownItem onClick={onEdit}>Edit Profile</DropdownItem>
          <Link to={'/account'}><DropdownItem>Account Settings</DropdownItem></Link>
        </Dropdown>
      )}
    </div>

    <div className="relative">
      <IconButton
        icon="ri-more-2-fill"
        onClick={() =>
          setOpenMenu(openMenu === "more" ? null : "more")
        }
      />

      {openMenu === "more" && (
        <Dropdown>
          <DropdownItem>Share Profile</DropdownItem>
          <DropdownItem className="text-red-400">Logout</DropdownItem>
        </Dropdown>
      )}
    </div>
  </div>
);

export default ProfileMenu