import { useState } from "react";
import supabase from "../SupabaseClient.jsx";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!role) {
      openModal();
      setIsLoading(false);
      return;
    }

    const { data: user, error } = await supabase
      .from("Users")
      .select("email, password, role")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      openModal();
      setIsLoading(false);
      return;
    }

    if (user) {
      if (user.email === email) {
        if (user.password === password) {
          if (user.role === role) {
            sessionStorage.setItem("userRole", user.role);
            navigate(
              user.role === "ADMIN" ? "/admin-dashboard" : "/student-dashboard"
            );
          } else {
            openModal();
          }
        } else {
          openModal();
        }
      } else {
        openModal();
      }
    } else {
      openModal();
    }

    setIsLoading(false);
  };

  const openModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(bg.jpg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="w-full max-w-md p-8 rounded-lg relative z-10 backdrop-blur-sm bg-white/40 border border-white/40">
          <div className="flex justify-center content-center">
            <img
              src="https://placehold.co/400"
              alt="csu-logo"
              className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-white mt-2">
            Grade
            <span className="text-yellow-400">Ease</span>
          </h1>
          <form className="mt-6" onSubmit={userLogin}>
            <div className="mb-3">
              <label className="input validator w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>
            </div>

            <div className="mb-4">
              <label className="input validator w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  required
                />
              </label>
              <p className="validator-hint hidden text-white">
                Must be more than 8 characters, including
                <br />
                At least one number
                <br />
                At least one lowercase letter
                <br />
                At least one uppercase letter
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm text-white">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                Show Password
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                className="select w-full sm:w-1/3 md:w-1/2 px-4 py-2 rounded-md border border-gray-300"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                type="submit"
                className="btn btn-success w-full sm:w-auto md:w-2/3 rounded-md py-2 px-4 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner mr-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Login Failed</h3>
          <p className="py-4">Please check your email and password.</p>
        </div>
      </dialog>
    </>
  );
};

export default Login;
