import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  // Using a placeholder aesthetic background if you don't have one ready.
  // Replace with your actual image path.
  const bgImageUrl = "/images/bg.png";
  // const avatarUrl = "/images/avatar.png"; // Use a real avatar image here if you have one

  return (
    // Changed base bg to dark for a premium feel that contrasts the glass nav
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans relative text-white overflow-hidden">
      <Navbar />

      {/* Background Image Layer with Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={bgImageUrl}
          alt="Background Texture"
          fill
          className="object-cover opacity-40 grayscale blur-sm scale-105"
          priority
        />
        {/* Gradient Overlay to ensure text readability and fade to black bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/90 to-neutral-950"></div>
      </div>

      <main
        // Added pt-32 to push content down below the floating navbar
        className="flex-grow flex flex-col items-center justify-center px-6 relative z-10 pt-32 pb-20 text-center"
      >
        {/* Avatar / Small Image */}
        {/* Redesigned: Removed thick border, added subtle glowing shadow */}
        <div className="relative w-36 h-36 mb-8 rounded-full overflow-hidden ring-4 ring-neutral-800/50 shadow-2xl shadow-blue-500/20 animate-fade-in">
          <Image
            src={bgImageUrl} // Replace with your actual avatar image
            alt="Prakash L Waddar"
            fill
            className="object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="max-w-3xl space-y-8 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Prakash L Waddar
          </h1>

          {/* Main Tagline with Gradient Text Trend */}
          <p className="text-xl md:text-3xl text-neutral-300 font-medium leading-relaxed">
            Exploring the intersection of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-bold">
              systems design
            </span>{" "}
            and{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-bold">
              software development
            </span>
            .
          </p>

          {/* Secondary Bio Text - Removed separator line for cleaner typography */}
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed font-light">
            I build software and write about it. This website is a collection of
            my engineering logs, tutorials, and personal experiments.
          </p>

          {/* Optional CTA Buttons (Trending addition for Hero sections) */}
          <div className="flex gap-4 justify-center pt-4">
            <button className="px-6 py-2.5 rounded-full bg-white text-neutral-950 font-medium text-sm hover:bg-neutral-200 transition-colors">
              Read my logs
            </button>
            <button className="px-6 py-2.5 rounded-full bg-neutral-800 text-white font-medium text-sm border border-neutral-700 hover:bg-neutral-700 transition-colors">
              About me
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
