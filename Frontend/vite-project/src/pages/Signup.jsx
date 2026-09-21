import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { registerUser } from "../redux/authSlice";

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum 3 characters required"),
  emailId: z.string().email("Invalid Email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Must contain uppercase, lowercase, number, and special character"
    ),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const getErrorMessage = (err) => {
    if (!err) return null;
    if (typeof err === "string") return err;
    return (
      err?.response?.data?.message ||
      "Registration failed. Please try again."
    );
  };

  const errorMessage = getErrorMessage(error);

  useEffect(() => {
    if (!isAuthenticated) return;
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } else {
      navigate("/join");
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(data) {
    await dispatch(registerUser(data));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] p-4 text-slate-200 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Code<span className="text-blue-500">Together</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Create an account to start collaborating</p>
        </div>

        {/* SERVER ERROR ALERT */}
        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-medium text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* FIRST NAME */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              className={`w-full rounded-lg border bg-[#1F2937] px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none ${
                errors.firstName
                  ? "border-red-500/60 focus:border-red-500"
                  : "border-slate-700/80 focus:border-blue-500"
              }`}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className={`w-full rounded-lg border bg-[#1F2937] px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none ${
                errors.emailId
                  ? "border-red-500/60 focus:border-red-500"
                  : "border-slate-700/80 focus:border-blue-500"
              }`}
              {...register("emailId")}
            />
            {errors.emailId && (
              <p className="text-red-400 text-xs mt-1">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-[#1F2937] px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none ${
                  errors.password
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-slate-700/80 focus:border-blue-500"
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0110.123 3.937M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <NavLink to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Signup;