import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AboutSection } from "@/components/home/about-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { FAQSection } from "@/components/home/faq-section";
import { FinalCTA } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { TopicsSection } from "@/components/home/topics-section";
export default function Home() { return <><AnnouncementBar /><Header /><main><Hero /><BenefitsSection /><TopicsSection /><AboutSection /><FAQSection /><FinalCTA /></main><Footer /></>; }
