"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Preloader from "@/components/preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <Preloader onComplete={() => setIsLoading(false)} />
      {!isLoading && (
        <div>
          <Navbar />
          <Hero />
        </div>
      )}
    </div>
  );
}
