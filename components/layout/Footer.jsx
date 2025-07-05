import React, { useState, useEffect } from "react";
import Title from "../ui/Title";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaYoutubeSquare,
  FaPinterestSquare,
  FaSnapchatSquare,
  FaTiktok,
  FaWhatsappSquare,
  FaTelegramPlane,
  FaRedditSquare,
  FaDiscord,
  FaHome,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import {
  FaSquareTwitter,
  FaSquareInstagram,
  FaSquareFacebook,
  FaSquareYoutube,
  FaSquareSnapchat,
  FaSquareGithub,
  FaSquareWhatsapp,
} from "react-icons/fa6";
import axios from "axios";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default/fallback footer data
  const defaultFooterData = {
    location: "1234 Street, City, Country",
    phoneNumber: "123456789",
    email: "info@example.com",
    desc: "Necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with.",
    brandName: "Your Company",
    socialMedia: [
      { _id: 1, icon: "fab fa-facebook-f", link: "https://facebook.com" },
      { _id: 2, icon: "fab fa-twitter", link: "https://twitter.com" },
      { _id: 3, icon: "fab fa-instagram", link: "https://instagram.com" },
      { _id: 4, icon: "fab fa-linkedin", link: "https://linkedin.com" },
      { _id: 5, icon: "fab fa-youtube", link: "https://youtube.com" },
      { _id: 6, icon: "fab fa-tiktok", link: "https://tiktok.com" },
      { _id: 7, icon: "fab fa-whatsapp", link: "https://whatsapp.com" },
      { _id: 8, icon: "fas fa-home", link: "/" },
    ],
    openingHours: {
      day: "Monday - Sunday",
      hour: "10:00 AM - 10:00 PM",
    },
  };

  // API'den footer verilerini getir
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Fetching footer data...");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/footer`
        );

        console.log("✅ Footer data received:", response.data);

        if (response.data && response.data.length > 0) {
          const apiFooterData = response.data[0];

          const mergedData = {
            ...defaultFooterData,
            ...apiFooterData,
            socialMedia:
              apiFooterData.socialMedia && apiFooterData.socialMedia.length > 0
                ? apiFooterData.socialMedia.map((social, index) => ({
                    _id: social._id || index + 1,
                    icon: social.icon || "fab fa-facebook-f",
                    link: social.link || "#",
                    // API'den gelen ek alanlar
                    title: social.title || "",
                    platform: social.platform || "",
                    isActive:
                      social.isActive !== undefined ? social.isActive : true,
                  }))
                : defaultFooterData.socialMedia,
            openingHours:
              apiFooterData.openingHours || defaultFooterData.openingHours,
          };

          setFooterData(mergedData);
        } else {
          console.log("⚠️ No footer data from API, using default data");
          setFooterData(defaultFooterData);
        }
      } catch (err) {
        console.error("❌ Error fetching footer data:", err);
        setError(err.message);
        setFooterData(defaultFooterData);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Generate Google Maps URL
  const generateMapUrl = (location) => {
    if (!location) return "#";
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  // Handle location click
  const handleLocationClick = (location) => {
    const mapUrl = generateMapUrl(location);
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  // Geliştirilmiş Icon mapping fonksiyonu - API'den gelen icon verilerini destekler
  const getIconComponent = (iconData) => {
    // iconData string veya object olabilir
    let iconClass = "";
    let platformName = "";

    if (typeof iconData === "string") {
      iconClass = iconData;
    } else if (typeof iconData === "object" && iconData !== null) {
      iconClass = iconData.icon || iconData.className || "";
      platformName = iconData.platform || iconData.name || "";
    }

    // Önce tam eşleşme kontrolü
    const exactIconMap = {
      "fab fa-facebook-f": FaFacebookSquare,
      "fab fa-facebook": FaFacebookSquare,
      "fab fa-facebook-square": FaSquareFacebook,
      "fas fa-facebook": FaFacebookSquare,
      "fab fa-twitter": FaSquareTwitter,
      "fab fa-twitter-square": FaSquareTwitter,
      "fas fa-twitter": FaTwitterSquare,
      "fab fa-instagram": FaInstagramSquare,
      "fab fa-instagram-square": FaSquareInstagram,
      "fas fa-instagram": FaInstagramSquare,
      "fab fa-linkedin": FaLinkedin,
      "fab fa-linkedin-in": FaLinkedin,
      "fas fa-linkedin": FaLinkedin,
      "fab fa-youtube": FaYoutubeSquare,
      "fab fa-youtube-square": FaSquareYoutube,
      "fas fa-youtube": FaYoutubeSquare,
      "fab fa-pinterest": FaPinterestSquare,
      "fab fa-pinterest-square": FaPinterestSquare,
      "fas fa-pinterest": FaPinterestSquare,
      "fab fa-snapchat": FaSnapchatSquare,
      "fab fa-snapchat-square": FaSquareSnapchat,
      "fas fa-snapchat": FaSnapchatSquare,
      "fab fa-tiktok": FaTiktok,
      "fas fa-tiktok": FaTiktok,
      "fab fa-whatsapp": FaWhatsappSquare,
      "fab fa-whatsapp-square": FaSquareWhatsapp,
      "fas fa-whatsapp": FaWhatsappSquare,
      "fab fa-telegram": FaTelegramPlane,
      "fab fa-telegram-plane": FaTelegramPlane,
      "fas fa-telegram": FaTelegramPlane,
      "fab fa-reddit": FaRedditSquare,
      "fab fa-reddit-square": FaRedditSquare,
      "fas fa-reddit": FaRedditSquare,
      "fab fa-discord": FaDiscord,
      "fas fa-discord": FaDiscord,
      "fab fa-github": FaSquareGithub,
      "fab fa-github-square": FaSquareGithub,
      "fas fa-github": FaSquareGithub,
      "fas fa-home": FaHome,
      "fa fa-home": FaHome,
      "fas fa-user": FaUser,
      "fa fa-user": FaUser,
      "fas fa-envelope": FaEnvelope,
      "fa fa-envelope": FaEnvelope,
      // Ek icon eşleştirmeleri
      "fab fa-x-twitter": FaSquareTwitter,
      "fab fa-twitter-x": FaSquareTwitter,
      "fab fa-meta": FaFacebookSquare,
      "fab fa-gmail": FaEnvelope,
      "fab fa-google": FaEnvelope,
    };

    // Tam eşleşme varsa döndür
    if (exactIconMap[iconClass]) {
      return exactIconMap[iconClass];
    }

    // Platform name ile kontrol et
    if (platformName) {
      const platformLower = platformName.toLowerCase();
      const platformMap = {
        facebook: FaFacebookSquare,
        twitter: FaSquareTwitter,
        instagram: FaInstagramSquare,
        linkedin: FaLinkedin,
        youtube: FaYoutubeSquare,
        pinterest: FaPinterestSquare,
        snapchat: FaSnapchatSquare,
        tiktok: FaTiktok,
        whatsapp: FaWhatsappSquare,
        telegram: FaTelegramPlane,
        reddit: FaRedditSquare,
        discord: FaDiscord,
        github: FaSquareGithub,
        home: FaHome,
        user: FaUser,
        email: FaEnvelope,
        mail: FaEnvelope,
        envelope: FaEnvelope,
      };

      if (platformMap[platformLower]) {
        return platformMap[platformLower];
      }
    }

    // Kısmi eşleşme kontrolü
    const lowerIcon = iconClass.toLowerCase();
    const partialMatches = {
      facebook: FaFacebookSquare,
      twitter: FaSquareTwitter,
      instagram: FaInstagramSquare,
      linkedin: FaLinkedin,
      youtube: FaYoutubeSquare,
      pinterest: FaPinterestSquare,
      snapchat: FaSnapchatSquare,
      tiktok: FaTiktok,
      whatsapp: FaWhatsappSquare,
      telegram: FaTelegramPlane,
      reddit: FaRedditSquare,
      discord: FaDiscord,
      github: FaSquareGithub,
      home: FaHome,
      user: FaUser,
      envelope: FaEnvelope,
      mail: FaEnvelope,
      gmail: FaEnvelope,
      google: FaEnvelope,
    };

    for (const [platform, IconComponent] of Object.entries(partialMatches)) {
      if (lowerIcon.includes(platform)) {
        return IconComponent;
      }
    }

    // Hiçbir eşleşme bulunamazsa varsayılan icon
    console.warn(
      `Icon not found for: ${iconClass} (platform: ${platformName})`
    );
    return FaFacebookSquare;
  };

  // Geliştirilmiş hover color fonksiyonu
  const getHoverColor = (iconData) => {
    let iconClass = "";
    let platformName = "";

    if (typeof iconData === "string") {
      iconClass = iconData;
    } else if (typeof iconData === "object" && iconData !== null) {
      iconClass = iconData.icon || iconData.className || "";
      platformName = iconData.platform || iconData.name || "";
    }

    const lowerIcon = iconClass.toLowerCase();
    const lowerPlatform = platformName.toLowerCase();

    const colorMap = {
      facebook: "group-hover:text-blue-500 hover:shadow-blue-500/30",
      twitter: "group-hover:text-blue-400 hover:shadow-blue-400/30",
      instagram: "group-hover:text-pink-500 hover:shadow-pink-500/30",
      linkedin: "group-hover:text-blue-600 hover:shadow-blue-600/30",
      youtube: "group-hover:text-red-500 hover:shadow-red-500/30",
      pinterest: "group-hover:text-red-500 hover:shadow-red-500/30",
      snapchat: "group-hover:text-yellow-400 hover:shadow-yellow-400/30",
      tiktok: "group-hover:text-pink-400 hover:shadow-pink-400/30",
      whatsapp: "group-hover:text-green-500 hover:shadow-green-500/30",
      telegram: "group-hover:text-blue-400 hover:shadow-blue-400/30",
      reddit: "group-hover:text-orange-500 hover:shadow-orange-500/30",
      discord: "group-hover:text-purple-500 hover:shadow-purple-500/30",
      github: "group-hover:text-gray-300 hover:shadow-gray-300/30",
      home: "group-hover:text-blue-500 hover:shadow-blue-500/30",
      user: "group-hover:text-green-500 hover:shadow-green-500/30",
      envelope: "group-hover:text-blue-500 hover:shadow-blue-500/30",
      mail: "group-hover:text-blue-500 hover:shadow-blue-500/30",
      gmail: "group-hover:text-red-400 hover:shadow-red-400/30",
      google: "group-hover:text-blue-500 hover:shadow-blue-500/30",
    };

    // Platform name ile kontrol et
    if (lowerPlatform && colorMap[lowerPlatform]) {
      return colorMap[lowerPlatform];
    }

    // Icon class ile kontrol et
    for (const [platform, color] of Object.entries(colorMap)) {
      if (lowerIcon.includes(platform)) {
        return color;
      }
    }

    return "group-hover:text-blue-500 hover:shadow-blue-500/30";
  };

  // Platform adını güzelleştir
  const getPlatformTitle = (iconData) => {
    let iconClass = "";
    let platformName = "";
    let customTitle = "";

    if (typeof iconData === "string") {
      iconClass = iconData;
    } else if (typeof iconData === "object" && iconData !== null) {
      iconClass = iconData.icon || iconData.className || "";
      platformName = iconData.platform || iconData.name || "";
      customTitle = iconData.title || "";
    }

    if (customTitle) return customTitle;
    if (platformName) return `Visit our ${platformName}`;

    // Icon class'tan platform adını çıkar
    const lowerIcon = iconClass.toLowerCase();
    const platformNames = {
      facebook: "Facebook",
      twitter: "Twitter",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      tiktok: "TikTok",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      reddit: "Reddit",
      discord: "Discord",
      github: "GitHub",
      home: "Home",
      user: "Profile",
      envelope: "Email",
      mail: "Email",
      gmail: "Gmail",
    };

    for (const [platform, name] of Object.entries(platformNames)) {
      if (lowerIcon.includes(platform)) {
        return `Visit our ${name}`;
      }
    }

    return "Visit our page";
  };

  // Loading state
  if (loading) {
    return (
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto pt-16 pb-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-6">
                <div className="h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg w-40 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg w-3/4 animate-pulse delay-200"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg w-1/2 animate-pulse delay-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  // Error state
  if (error && !footerData) {
    return (
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
        <div className="container mx-auto pt-16 pb-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-3"></div>
              <p className="text-sm">
                Unable to load footer data. Using default information.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Use footerData
  const data = footerData || defaultFooterData;

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto pt-20 pb-8 md:pt-16 md:pb-6 sm:pt-12 sm:pb-4 relative z-10 px-4">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-8 sm:gap-6 text-center lg:text-left">
          {/* Contact Us Section */}
          <div className="space-y-6 group">
            <div className="relative">
              <Title className="font-dancing text-4xl md:text-3xl sm:text-2xl text-transparent bg-gradient-to-r from-primary to-blue-400 bg-clip-text mb-6 relative inline-block">
                Contact Us
                <div className="absolute -bottom-3 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-16 h-1 bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                <div className="absolute -bottom-4 left-1/2 lg:left-2 transform -translate-x-1/2 lg:translate-x-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              </Title>
            </div>

            <div className="space-y-4">
              {/* Location */}
              <div className="w-full">
                <button
                  onClick={() => handleLocationClick(data.location)}
                  className="w-full lg:w-auto inline-flex items-start lg:items-center gap-3 text-sm sm:text-xs group/item hover:text-primary transition-all duration-500 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-primary/10 cursor-pointer text-left"
                  title="Click to open in Google Maps"
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 mt-1 lg:mt-0">
                    <FaLocationDot className="text-base sm:text-lg text-primary group-hover/item:text-white transition-colors" />
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors leading-relaxed break-words max-w-full">
                    {data.location}
                  </span>
                </button>
              </div>

              {/* Phone */}
              <div className="w-full">
                <a
                  href={`tel:+90${data.phoneNumber}`}
                  className="w-full lg:w-auto inline-flex items-center gap-3 text-sm sm:text-xs group/item hover:text-primary transition-all duration-500 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <FaPhoneAlt className="text-base sm:text-lg text-green-400 group-hover/item:text-white transition-colors" />
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors">
                    +90 {data.phoneNumber}
                  </span>
                </a>
              </div>

              {/* Email */}
              <div className="w-full">
                <a
                  href={`mailto:${data.email}`}
                  className="w-full lg:w-auto inline-flex items-center gap-3 text-sm sm:text-xs group/item hover:text-primary transition-all duration-500 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 backdrop-blur-sm border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <IoMail className="text-base sm:text-lg text-blue-400 group-hover/item:text-white transition-colors" />
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors break-all">
                    {data.email}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* About Us Section */}
          <div className="space-y-6">
            <div className="relative">
              <Title className="font-dancing text-4xl md:text-3xl sm:text-2xl text-transparent bg-gradient-to-r from-primary to-purple-400 bg-clip-text mb-6 relative inline-block">
                About Us
                <div className="absolute -bottom-3 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-16 h-1 bg-gradient-to-r from-primary to-purple-400 rounded-full"></div>
                <div className="absolute -bottom-4 left-1/2 lg:left-2 transform -translate-x-1/2 lg:translate-x-0 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </Title>
            </div>

            <div className="relative">
              <p className="text-sm sm:text-xs leading-relaxed text-gray-300 max-w-md mx-auto lg:mx-0 relative z-10 p-4 sm:p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-lg">
                {data.desc}
              </p>
            </div>

            {/* Social Media Icons - Geliştirilmiş API desteği */}
            <div className="flex justify-center lg:justify-start gap-2 sm:gap-3 pt-4 flex-wrap">
              {data.socialMedia &&
                data.socialMedia
                  .filter((social) => social.isActive !== false) // Aktif olmayan iconları filtrele
                  .map((social) => {
                    const IconComponent = getIconComponent(social);
                    const hoverColor = getHoverColor(social);
                    const title = getPlatformTitle(social);

                    return (
                      <a
                        key={social._id}
                        href={social.link}
                        target="_blank"
                        rel="noreferrer"
                        className={`group relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-xl ${hoverColor}`}
                        title={title}
                      >
                        <IconComponent className="text-xl sm:text-2xl text-gray-400 transition-all duration-300 group-hover:drop-shadow-lg" />

                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10 bg-current"></div>
                      </a>
                    );
                  })}
            </div>
          </div>

          {/* Opening Hours Section */}
          <div className="space-y-6">
            <div className="relative">
              <Title className="font-dancing text-4xl md:text-3xl sm:text-2xl text-transparent bg-gradient-to-r from-primary to-emerald-400 bg-clip-text mb-6 relative inline-block">
                Opening Hours
                <div className="absolute -bottom-3 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-16 h-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full"></div>
                <div className="absolute -bottom-4 left-1/2 lg:left-2 transform -translate-x-1/2 lg:translate-x-0 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              </Title>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 text-sm sm:text-xs p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 shadow-lg">
                <div className="relative flex-shrink-0">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-25"></div>
                </div>
                <span className="text-gray-200 font-medium">
                  {data.openingHours?.day || "Monday - Sunday"}
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 text-sm sm:text-xs p-3 sm:p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 shadow-lg">
                <div className="relative flex-shrink-0">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-25"></div>
                </div>
                <span className="text-white font-semibold">
                  {data.openingHours?.hour || "10:00 AM - 10:00 PM"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Bottom */}
        <div className="mt-16 md:mt-12 sm:mt-10 pt-8 border-t border-gradient-to-r from-transparent via-gray-600/50 to-transparent relative">
          {/* Subtle glow line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm sm:text-xs text-gray-400 flex items-center space-x-2 text-center md:text-left">
              <span>© {new Date().getFullYear()} All Rights Reserved By</span>
              <span className="text-transparent bg-gradient-to-r from-primary to-blue-400 bg-clip-text font-semibold">
                {data.brandName || "Your Company"}
              </span>
            </p>

            <div className="flex items-center space-x-4 sm:space-x-6 text-xs flex-wrap justify-center">
              <a
                href="#"
                className="text-gray-500 hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                Privacy Policy
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
              <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>
              <a
                href="#"
                className="text-gray-500 hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                Terms of Service
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
              <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>
              <a
                href="#"
                className="text-gray-500 hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                Support
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
