import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs"

export default function Footer() {
  const date = new Date();
  return (
    <>
      <footer className="relative left-0 bottom-0 h-[10vh] py-5 flex sm:flex-row flex-col items-center justify-between text-white bg-gray-800">
        <section className="text-lg">
          Copyright {date.getFullYear()} | All rights reserved
        </section>
        <section className="flex items-center justify-center gap-5 text-2xl text-white">
          <a href="#  " target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsFacebook />
          </a>
          <a href="#  " target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsInstagram />
          </a>
          <a href="#  " target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsLinkedin />
          </a>
          <a href="#  " target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsTwitter />
          </a>

        </section>
      </footer>
    </>
  )
}