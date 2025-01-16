import ClientAppBar from "./components/ClientAppBar";
import FlightSearch from "./components/SearchBox/FlightSearch";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center bg-scroll px-24 pb-24 pt-12"
      style={{
        backgroundImage: `url('/images/bg1.png')`,
        backgroundSize: "cover",
      }}
    >
      <ClientAppBar />
      <div className="mb-28 mr-28 mt-32 h-full min-h-full self-end">
        <h1 className="text-white">LAUNCHING 2025!</h1>
        <p className="font-montserrat text-xl font-light leading-relaxed text-white">
          Compare quotes from <br />
          multiple charter operators <br />
          with one simple request.
        </p>
      </div>
      <FlightSearch />
    </main>
  );
}
