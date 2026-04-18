import React from "react";
import HighlightText from "../../ui/HighlightText";
import { useNavigate } from "react-router";

const ArtistSuggestionResults = ({ artists, query }) => {
    const navigate = useNavigate();
    if (!artists.length) return null;

    return (
        <div className="mb-4">
            <div className="text-xs uppercase text-gray-400 font-semibold px-3 py-2">
                Artists
            </div>
            {artists.map((artist, idx) => (
                <div
                    key={idx}
                    onClick={()=>navigate(`/artist/${idx}`)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 cursor-pointer rounded-md"
                >
                    <img
                        src={artist.user.avatar || "https://picsum.photos/40"}
                        alt={artist.user.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <HighlightText
                            onClick={() => {}}
                            text={artist.user.displayName}
                            highlight={query}
                        />
                        <div className="text-xs text-gray-400">Artist</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArtistSuggestionResults;
