import React, { useState } from "react";

// Mock Components
const Title = ({ children, className }) => (
  <h1 className={className}>{children}</h1>
);

// Mock Icons
const FaClock = ({ className }) => <span className={className}>🕒</span>;
const FaMapMarkerAlt = ({ className }) => <span className={className}>📍</span>;
const FaPhone = ({ className }) => <span className={className}>📞</span>;
const FaEnvelope = ({ className }) => <span className={className}>📧</span>;
const FaHeart = ({ className }) => <span className={className}>❤️</span>;
const FaStar = ({ className }) => <span className={className}>⭐</span>;
const FaQuoteLeft = ({ className }) => <span className={className}>❝</span>;

const About = () => {
  const [activeTab, setActiveTab] = useState("story");

  const stats = [
    { number: "15+", label: "Yıllık Deneyim", icon: "🏆" },
    { number: "50K+", label: "Mutlu Müşteri", icon: "😊" },
    { number: "100+", label: "Pizza Çeşidi", icon: "🍕" },
    { number: "24/7", label: "Hizmet", icon: "⏰" },
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Baş Aşçı & Kurucu",
      description: "15+ yıllık İtalyan mutfağı deneyimi",
      image: "👨‍🍳",
      specialty: "Geleneksel İtalyan Pizzaları",
    },
    {
      name: "Maria Rossi",
      role: "Pizza Ustası",
      description: "Napoli'den gelen otantik tarifler",
      image: "👩‍🍳",
      specialty: "Hamur Teknikleri",
    },
    {
      name: "Mehmet Demir",
      role: "Mutfak Şefi",
      description: "Yaratıcı pizza tarifleri geliştirici",
      image: "👨‍🍳",
      specialty: "Fusion Pizza Tarifleri",
    },
  ];

  const testimonials = [
    {
      name: "Ayşe K.",
      comment:
        "PizzaHub'ın pizzaları gerçekten muhteşem! Özellikle Margherita pizza favorim.",
      rating: 5,
      location: "İstanbul",
    },
    {
      name: "Can M.",
      comment:
        "Hızlı teslimat ve lezzetli pizzalar. Ailecek tercih ettiğimiz mekan.",
      rating: 5,
      location: "Ankara",
    },
    {
      name: "Zeynep T.",
      comment:
        "Vegan seçenekleri de var, herkese hitap ediyor. Teşekkürler PizzaHub!",
      rating: 5,
      location: "İzmir",
    },
  ];

  const values = [
    {
      icon: "🌿",
      title: "Doğal Malzemeler",
      description: "Sadece en taze ve doğal malzemeleri kullanıyoruz",
    },
    {
      icon: "🔥",
      title: "Geleneksel Fırın",
      description: "Pizzalarımızı geleneksel taş fırında pişiriyoruz",
    },
    {
      icon: "⚡",
      title: "Hızlı Teslimat",
      description: "30 dakikada sıcacık pizza kapınızda",
    },
    {
      icon: "💝",
      title: "Müşteri Memnuniyeti",
      description: "Müşteri memnuniyeti bizim için her şeyden önemli",
    },
  ];

  const tabData = [
    { id: "story", label: "Hikayemiz", icon: "📖" },
    { id: "team", label: "Ekibimiz", icon: "👥" },
    { id: "values", label: "Değerlerimiz", icon: "💎" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="mb-6 animate-bounce">
            <span className="text-6xl drop-shadow-lg">🍕</span>
          </div>
          <Title className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            PizzaHub Hakkında
          </Title>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            2008'den beri Türkiye'nin en lezzetli pizzalarını sizlere sunuyoruz.
            Geleneksel İtalyan lezzetleri ile modern dokunuşları harmanlıyoruz.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6 mb-4 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 border border-primary/10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 scale-105"
                    : "bg-white text-gray-600 hover:bg-primary/5 hover:text-primary shadow-md hover:shadow-lg"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {/* Story Tab */}
            {activeTab === "story" && (
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-primary/10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                      Lezzet Yolculuğumuz
                    </h2>
                    <div className="space-y-6 text-gray-600 leading-relaxed">
                      <p>
                        PizzaHub'ın hikayesi 2008 yılında İstanbul'un kalbinde,
                        pizza tutkunu bir ailenin hayaliyle başladı. Ahmet
                        Usta'nın İtalya'da öğrendiği geleneksel pizza yapım
                        teknikleri, bu hikayenin temelini oluşturdu.
                      </p>
                      <p>
                        İlk günden bu yana amacımız, sadece en kaliteli
                        malzemeleri kullanarak, her lokmada İtalya'nın sıcacık
                        atmosferini hissettirmek oldu. Geleneksel taş
                        fırınımızda pişen pizzalarımız, binlerce ailenin
                        sofrasına lezzet getirdi.
                      </p>
                      <p>
                        Bugün 15+ yıllık deneyimimizle, Türkiye'nin dört bir
                        yanında 50.000'den fazla mutlu müşterimize hizmet
                        vermenin gururunu yaşıyoruz.
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl p-8 border border-primary/20">
                      <div className="text-8xl mb-4 animate-pulse">🏪</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        İlk Dükkanımız
                      </h3>
                      <p className="text-gray-600">2008 - İstanbul Beyoğlu</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === "team" && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Uzman Ekibimiz
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Lezzet ustalarımız, yılların deneyimi ile sizlere en iyi
                    pizzaları sunuyor
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {team.map((member, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 border border-primary/10 group hover:scale-105"
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {member.image}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary font-semibold mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 mb-4">{member.description}</p>
                      <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10">
                        <p className="text-sm text-primary font-medium">
                          <span className="text-primary">🎯</span>{" "}
                          {member.specialty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Values Tab */}
            {activeTab === "values" && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Değerlerimiz
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Kaliteyi ve müşteri memnuniyetini her şeyin üstünde
                    tutuyoruz
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-primary/10 group hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-4 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                          {value.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            {value.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gradient-to-br from-primary/10 to-primary/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-gray-600 text-lg">
              Binlerce mutlu müşterimizden bazı yorumlar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-primary/10 group hover:scale-105"
              >
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                    />
                  ))}
                </div>
                <FaQuoteLeft className="text-primary/30 text-2xl mb-4" />
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="border-t border-primary/10 pt-4">
                  <p className="font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="py-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bize Ulaşın
            </h2>
            <p className="text-gray-600 text-lg">
              Sorularınız için bizimle iletişime geçin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10 group hover:scale-105 transition-all duration-300">
              <FaMapMarkerAlt className="text-4xl text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold text-gray-800 mb-2">Adres</h3>
              <p className="text-gray-600">
                Atatürk Cad. No:123
                <br />
                Kadıköy, İstanbul
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10 group hover:scale-105 transition-all duration-300">
              <FaPhone className="text-4xl text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold text-gray-800 mb-2">Telefon</h3>
              <p className="text-gray-600">
                +90 212 123 45 67
                <br />
                +90 212 123 45 68
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10 group hover:scale-105 transition-all duration-300">
              <FaEnvelope className="text-4xl text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold text-gray-800 mb-2">E-posta</h3>
              <p className="text-gray-600">
                info@pizzahub.com
                <br />
                siparis@pizzahub.com
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10 group hover:scale-105 transition-all duration-300">
              <FaClock className="text-4xl text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold text-gray-800 mb-2">Çalışma Saatleri</h3>
              <p className="text-gray-600">
                Her gün
                <br />
                10:00 - 24:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <FaHeart className="text-5xl mx-auto mb-6 animate-pulse drop-shadow-lg" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
            PizzaHub Ailesine Katılın!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            En taze malzemelerle hazırlanan lezzetli pizzalarımızı denemeye
            hazır mısınız?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              🍕 Menüyü İncele
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              📞 Hemen Ara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;