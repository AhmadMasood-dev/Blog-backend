import { blogLogo } from "../../assets/images";

import Button from "../../utils/Button";
import { IoIosArrowRoundForward } from "react-icons/io";

function Navbar() {
  return (
    <header className="bg-accent body-font">
      <div className="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
        <div className="">
          <img src={blogLogo} className="w-32 h-16 " />
        </div>
        <nav className="flex flex-wrap items-center justify-center p-3 text-xl md:ml-auto md:mr-auto">
          <a className="mr-5 hover:text-primary text-secondary ">Home</a>
          <a className="mr-5 hover:text-primary text-secondary">Posts</a>
          <a className="mr-5 hover:text-primary text-secondary">Create-Post</a>
          {/* <a className="mr-5 hover:text-primary text-secondary">Register</a> */}
        </nav>
        <Button>Login{<IoIosArrowRoundForward className="text-xl" />}</Button>
      </div>
    </header>
  );
}

export default Navbar;
