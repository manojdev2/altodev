import HeroSection from "./components/herosec";
import FeaturesSection from "./components/features";
import HowItWorksSection from "./components/howitworks";
import WhyChooseUs from "./components/whychooseus";
import Testimonials from "./components/testimonial";
import FAQ from "./components/faq";
import Download from "./components/download";
import Contact from "./components/contact";
import Footer from "./components/footer";
import AppExperienceSection from "./components/appexperience";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyChooseUs />
      <AppExperienceSection />
      <Testimonials />
       <Download />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}
