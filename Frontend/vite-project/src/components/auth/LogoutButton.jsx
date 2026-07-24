
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/authSlice";

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.removeItem(
        "redirectAfterLogin"
      );
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn-error btn-sm"
    >
      Logout
    </button>
  );
}

export default LogoutButton;



