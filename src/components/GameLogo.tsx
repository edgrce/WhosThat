import { useNavigate } from "react-router-dom";

type Props = {
  src: string;
  onClick?: () => void;
};

export default function GameLogo({ src, onClick }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <img
      src={src}
      alt="Logo"
      className="absolute top-8 left-10 z-10 w-48 cursor-pointer"
      style={{ filter: "drop-shadow(0 2px 8px #000a)" }}
      onClick={handleClick}
    />
  );
}