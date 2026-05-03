const DropdownItem = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded ${className}`}
  >
    {children}
  </button>
);
export default DropdownItem