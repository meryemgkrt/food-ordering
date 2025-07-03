import Image from "next/image";
import React from "react";
import { BiSolidUpArrow } from "react-icons/bi";

const CustomerItem = ({ src }) => {
  return (
    <div className="mt-4 ">
      <div className="p-8 bg-secondary text-white rounded-lg ">
        <p className="text-white text-[14px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
          quisquam libero suscipit veritatis cupiditate consectetur!
        </p>
        <div className="flex flex-col mt-4">
          <span className="text-lg font-semibold">Moana Michell</span>
          <span className="text-white text-sm">Magna aliqua</span>
        </div>
      </div>
      <div className="relative w-28 h-28 border-4 border-primary rounded-full mt-4">
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 rotate-45 bg-primary w-5 h-5 rounded-sm"></span>
        <Image
          src={src}
          alt="Client Image"
          fill // layout="fill" yerine
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-full object-cover" // objectFit="cover" yerine
          priority
        />
      </div>
    </div>
  );
};

export default CustomerItem;
