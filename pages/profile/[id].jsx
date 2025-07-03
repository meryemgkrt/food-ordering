// pages/profile/[id].jsx
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiExit } from "react-icons/bi";
import { RiEBike2Line } from "react-icons/ri";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineHome } from "react-icons/md";
import Title from "@/components/ui/Title";
import Acount from "@/components/profile/Acount";
import Password from "@/components/profile/Password";
import Order from "@/components/profile/Order";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Index = ({ user }) => {
  const { data: session, status } = useSession();
  const [tabs, setTabs] = useState(0);
  const router = useRouter();

  const handlerExit = async () => {
    if (confirm("Are you sure you want to exit?")) {
      await signOut({ redirect: false });
      router.push("/auth/login");
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[calc(100vh_-_433px)] gap-6 px-4 md:px-10">
      <div className="flex flex-col items-center shadow-lg p-6">
        <div className="flex flex-col items-center">
          <Image
            src="/image/client2.jpg"
            alt="User"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <b className="text-center text-2xl mt-3">
            {user?.fullName || session?.user?.name || "User"}
          </b>
        </div>

        <ul className="w-full flex flex-col items-center font-bold mt-4">
          {[
            { id: 0, label: "Account", icon: <MdOutlineHome /> },
            { id: 1, label: "Password", icon: <IoKeyOutline /> },
            { id: 2, label: "Orders", icon: <RiEBike2Line /> },
            { id: 3, label: "Exit", icon: <BiExit />, action: handlerExit },
          ].map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setTabs(item.id);
                item.action && item.action();
              }}
              className={`border-b-2 flex cursor-pointer items-center gap-2 w-full px-8 py-4 hover:bg-primary hover:text-white transition-all ${
                tabs === item.id ? "bg-primary text-white" : "text-black"
              }`}
            >
              {item.icon}
              <button className="ml-1">{item.label}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-2">
        {tabs === 0 && <Acount user={user} />}
        {tabs === 1 && <Password user={user} />}
        {tabs === 2 && <Order />}
        {tabs === 3 && (
          <Title className="text-[32px] md:text-[40px] text-primary font-bold font-dancing">
            Goodbye!
          </Title>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const data = await res.json();
    const user = data.find((u) => u.email === session.user.email);

    return {
      props: {
        user: user || null,
      },
    };
  } catch (error) {
    console.error("Kullanıcı bilgisi alınırken hata oluştu:", error);
    return {
      props: {
        user: null,
      },
    };
  }
}

export default Index;
