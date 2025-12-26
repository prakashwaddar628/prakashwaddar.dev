import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";

export default function Home() {
  const bgImageUrl = "/images/bg.png";
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main
        style={{ backgroundImage: `url(${bgImageUrl})` }}
        className="flex-grow flex flex-col items-center justify-center px-4 py-20"
      >
        {/* Avatar / Small Image */}
        <div
          className="relative w-32 h-32 mb-8 
        rounded-full overflow-hidden border-4 
        border-gray-600 shadow-lg"
        >
          <Image
            src="/images/bg.png"
            alt="Prakash L Waddar"
            fill
            className="object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-100">
            Prakash L Waddar
          </h1>

          <p className="text-xl text-neutral-300 leading-relaxed">
            Exploring the intersection of{" "}
            <span className="text-blue-400">systems design</span> and{" "}
            <span className="text-blue-400">software development</span>.
          </p>

          <div className="h-px w-24 bg-neutral-300 mx-auto my-8"></div>

          <p className="text-neutral-600">
            I build software and write about it. This website is a collection of
            my engineering logs, tutorials, and personal experiments.
          </p>
        </div>
      </main>
    </div>
  );
}
