import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Nopage from "../pages/Nopage/Nopage";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

import { useAuthStore } from "../store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import WatchPage from "../pages/WatchPage/WatchPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import SearchHistoryPage from "../pages/SearchHistoryPage/SearchHistoryPage";
import Admin from "../pages/Admin/Admin";

function App() {

  const { user,isCheckingAuth, authCheck } = useAuthStore();


  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
		return (
			<div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
		);
	}




  return (
    <>
      <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login /> } />
          <Route path="/register" element={!user ? <Register />: <Navigate to={"/"} /> } />
          <Route path='/watch/:id' element={user ? <WatchPage /> : <Navigate to={"/login"} />} />
          <Route path='/search' element={user ? <SearchPage /> : <Navigate to={"/login"} />} />
          <Route path='/history' element={user ? <SearchHistoryPage /> : <Navigate to={"/login"} />} />
          <Route path='/admin' element={user?.admin ? <Admin /> : <Navigate to={"/"} />} />

          <Route path="*" element={<Nopage />} />

      </Routes>

      <Toaster />
      <ToastContainer />
    </>
  );
}

export default App;
