import React from "react";
import { Users, Star, Award, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ViewersNav, Button, Card } from "../../Components/index";

const teamMembers = [
  {
    name: "John Doe",
    role: "President",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    description:
      "Coordinating events and ensuring smooth operations of all club activities.",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Alice",
    role: "SPOC",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Bob",
    role: "SPOC",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Bob",
    role: "SPOC",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Charlie",
    role: "TPO",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "David",
    role: "TPO",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "David",
    role: "TPO",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "David",
    role: "Web Team",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "David",
    role: "Web Team",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "David",
    role: "Web Team",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "David",
    role: "Web Team",
    image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
    socials: {
      linkedin: "https://linkedin.com",
      email: "mailto:john@gmail.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  },
];

const About = () => {
  return (
    <>
        <div className="min-h-screen">
          {/* HERO */}
          <section className="w-full bg-transparent mt-5 py-20 text-black text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold font-ubuntu">
              Carrier & Development Cell JGEC
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">
              Empowering students with opportunities, skill development, and
              industry exposure.
            </p>
          </section>

          {/* MISSION */}
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  The Career & Development Cell (CDC) of Jalpaiguri Government
                  Engineering College is dedicated to bridging the gap between
                  students and the industry. Our goal is to help students
                  sharpen their technical, analytical, and interpersonal skills
                  while connecting them with exciting career opportunities.
                </p>

                <Button
                  variant="primary"
                  size="md"
                  className="mt-6"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/showcase/career-development-cell-jgec/posts/?feedView=all"
                    )
                  }
                >
                  Learn More
                </Button>
              </div>

              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </section>

          {/* WHAT WE DO */}
          <section className="bg-gray-50 py-16 px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              What We Do
            </h2>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <Card
                title="Workshops & Seminars"
                icon={<Users />}
                description="Training sessions on aptitude, coding, soft skills, resume building, and interview preparation."
                variant="hover"
                round="lg"
                padding="p-6"
              />

              <Card
                title="Career Guidance"
                icon={<Award />}
                description="One-on-one mentorship and career counseling from industry experts and alumni."
                variant="hover"
                round="lg"
                padding="p-6"
              />

              <Card
                title="Industry Connect"
                icon={<Star />}
                description="Creating strong connections with companies, startups, and alumni for internships and placements."
                variant="hover"
                round="lg"
                padding="p-6"
              />
            </div>
          </section>

          {/* TEAM SECTION */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Meet Our Team
            </h2>

            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
              A passionate team dedicated to helping students grow, learn, and
              shape their careers.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* IMAGE + OVERLAY TEXT */}
                  <div className="relative w-full h-60">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />

                    {/* TEXT ON IMAGE */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold drop-shadow-lg">
                        {member.name}
                      </h3>
                      <p className="text-yellow-400 text-sm font-semibold drop-shadow-lg -mt-1">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPTION + SOCIALS */}
                  <div className="p-5">
                    {member.department && (
                      <p className="text-gray-500 text-xs tracking-wider">
                        {member.department.toUpperCase()}
                      </p>
                    )}

                    {member.description && (
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                        {member.description}
                      </p>
                    )}

                    {/* SOCIAL ICONS */}
                    <div className="flex gap-3 mt-5">
                      {member.socials?.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                            className="w-5 h-5"
                          />
                        </a>
                      )}

                      {member.socials?.email && (
                        <a
                          href={`mailto:${member.socials.email}`}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                            className="w-5 h-5"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TODO: What to do with the testimonials decided laters */}
        </div>
    </>
  );
};

export default About;
