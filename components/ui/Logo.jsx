import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="text-[32px] font-dancing font-bold">
      <span className="text-white text-[2rem] font-dancing font-bold cursor-pointer hover:text-primary transition-all ">
        Feane
      </span>
    </Link>
  );
};

export default Logo;
