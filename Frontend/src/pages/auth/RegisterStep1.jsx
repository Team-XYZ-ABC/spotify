import { useEffect, useState } from "react";
import TermsandPolicy from "../../components/ui/TermsandPolicy";
import { Link } from "react-router";

const RegisterStep1 = () => {
    const [form, setForm] = useState({
        displayName: "",
        userName: "",
        password: "",
        role: "listener",
    });

    const [strength, setStrength] = useState("");

    useEffect(() => {
        document.title = "Create Account - Spotify";
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (e.target.name === "password") {
            const val = e.target.value;

            if (val.length < 6) setStrength("Weak");
            else if (val.match(/^(?=.*[A-Z])(?=.*\d).{6,}$/)) {
                setStrength("Strong");
            } else setStrength("Medium");
        }
    };

    const handleSubmit = () => {
        const { displayName, userName, password } = form;

        console.log("Data:", form);
    };

    return (
        <div className="min-h-screen p-14 sm:p-26 w-full bg-[#121212] flex flex-col gap-18 justify-between items-center text-white px-4">
            <div className="w-80 flex flex-col gap-3">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-10 w-10">
                        <img
                            className="h-full w-full object-contain"
                            src="/img/spotify_logo_white.png"
                            alt="logo"
                        />
                    </div>

                    <h1 className="text-2xl sm:text-5xl font-extrabold leading-12">
                        Create your account
                    </h1>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                        Display Name
                    </label>
                    <input
                        type="text"
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="bg-transparent border border-gray-500 p-3 rounded-md focus:outline-none focus:border-white"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Username</label>
                    <input
                        type="text"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        placeholder="username"
                        className="bg-transparent border border-gray-500 p-3 rounded-md focus:outline-none focus:border-white"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="bg-transparent border border-gray-500 p-3 rounded-md focus:outline-none focus:border-white"
                    />

                    {form.password && (
                        <p
                            className={`text-sm font-semibold ${
                                strength === "Weak"
                                    ? "text-red-500"
                                    : strength === "Medium"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                            }`}
                        >
                            {strength} Password
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold">
                        Choose your role
                    </label>

                    <div className="flex gap-4">
                        <button
                            onClick={() =>
                                setForm({ ...form, role: "listener" })}
                            className={`flex-1 py-2 rounded-md cursor-pointer border ${
                                form.role === "listener"
                                    ? "bg-green-500 text-black border-green-500"
                                    : "border-gray-500"
                            }`}
                        >
                            Listener
                        </button>

                        <button
                            onClick={() => setForm({ ...form, role: "artist" })}
                            className={`flex-1 py-2 rounded-md cursor-pointer border ${
                                form.role === "artist"
                                    ? "bg-green-500 text-black border-green-500"
                                    : "border-gray-500"
                            }`}
                        >
                            Artist
                        </button>
                    </div>
                </div>
                <Link to={"/"}>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 w-full cursor-pointer text-black font-bold py-3 rounded-full active:scale-95 transition"
                    >
                        Create Account
                    </button>
                </Link>
            </div>
            <div className="flex flex-col gap-10">
                <TermsandPolicy />
            </div>
        </div>
    );
};

export default RegisterStep1;
