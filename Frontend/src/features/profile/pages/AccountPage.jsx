import React from "react";
import Account from "@/features/profile/pages/Account";
import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";

const AccountPage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col bg-[#09090B] text-white">
            <div className="w-full mt-2 md:px-40">
                <Navbar />
            </div>

            <div className="flex-1 flex items-center justify-center py-24 px-6">
               <Account />
            </div>

            <Footer />
        </div>
    );
};

export default AccountPage;
