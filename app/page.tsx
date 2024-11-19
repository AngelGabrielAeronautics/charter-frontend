"use client";

import ClientAppBar from "./components/ClientAppBar";
import FlightSearch from "./components/SearchBox/FlightSearch";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center bg-scroll p-24"
      style={{
        backgroundImage: `url('/images/bg1.png')`,
        backgroundSize: "cover",
      }}
    >
      <ClientAppBar />
      <div className="mb-28 mr-28 mt-32 h-full min-h-full self-end">
        <h1 className="text-white">LAUNCHING 2024!</h1>
        <p className="text-2xl text-white">
          Compare quotes from <br />
          multiple charter operators <br />
          with one simple request.
        </p>
      </div>
      <FlightSearch />
    </main>
  );
}
