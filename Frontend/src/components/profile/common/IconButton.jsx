const IconButton = ({ icon, ...props }) => (
  <button
    {...props}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition"
  >
    <i className={icon}></i>
  </button>
);
export default IconButton