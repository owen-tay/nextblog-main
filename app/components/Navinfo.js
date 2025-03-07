import Link from "next/link";

const Navinfo = () => {
    return (
<nav className="footer items-center ">
  <div className="flex w-screen mt-3    font-bold justify-center  gap-7">

  <Link className="hover:text-bloggreen hover:scale-105 text-bloggreen ease-in-out duration-100" href="https://owentaylor.dev/">Portfolio</Link>
  <Link className="hover:text-bloggreen hover:scale-105 text-bloggreen ease-in-out duration-100" href="https://design.owentaylor.dev/">Design</Link>
  <Link className="hover:text-bloggreen hover:scale-105 text-bloggreen ease-in-out duration-100" href="https://github.com/owen-tay/">Github</Link>


  </div>

  
</nav>
    );
  };
  
  export default Navinfo;