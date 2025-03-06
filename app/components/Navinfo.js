import Link from "next/link";

const Navinfo = () => {
    return (
<nav className="footer items-center  text-neutral-content">
  <div className="flex w-screen  text-white  font-bold justify-center  gap-7">

  <Link className="hover:text-secondary hover:scale-105 ease-in-out duration-100" href="https://owentaylor.dev/">Portfolio</Link>
  <Link className="hover:text-secondary hover:scale-105 ease-in-out duration-100" href="https://design.owentaylor.dev/">Design</Link>
  <Link className="hover:text-secondary hover:scale-105 ease-in-out duration-100" href="https://github.com/owen-tay/">Github</Link>


  </div>

  
</nav>
    );
  };
  
  export default Navinfo;