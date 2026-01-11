import {
  Users,
  Star,
  Award,
  Instagram,
  Linkedin,
  Facebook,
  Github,
  Mail,
  Globe,
  Link,
} from "lucide-react";
import { Button, Card } from "../../Components/index";
import { webTeam } from "../../lib/Data/TeamMembers";

const About = () => {
  return (
    <>
      <div className="min-h-screen">
        {/* HERO */}
        <section className="w-full bg-transparent mt-5 py-20 text-black text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold font-ubuntu">
            Career & Development Cell JGEC
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
                students and the industry. Our goal is to help students sharpen
                their technical, analytical, and interpersonal skills while
                connecting them with exciting career opportunities.
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
          {/* WEB TEAM SECTION */}
          <section className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Web Team
            </h2>

            <p className="text-center text-gray-600 max-w-xl mx-auto mb-16">
              Our Web Team brings the digital side of{" "}
              <strong>CDC-JGEC to life</strong> — designing, developing, and
              maintaining our online platforms with creativity and precision.
            </p>

            {webTeam.length !== 0 && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                {webTeam.map((member, i) => (
                  <div
                    key={i}
                    className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-60">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-0 left-0 bg-black/50 p-2 rounded-r-sm rounded-b-none">
                        <h3 className="text-amber-400 text-3xl font-bold font-cavet">
                          {member.name}
                        </h3>
                        <p className="text-white text-sm font-semibold -mt-1">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="p-5">
                      {member.description ? (
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                          {member.description}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          No description provided.
                        </p>
                      )}

                      {/* SOCIAL ICONS */}
                      <div className="flex gap-3 mt-5">
                        {/* LinkedIn */}
                        {member.socials?.linkedin && (
                          <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Linkedin size={20} className="text-blue-600" />
                          </a>
                        )}

                        {/* GitHub */}
                        {member.socials?.github && (
                          <a
                            href={member.socials.github}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Github size={20} className="text-gray-800" />
                          </a>
                        )}

                        {/* Portfolio */}
                        {member.socials?.portfolio && (
                          <a
                            href={member.socials.portfolio}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Globe size={20} className="text-blue-600" />
                          </a>
                        )}

                        {/* Facebook */}
                        {member.socials?.facebook && (
                          <a
                            href={member.socials.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Facebook size={20} className="text-blue-700" />
                          </a>
                        )}

                        {/* Instagram */}
                        {member.socials?.instagram && (
                          <a
                            href={member.socials.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Instagram size={20} className="text-pink-500" />
                          </a>
                        )}

                        {/* Mail */}
                        {member.socials?.email && (
                          <a
                            href={`mailto:${member.socials.email}`}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Mail size={20} className="text-red-500" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </>
  );
};

export default About;
