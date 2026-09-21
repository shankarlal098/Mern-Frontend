
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../../redux/authSlice";

// function LogoutButton() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   async function handleLogout() {
//     try {
//       await dispatch(logoutUser()).unwrap();
//       localStorage.removeItem(
//         "redirectAfterLogin"
//       );
//       navigate("/login");
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   return (
//     <button
//       onClick={handleLogout}
//       className="btn btn-error btn-sm"
//     >
//       Logout
//     </button>
//   );
// }

// export default LogoutButton;



import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../../redux/authSlice";

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.removeItem("redirectAfterLogin");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300 active:scale-[0.98]"
    >
      <svg className="h-4 w-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;