import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Feature from "./Feature";
import { useNavigate } from "react-router-dom";
import logo from "./assets/Version3.png";

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
  const [animatedTitle, setAnimatedTitle] = useState("");
  const fullText = "Join. Learn. Connect!";
  const titleText = "SEES";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SEES | Homepage";
  }, []);

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

  useEffect(() => {
    let titleIndex = 0;
    const titleInterval = setInterval(() => {
      if (titleIndex <= titleText.length) {
        setAnimatedTitle(titleText.slice(0, titleIndex));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
      }
    }, 300);
    return () => clearInterval(titleInterval);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50,
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="font-sans">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full py-4 px-8 flex justify-between items-center shadow-lg bg-black z-50 transition-all duration-300">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
        <div className="flex space-x-6">
          {["home", "features", "about", "support"].map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`relative px-4 py-2 transition-all duration-700 focus:outline-none ${
                activeSection === id
                  ? "text-blue-400 border-b-4 border-blue-400"
                  : "text-white border-b-4 border-transparent hover:border-white"
              }`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={() => navigate("/signout")}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mr-2 transition duration-300"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/auth?signup=true")}
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
      <h1 className="text-7xl font-extrabold tracking-wider drop-shadow-lg">
        {animatedTitle}
      </h1>
      <h2 className="text-5xl font-bold mt-4">{animatedText}</h2>
      <p className="mt-6 text-lg text-center max-w-2xl px-6">
        Empowering Connections & Knowledge <br />
        Where Innovation Meets Every Educational Event.
      </p>
    </section>


    {/* Features Section */}
    <section id="features" className="p-16 bg-gray-900 text-white text-center">
      <h2 className="text-3xl font-bold">Our Unique & Awesome Core Features</h2>

      {/* Top Row: 3 items */}
      <div className="grid grid-cols-3 gap-4 mt-8 max-w-6xl mx-auto">
        {[
          {
            image: "event.png",
            title: "Special events",
            description: "Discover a wide range of special events in different modes: online, in-person or hybrid.",
          },
          {
            image: "promotion.png",
            title: "Event Promotions",
            description: "Stay informed with the latest event updates and exclusive promotions tailored to your interests.",
          },
          {
            image: "discount.png",
            title: "Discounts & Free Access",
            description: "University students receive exclusive discounts and Concordia University students receive free access to attend events.",
          },
        ].map((feature, i) => (
          <Feature
            key={i}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      {/* Bottom Row: 2 items centered */}
      <div className="flex justify-center gap-4 mt-8 max-w-6xl mx-auto">
        {[
          {
            image: "chatroom.png",
            title: "Chatroom",
            description: "Connect with other attendees and speakers through our chatroom feature, fostering networking and collaboration.",
          },
          {
            image: "AI.png",
            title: "AI-Powered",
            description: "Leverage the power of AI to enhance your chatroom experience, providing summaries and insights from discussions.",
          },
        ].map((feature, i) => (
          <Feature
            key={i}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>



      {/* About Us Section */}
      <section id="about" className="relative p-16 pb-32 bg-gray-800 text-white text-center">
        <h2 className="text-3xl font-bold">About Us</h2>
        <h3 className="text-xl mt-4">We are a passionate team dedicated to providing innovative digital solutions.</h3>
        <div className="flex justify-center mt-8">
          <div className="relative z-10 w-full max-w-5xl mt-8">
            <Swiper
              modules={[Navigation]}
              navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              centeredSlides
              loop
              className="z-10"
            >
              {members.map((member, i) => (
                <SwiperSlide key={i}>
                  <div className="flex flex-col items-center p-8 transition-transform duration-300">
                    <img src={member.image} alt={member.name} className="w-64 h-80 object-cover object-top rounded-lg" />
                    <h3 className="text-2xl font-bold mt-4">{member.name}</h3>
                    <p className="text-lg italic">{member.role}</p>
                    <p className="mt-2 text-gray-400 text-center max-w-md">{member.description}</p>
                    <p className="text-blue-400 mt-2">{member.email}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="custom-prev absolute left-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition-all duration-300">
              ❮
            </button>
            <button className="custom-next absolute right-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition-all duration-300">
              ❯
            </button>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="flex-grow py-40 px-16 bg-gray-900 text-white text-center relative flex flex-col justify-center">
        <h2 className="text-3xl font-bold">Support</h2>
        <br /><br /><br />
        <table className="w-full max-w-4xl mx-auto">
          <tbody>
            <tr>
              <td className="w-3/4 text-left p-4">
                <h2 className="text-3xl font-bold">Need Any Help?</h2>
                <p className="mt-4 text-gray-400 max-w-lg">
                  Don't hesitate to communicate with our support team. We’ll get back to you within 48 hours.
                </p>
              </td>
              <td className="w-1/8 text-center p-4">
                <hr className="w-32 border-t-2 border-white mx-auto" />
              </td>
              <td className="w-1/8 text-right p-4">
                <span className="text-3xl font-bold text-white">info@sees.com</span>
              </td>
            </tr>
          </tbody>
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

      {/* Footer */}
      <footer className="bg-blue-500 py-4 text-black font-semibold text-sm w-full text-center">
        &copy; 2025 Startup. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;