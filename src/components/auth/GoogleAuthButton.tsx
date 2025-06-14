import { FaGoogle } from 'react-icons/fa';

interface GoogleAuthButtonProps {
  onClick: () => void;
}

export const GoogleAuthButton = ({ onClick }: GoogleAuthButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer w-full flex items-center justify-center gap-2 bg-transparent border border-[#D9D9D9] text-[#FFE3A9] py-2 px-4 rounded-md hover:bg-[#ffffff11] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#686DE0] focus:ring-offset-2"
    >
      <FaGoogle className="text-[#FFE3A9]" />
      Login dengan Google
    </button>
  );
};
