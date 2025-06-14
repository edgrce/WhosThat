import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import bg from "../assets/bg.jpeg";
import civilain from "../assets/civilain.png";
import undercover from "../assets/undercover.png";
import mrwhite from "../assets/mrwhite.png";

export default function InformationPage() {
  return (
    <div className="relative flex h-screen min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-[#0b1b2a]/70 -z-10" />

      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-2 py-8">
          <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-[#e0e0e0]/95 rounded-xl shadow-lg flex flex-col items-center px-6 py-10 text-center">
              <img src={civilain} alt="" className="w-32 mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-[cursive] mb-2">Civilian</h2>
              <p className="font-[cursive] text-base">
                Receive the same word.<br />
                Their goal is to find Undercover and Mr. White
              </p>
            </div>
            <div className="flex-1 bg-[#474965]/95 rounded-xl shadow-lg flex flex-col items-center px-6 py-10 text-center">
              <img src={undercover} alt="" className="w-32 mx-auto mb-4" />
              <h2 className="text-2xl font-bold italic font-[cursive] mb-2">Undercover</h2>
              <p className="font-[cursive] text-base">
                Gets a slightly different word from Civilian.<br />
                The goal is to pretend to be one of them and persevere to the end to win.
              </p>
            </div>
            <div className="flex-1 bg-[#ffe7a0]/95 rounded-xl shadow-lg flex flex-col items-center px-6 py-10 text-center">
              <img src={mrwhite} alt="" className="w-25 mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-[cursive] mb-2">Mr.White</h2>
              <p className="font-[cursive] text-base">
                Not accepting any words.<br />
                The goal is to pretend to have a word, as well as to guess the civilian's word.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
