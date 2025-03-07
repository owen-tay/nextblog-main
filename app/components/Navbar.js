import Image from 'next/image'
import leaf from '../../public/longleaf.svg'
import Link from "next/link";


const Navbar = () => {
  return (
    <nav className="relative h-18 overflow-hidden leafbg">
      
      <div className="flex justify-center items-center text-center">
        
        <h1 className="text-4xl w-62 bg-white hover:scale-105 ease-in-out duration-100 z-10 items-center mt-3 text-base-100 blend  font-extrabold ">Owen Taylor</h1>
        
        
        <Image src={leaf}
          className="z-0 absolute leaveRotatemid left-0 "
          layout="intrinsic"
          height={500}
        />
        <Image src={leaf}
          className="z-0 absolute leaveRotatemid leafmiddle right-0 "
          layout="intrinsic"
          height={500}
        />
        <Image src={leaf}
          className="z-0 absolute leaveRotatemid leafmiddle  left-1/2 "
          layout="intrinsic"
          height={500}
        />
        
      </div>
      <div className="flex w-screen mt-3    font-bold justify-center  gap-7">




</div>

    </nav>
  );
};

export default Navbar;
