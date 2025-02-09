import React from "react";
import { Link } from "react-router";
import "./Nopage.css";
import Navbar from "../../components/Navbar/Navbar";

const Nopage = () => {
  return (
    // <div
    //   className="min-h-screen bg-cover nopage bg-center flex flex-col justify-center items-center text-white"
    //   style={{ backgroundImage: `url('/404Peaky.jpg')` }}
    // >
    //   <header className="absolute top-0 left-0 p-4 bg-transparent w-full ">
    //     <Link to={"/"}>
    //       <img src="/netflix-logo.png" alt="Netflix" className="h-8" />
    //     </Link>
    //   </header>
    //   <main className="text-center error-page--content z-10">
    //     <h1 className="text-7xl font-semibold mb-4">Lost your way?</h1>
    //     <p className="mb-6 text-xl">
    //       Sorry, we can't find that page. You'll find lots to explore on the
    //       home page.
    //     </p>
    //     <Link to={"/"} className="bg-white text-black py-2 px-4 rounded">
    //       Netflix Home
    //     </Link>
    //   </main>
    // </div>
    <div className="nf-all">
      <div className="nf-top bg-black">
        <div className="nf-top-container max-w-6xl p-4 ">
          <div className="top-image">
            <Link to={"/"}>
              <img src="/netflix-logo.png" alt="Netflix" className="h-8" />
            </Link>
          </div>
        </div>
      </div>
      <div className="nf-main">
        <div className="main-image flex content-center  align-items-center justify-center">
          <div className="main-content text-white flex flex-col align-center justify-center">
            
              <h1 className="text-7xl font-semibold mb-4">Lost your way?</h1>

              <p className="mb-6 text-xl">
                Sorry, we can't find that page. You'll find lots to explore on
                the home page.
              </p>

              <Link to={"/"} className="bg-white text-black w-40 py-2 px-4 rounded">
                Netflix Home
              </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nopage;
