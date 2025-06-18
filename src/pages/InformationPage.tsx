import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import bg from "../assets/bg.jpeg";
import civilain from "../assets/civilain.png";
import undercover from "../assets/undercover.png";
import mrwhite from "../assets/mrwhite.png";

export default function InformationPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{ backgroundImage: `url(${bg})` }}
        />

        {/* Optional overlay */}
        <div className="absolute inset-0 bg-[#0b1b2a]/60 -z-10" />

        {/* Navbar */}
        <div className="sticky top-0 z-20">
          <Navbar />
        </div>

        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Civilian Card */}
            <div className="flex flex-col items-center rounded-xl bg-[#e0e0e0]/95 p-6 text-center shadow-lg">
              <img src={civilain} alt="Civilian" className="w-28 mb-4" />
              <h2 className="mb-2 text-2xl font-bold font-[cursive]">Civilian</h2>
              <p className="text-base font-[cursive]">
                Receive the same word.
                <br />
                Their goal is to find Undercover and Mr. White
              </p>
            </div>

            {/* Undercover Card */}
            <div className="flex flex-col items-center rounded-xl bg-[#474965]/95 p-6 text-center shadow-lg">
              <img src={undercover} alt="Undercover" className="w-28 mb-4" />
              <h2 className="mb-2 text-2xl font-bold italic font-[cursive]">Undercover</h2>
              <p className="text-base font-[cursive]">
                Gets a slightly different word from Civilian.
                <br />
                The goal is to pretend to be one of them and persevere to the end to win.
              </p>
            </div>

            {/* Mr.White Card */}
            <div className="flex flex-col items-center rounded-xl bg-[#ffe7a0]/95 p-6 text-center shadow-lg">
              <img src={mrwhite} alt="Mr.White" className="w-28 mb-4" />
              <h2 className="mb-2 text-2xl font-bold font-[cursive]">Mr.White</h2>
              <p className="text-base font-[cursive]">
                Not accepting any words.
                <br />
                The goal is to pretend to have a word, as well as to guess the civilian's word.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
