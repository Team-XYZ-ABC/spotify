const StickyHeader = ({ name }) => (
    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-6 py-3 border-b border-zinc-800">
        <h2 className="text-white font-semibold text-lg truncate">
            {name}
        </h2>
    </div>
);

export default StickyHeader;