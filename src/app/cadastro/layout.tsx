import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return <><AnnouncementBar /><Header />{children}<Footer /></>;
}
