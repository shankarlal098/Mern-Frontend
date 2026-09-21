import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../redux/authSlice";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email address"),
  password: z.string().min(1, "Password is required"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Extract Exact Error Message from Redux / Axios Error Object
  const getErrorMessage = (err) => {
    if (!err) return null;
    if (typeof err === "string") return err;
    return (
      err?.response?.data?.message ||
      "Login failed. Please check your credentials."
    );
  };

  const errorMessage = getErrorMessage(error);

  useEffect(() => {
    if (!isAuthenticated) return;
    const from = location.state?.from?.pathname || "/join";
    navigate(from);
  }, [isAuthenticated, navigate, location.state]);

  async function onSubmit(data) {
    await dispatch(loginUser(data));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] p-4 text-[#e6edf3] selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-[#0d1117]/80 p-8 shadow-2xl backdrop-blur-xl relative z-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Code<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Together</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1">Welcome back! Sign in to continue</p>
        </div>

        {/* SERVER ERROR ALERT */}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-center text-xs font-semibold text-rose-400 backdrop-blur-md animate-fade-in">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className={`w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none ${
                errors.emailId
                  ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              {...register("emailId")}
            />
            {errors.emailId && (
              <p className="text-rose-400 text-xs font-medium mt-1">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <NavLink
                to="/forgot-password"
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot Password?
              </NavLink>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none ${
                  errors.password
                    ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              <p className="text-rose-400 text-xs font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>

        {/* SIGNUP LINK */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <NavLink to="/signup" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline">
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Login;


