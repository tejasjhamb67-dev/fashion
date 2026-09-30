import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Intro } from "@/components/home/Intro";
import { Signature } from "@/components/home/Signature";
import { Departments } from "@/components/home/Departments";
import { Bestsellers } from "@/components/home/Bestsellers";
import { StoreFilm } from "@/components/home/StoreFilm";
import { Lookbook } from "@/components/home/Lookbook";
import { Craft } from "@/components/home/Craft";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <Signature />
      <Departments />
      <Bestsellers />
      <StoreFilm />
      <Lookbook />
      <Craft />
    </>
  );
}
