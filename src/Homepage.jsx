import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Feature from "./Feature";
import { useNavigate } from "react-router-dom";

const members = [
    {
      image: "Fouad.jpg",
      name: "Fouad Meida",
      role: "Web developer",
      description: "Fouad is part of our frontend developer team, providing amazing and creative designs for the website.",
      email: "meidafouad24@gmail.com",
    },
    {
      image: "Rami.jpg",
      name: "Rami Al Najem",
      role: "Web developer",
      description: "Rami is part of our frontend developer team, providing amazing and creative designs for the website.",
      email: "alnajemrami@gmail.com",
    },
    {
      image: "Valentin.jpg",
      name: "Valentin Gornostaev",
      role: "Web developer",
      description: "Valentin is part of our backend developer team, providing useful and usable features for the website.",
      email: "gor.valentin1@gmail.com",
    },
    {
      image: "Steven.jpg",
      name: "Steven Gourgy",
      role: "Web developer",
      description: "Steven is part of our full-stack developer team, ensuring seamless integration and functionality across the website.",
      email: "stevengourgy@hotmail.com",
    },
    {
      image: "Kermina.jpg",
      name: "Kermina Sourial",
      role: "Web developer",
      description: "Kermina is part of our backend developer team, providing useful and usable features for the website.",
      email: "kerminasourial@gmail.com",
    },
  ];  

const Homepage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Digital Solutions for Your Business";
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "about", "support"];
      let currentSection = "home";
      
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setAnimatedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50,
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <div className="font-sans">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full py-4 px-8 flex justify-between items-center shadow-lg bg-black z-50 transition-all duration-300">
        <h1 className="text-2xl font-bold text-white">Logo</h1>
        <div className="flex space-x-6">
        {[
            { id: "home", label: "Home" },
            { id: "features", label: "Features" },
            { id: "about", label: "About Us" },
            { id: "support", label: "Support" }
            ].map((item) => (
            <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 transition-all duration-700 focus:outline-none 
                ${
                    activeSection === item.id 
                    ? "text-blue-400 border-b-4 border-blue-400"  // Keep blue when active
                    : "text-white border-b-4 border-transparent hover:border-white"
                }`}
            >
                {item.label}
            </button>
            ))}
        </div>
        <div>
            <button 
                onClick={() => navigate("/signout")} // Modify this route later
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mr-2 transition duration-300"
            >
                Sign In
            </button>

            <button 
                onClick={() => navigate("/auth")} // Modify this route later
                className="bg-white text-blue-900 hover:bg-gray-200 px-4 py-2 rounded transition duration-300"
            >
                Sign Up
            </button>
        </div>
        </nav>

      {/* Home Section */}
      <section 
        id="home" 
        className="text-white h-screen flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('Homepage.jpg')" }}
      >
        <h2 className="text-5xl font-bold">{animatedText}</h2>
        <p className="mt-4 text-lg">Handcrafted Tailwind CSS template for your startup, business, or SaaS website.</p>
      </section>
      
      {/* Features Section */}
      <section id="features" className="p-16 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold">Our Unique & Awesome Core Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 mt-8">
          <Feature image={null} title="Crafted for Startups" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          <Feature image={null} title="High-quality Design" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          <Feature image={null} title="All Essential Sections" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          <Feature image={null} title="Speed Optimized" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          <Feature image={null} title="Fully Customizable" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          <Feature image={null} title="Regular Updates" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
        </div>
      </section>
      
{/* About Us Section with Centralized Carousel */}
<section id="about" className="relative p-16 pb-32 bg-gray-800 text-white text-center">
      <h2 className="text-3xl font-bold">About Us</h2>
      <h3 className="text-xl mt-4">We are a passionate team dedicated to providing innovative digital solutions.</h3>

      {/* Carousel Wrapper - Centered */}
      <div className="flex justify-center mt-8">
        <div className="relative z-10 w-full max-w-5xl mt-8">
          <Swiper 
              modules={[Navigation]} 
              navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev"
              }} 
              spaceBetween={30} 
              slidesPerView={1} 
              breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
              }}
              centeredSlides 
              loop
              className="z-10"
          >
              {members.map((member, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col items-center p-8 transition-transform duration-300">
                    {member.image ? (
                        <img src={member.image} alt={member.name} className="w-64 h-80 object-cover object-top rounded-lg" />
                    ) : (
                      <div className="w-64 h-80 bg-gray-600 flex items-center justify-center rounded-lg text-white">No Image</div>
                    )}
                    <h3 className="text-2xl font-bold mt-4">{member.name}</h3>
                    <p className="text-lg italic">{member.role}</p>
                    <p className="mt-2 text-gray-400 text-center max-w-md">{member.description}</p>
                    <p className="text-blue-400 mt-2">{member.email}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons - Increased Spacing */}
            <button className="custom-prev absolute left-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition-all duration-300">
              ❮
            </button>
            <button className="custom-next absolute right-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition-all duration-300">
              ❯
            </button>
          </div>
        </div>
    </section>
      
    <div className="flex flex-col min-h-screen">
  {/* Support Section */}
  <section id="support" className="flex-grow py-40 px-16 bg-gray-900 text-white text-center relative flex flex-col justify-center">
    <h2 className="text-3xl font-bold">Support</h2> <br /><br /><br />
    <table className="w-full max-w-4xl mx-auto">
      <tr>
        {/* First Cell: Text Content - Made Wider */}
        <td className="w-3/4 text-left p-4">
          <h2 className="text-3xl font-bold">Need Any Help?</h2>
          <p className="mt-4 text-gray-400 max-w-lg">
            Don't hesitate to communicate with our support team. We’ll get back to you within 48 hours.
          </p>
        </td>

        {/* Second Cell: Divider Line - Shortened */}
        <td className="w-1/8 text-center p-4">
          <hr className="w-32 border-t-2 border-white mx-auto" />
        </td>

        {/* Third Cell: Email Address - Reduced Font Size */}
        <td className="w-1/8 text-right p-4">
          <span className="text-3xl font-bold text-white">info@websitename.com</span>
        </td>
      </tr>
    </table>

    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-16 text-left max-w-4xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold">Working Hours</h3>
        <p className="text-gray-400">Monday - Friday <br />9 AM - 6 AM (EST)</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Phone Number</h3>
        <p className="text-gray-400">+1 (514) 123-4567</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Office Location</h3>
        <p className="text-gray-400">1455 De Maisonneuve Blvd. W. <br />Montreal, QC <br />CANADA <br />H3G 1M8</p>
      </div>
    </div>
  </section>

  {/* Footer Stays at the Bottom */}
  <footer className="bg-blue-500 py-4 text-black font-semibold text-sm w-full text-center">
    &copy; 2025 Startup. All rights reserved.
  </footer>
</div>

    </div>
  );
};

export default Homepage;