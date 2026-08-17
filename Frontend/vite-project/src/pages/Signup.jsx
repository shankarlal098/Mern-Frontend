import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { registerUser } from "../redux/authSlice";

const signupSchema = z.object({
  firstName: z
    .string()
    .min(3, "Minimum 3 characters required"),

  emailId: z
    .string()
    .email("Invalid Email"),

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

  const {
    isAuthenticated,
    loading,
    error,
  } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const redirectPath =
      localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem(
        "redirectAfterLogin"
      );
      navigate(redirectPath);
    } else {
      navigate("/join");
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(data) {
     console.log(data);
     await dispatch(registerUser(data));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">

      <div className="card w-96 bg-base-200 shadow-xl">

        <div className="card-body">

          {/* TITLE */}

          <h2 className="card-title justify-center text-3xl mb-6 text-cyan-400">
            CodeTogether
          </h2>

          {/* SERVER ERROR */}
          {/* Check here bro  how to access actual messahe bro backnd opuut object is it error.messahe or errro.messahe.meessage */}
          {error && (
            <p className="text-error text-center mb-3">
              {error.message ||"Something went wrong. Please try again."}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* FIRST NAME */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  First Name
                </span>
              </label>

              <input
                type="text"
                placeholder="John"
                className={`input input-bordered w-full ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("firstName")}
              />

              {errors.firstName && (
                <p className="text-error text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}

            </div>

            {/* EMAIL */}

            <div className="form-control mt-4">

              <label className="label">
                <span className="label-text">
                  Email
                </span>
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />

              {errors.emailId && (
                <p className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </p>
              )}

            </div>

            {/* PASSWORD */}

            <div className="form-control mt-4">

              <label className="label">
                <span className="label-text">
                  Password
                </span>
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${
                    errors.password
                      ? "input-error"
                      : ""
                  }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >

                  {showPassword ? "🙈" : "👁️"}

                </button>

              </div>

              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* SUBMIT BUTTON */}

            <div className="form-control mt-8">

              <button
                type="submit"
                disabled={loading}
                className="btn btn-info text-black"
              >

                {loading
                  ? "Signing Up..."
                  : "Sign Up"}

              </button>

            </div>

          </form>

          {/* LOGIN LINK */}

          <div className="text-center mt-6">

            <span className="text-sm">
              Already have an account?{" "}
            </span>

            <NavLink
              to="/login"
              className="link link-info"
            >
              Login
            </NavLink>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;
// is handle error and validation is hard with resigtor(onchnage??) so we use zod type libary for validation 





// Documnetation is React-Hook Form 
// in depth bro  its an important topic bro ..................
// alos Zod for documnetation go on zodwebsite
// campass doubt at last in login 
// why we dont do response encreption from server is it auto handle or what 
// if not auto handle then can we use encereption ?


//  error objects ::
// const errors =  {
//   firstName : {
//     type : 'minLength ',
//     message : "Minimum character should be 3"
//   }
//   emailid : {
//     typs : 'invalid string',
//     message : 'INvalid email'
//   }
// }





 