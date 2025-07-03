import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";

const CampaignItem = ({ imageSrc, title, subtitle, title1 }) => {
  return (
    <div className="bg-secondary flex flex-col md:flex-row items-center rounded-lg p-5 gap-5 shadow-lg hover:shadow-xl transition-shadow">
      {/* Resim */}
      <div className="relative h-32 w-32 md:h-44 md:w-44 rounded-full border-[3px] md:border-[5px] border-primary overflow-hidden">
        <Image
          src={imageSrc}
          alt="Campaign"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="hover:scale-105 transition-transform object-cover"
          priority
        />
      </div>
      {/* Yazılar */}
      <div className="flex flex-col text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-bold font-dancing text-white">
          {title}
        </h3>
        <div className="flex items-center justify-center md:justify-start gap-2">
          <p className="text-lg md:text-xl text-primary font-semibold">
            {subtitle}
          </p>
          <p className="text-white text-xl font-dancing">{title1}</p>
        </div>
        <div className="mt-4">
          <button className="btn-primary flex items-center justify-center gap-2 px-6 py-2">
            Order Now
            <FaShoppingCart className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Campaigns = () => {
  return (
    <div className="container mx-auto py-[50px] md:py-[90px] px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CampaignItem
          imageSrc="/image/o1.jpg"
          title="Tasty Thursdays"
          subtitle="20%"
          title1="off"
        />
        <CampaignItem
          imageSrc="/image/o2.jpg"
          title="Weekend Feast"
          subtitle="15%"
          title1="off"
        />
      </div>
    </div>
  );
};

export default Campaigns;
