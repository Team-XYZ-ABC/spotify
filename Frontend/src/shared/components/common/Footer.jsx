import React from "react";

const Footer = () => {
    return (
        <div className="w-full bg-black text-gray-400 px-6 py-12">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                    
                    <div>
                        <h3 className="text-white font-bold mb-3">Company</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li className="hover:text-white w-fit cursor-pointer">About</li>
                            <li className="hover:text-white w-fit cursor-pointer">Jobs</li>
                            <li className="hover:text-white w-fit cursor-pointer">For the Record</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-3">Communities</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li className="hover:text-white w-fit cursor-pointer">For Artists</li>
                            <li className="hover:text-white w-fit cursor-pointer">Developers</li>
                            <li className="hover:text-white w-fit cursor-pointer">Advertising</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-3">Useful links</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li className="hover:text-white w-fit cursor-pointer">Support</li>
                            <li className="hover:text-white w-fit cursor-pointer">Free Mobile App</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-3">Spotify Plans</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li className="hover:text-white w-fit cursor-pointer">Premium Individual</li>
                            <li className="hover:text-white w-fit cursor-pointer">Premium Duo</li>
                            <li className="hover:text-white w-fit cursor-pointer">Premium Family</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    
                    <p className="text-xs">
                        © 2026 Spotify AB
                    </p>

                    <div className="flex gap-4 text-xs">
                        <span className="hover:text-white cursor-pointer">Legal</span>
                        <span className="hover:text-white cursor-pointer">Privacy</span>
                        <span className="hover:text-white cursor-pointer">Cookies</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;