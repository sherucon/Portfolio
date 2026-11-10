import Work from "../components/work";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shreyansh | Work",
  description: "Projects and selected works by Shreyansh Singh.",
};

export default function Page() {
  return <Work />;
}
