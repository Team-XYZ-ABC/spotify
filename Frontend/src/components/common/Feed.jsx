import React from "react";
import Footer from "./Footer";
import TopFilters from "../music/trackCard/TopFilters";
import SectionRow from "../music/trackCard/SectionRow";

const SECTIONS = [
  {
    id: "recommended",
    title: "Recommended for you",
    section: "recommended",
    type: "playlist",
  },
  {
    id: "popular",
    title: "Popular",
    section: "popular",
    type: "album",
  },
  {
    id: "episodes",
    title: "Episodes you might like",
    section: "episodes",
    type: "podcast",
  },
  {
    id: "charts",
    title: "Featured Charts",
    section: "featured-charts",
    type: "artist",
  },
];

const Feed = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-linear-to-b from-[#1f1f1f] via-[#121212] to-[#121212] rounded-lg">
      <div className="flex flex-col gap-10 px-6 py-5 pb-8">
        <TopFilters />
        {SECTIONS.map((s) => (
          <SectionRow
            key={s.id}
            title={s.title}
            section={s.section}
            type={s.type}
            extraParams={s.extraParams}
          />
        ))}
        <div className="h-4" />
      </div>
      <Footer />
    </div>
  );
};

export default Feed;