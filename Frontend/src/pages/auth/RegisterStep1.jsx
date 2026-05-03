import { useEffect, useState } from "react";
import TermsandPolicy from "../../components/ui/TermsandPolicy";
import { Link, useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import { registerSchema, validate } from "../../validators";

const RegisterStep1 = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    useEffect(() => {
        document.title = "Create Account - Spotify";
        console.log(location)
        email ? null : navigate('/register')
    }, []);


    const [form, setForm] = useState({
        email: email,
        displayName: "",
        username: "",
        password: "",
        role: "listener",
    });

    const { registerUser, loading, error } = useAuth();
    const [strength, setStrength] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});


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
                    {fieldErrors.displayName && <p className="text-red-400 text-xs">{fieldErrors.displayName}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="username"
                        className="bg-transparent border border-gray-500 p-3 rounded-md focus:outline-none focus:border-white"
                    />
                    {fieldErrors.username && <p className="text-red-400 text-xs">{fieldErrors.username}</p>}
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
                            className={`text-sm font-semibold ${strength === "Weak"
                                    ? "text-red-500"
                                    : strength === "Medium"
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                }`}
                        >
                            {strength} Password
                        </p>
                    )}
                    {fieldErrors.password && <p className="text-red-400 text-xs">{fieldErrors.password}</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold">
                        Choose your role
                    </label>

                    <div className="flex gap-4">
                        <button
                            onClick={() =>
                                setForm({ ...form, role: "listener" })}
                            className={`flex-1 py-2 rounded-md cursor-pointer border ${form.role === "listener"
                                    ? "bg-green-500 text-black border-green-500"
                                    : "border-gray-500"
                                }`}
                        >
                            Listener
                        </button>

                        <button
                            onClick={() => setForm({ ...form, role: "artist" })}
                            className={`flex-1 py-2 rounded-md cursor-pointer border ${form.role === "artist"
                                    ? "bg-green-500 text-black border-green-500"
                                    : "border-gray-500"
                                }`}
                        >
                            Artist
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    onClick={() => {
                        const { values, errors } = validate(registerSchema, form);
                        if (errors) { setFieldErrors(errors); return; }
                        setFieldErrors({});
                        registerUser(values);
                    }}
                    disabled={loading}
                    className="bg-green-500 w-full cursor-pointer text-black font-bold py-3 rounded-full active:scale-95 transition disabled:opacity-60"
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>
            </div>
            <div className="flex flex-col gap-10">
                <TermsandPolicy />
            </div>
        </div>
    );
};

export default RegisterStep1;
