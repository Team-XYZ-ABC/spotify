const ProfileSkeleton = () => (
    <div className="flex-1 h-[calc(100vh-86px)] overflow-y-auto bg-zinc-900 rounded-lg flex flex-col no-scrollbar animate-pulse">
        <div className="bg-linear-to-b from-[#3a3a3a] to-black px-6 py-10">
            <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-zinc-700/60" />
                <div className="space-y-3">
                    <div className="h-3 w-14 rounded bg-zinc-700/60" />
                    <div className="h-8 w-52 rounded bg-zinc-700/60" />
                </div>
            </div>
        </div>

        <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 sm:py-8 bg-black text-white">
            <div className="flex justify-end gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
            </div>

            <div className="h-6 w-52 rounded bg-zinc-800 mb-2" />
            <div className="h-4 w-36 rounded bg-zinc-800 mb-6" />

            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-md p-3 bg-zinc-900/80">
                        <div className="w-12 h-12 rounded bg-zinc-800" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/5 rounded bg-zinc-800" />
                            <div className="h-3 w-1/3 rounded bg-zinc-800" />
                        </div>
                        <div className="h-3 w-12 rounded bg-zinc-800" />
                    </div>
                ))}
            </div>
        </div>

        <div className="h-16 bg-zinc-900 border-t border-zinc-800" />
    </div>
);

export default ProfileSkeleton;