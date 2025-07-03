import React, { useState } from "react";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { FaDiscord, FaTrash, FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import LoginInput from "../form/LoginInput";

const AddIcon = () => {
  const [icons, setIcons] = useState([
    {
      id: 1,
      icon: <RiInstagramFill className="text-[22px]" />,
      name: "Instagram",
    },
    {
      id: 2,
      icon: <IoLogoFacebook className="text-[22px]" />,
      name: "Facebook",
    },
    { id: 3, icon: <FaDiscord className="text-[22px]" />, name: "Discord" },
    { id: 4, icon: <FaTwitter className="text-[22px]" />, name: "Twitter" },
  ]);
  const [newLink, setNewLink] = useState("");
  const [newIcon, setNewIcon] = useState("");

  // Yeni ikon ekleme fonksiyonu
  const addIcon = () => {
    try {
      const IconComponent = require("react-icons")[newIcon]; // İkonu dinamik olarak alıyoruz
      if (!IconComponent) {
        alert("Invalid icon name. Please check the React Icons library.");
        return;
      }

      setIcons((prevIcons) => [
        ...prevIcons,
        {
          id: icons.length + 1,
          icon: <IconComponent className="text-[22px]" />,
          name: newLink || "New Icon",
        },
      ]);

      setNewLink(""); // Giriş alanını temizle
      setNewIcon(""); // Giriş alanını temizle
    } catch (error) {
      alert("An error occurred while adding the icon. Check the icon name.");
    }
  };

  // İkon silme fonksiyonu
  const removeIcon = (id) => {
    setIcons((prevIcons) => prevIcons.filter((icon) => icon.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-[32px] md:text-[40px] text-primary font-bold font-dancing">
        Footer Information
      </h1>

      {/* Yeni ikon ekleme */}
      <div className="flex flex-col lg:flex-row gap-6 items-center mt-6">
        {/* Inputlar ve Buton */}
        <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center w-full">
          <LoginInput
            placeholder="Link Address"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <LoginInput
            placeholder="Icon Name (e.g., FaTwitter)"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
          />
          <button
            type="button" // Burada `type="button"` ekleniyor
            onClick={addIcon}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition"
          >
            Add
          </button>
        </div>

        {/* İkonlar */}
        <ul className="flex flex-wrap lg:flex-nowrap gap-4 items-center mt-4 lg:mt-0">
          {icons.map(({ id, icon, name }) => (
            <li key={id} className="flex items-center gap-2">
              {icon}
              <button
                type="button" // Burada da eklenebilir, ancak gerek yok çünkü bu zaten sadece işlem yapıyor
                onClick={() => removeIcon(id)}
                aria-label={`Delete ${name}`}
                className="text-red-600 text-[13px] transition-all hover:scale-125 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddIcon;
