import About from "../components/about";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shreyansh | About",
  description:
    "Learn more about Shreyansh Singh, a software engineer and designer.",
};

export default function Page() {
  return <About />;
}
