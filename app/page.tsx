import ClientAppBar from "./components/ClientAppBar";
import FlightSearch from "./components/SearchBox/FlightSearch";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center px-24 pb-24 pt-12">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 w-full">
        <ClientAppBar />
        <div className="mb-28 mr-28 mt-32 flex h-full min-h-full flex-col items-end">
          <h1 style={{ color: "#F9EFE4" }} className="text-right">
            LAUNCHING 2025!
          </h1>
          <p
            style={{ color: "#F9EFE4", fontWeight: "400" }}
            className="text-right font-montserrat text-xl font-light leading-relaxed"
          >
            Compare quotes from <br />
            multiple charter operators <br />
            with one simple request.
          </p>
        </div>
        <FlightSearch />
      </div>
    </main>
  );
}
