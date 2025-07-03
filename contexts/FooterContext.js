// contexts/FooterContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FooterContext = createContext();

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error("useFooter must be used within a FooterProvider");
  }
  return context;
};

export const FooterProvider = ({ children }) => {
  const [footer, setFooter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Footer verilerini API'den çekme
  const fetchFooterData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/footer`);
      setFooter(res.data[0] || {});
    } catch (err) {
      console.error("Footer data fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Footer güncelleme fonksiyonu
  const updateFooter = async (footerId, updatedData) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/footer/${footerId}`,
        updatedData
      );

      if (res.status === 200) {
        setFooter(res.data);
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.error("Footer update error:", err);
      return { success: false, error: err.message };
    }
  };

  // Sosyal medya linklerini güncelleme
  const updateSocialMedia = async (newSocialMediaLinks) => {
    if (!footer._id) return { success: false, error: "Footer ID not found" };

    const updatedFooterData = {
      location: footer.location,
      email: footer.email,
      phoneNumber: footer.phoneNumber,
      desc: footer.desc,
      openingHours: footer.openingHours,
      socialMedia: newSocialMediaLinks,
    };

    return await updateFooter(footer._id, updatedFooterData);
  };

  // Global güncelleme tetikleyicisi
  const triggerFooterUpdate = () => {
    localStorage.setItem("footerUpdated", Date.now().toString());
    const event = new CustomEvent("footerUpdated");
    window.dispatchEvent(event);
    fetchFooterData();
  };

  // Component mount olduğunda footer verilerini çek
  useEffect(() => {
    fetchFooterData();
  }, []);

  // Cross-tab güncellemeleri dinle
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "footerUpdated") {
        fetchFooterData();
      }
    };

    const handleCustomFooterUpdate = () => {
      fetchFooterData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("footerUpdated", handleCustomFooterUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("footerUpdated", handleCustomFooterUpdate);
    };
  }, []);

  const value = {
    footer,
    loading,
    error,
    fetchFooterData,
    updateFooter,
    updateSocialMedia,
    triggerFooterUpdate,
  };

  return (
    <FooterContext.Provider value={value}>{children}</FooterContext.Provider>
  );
};
