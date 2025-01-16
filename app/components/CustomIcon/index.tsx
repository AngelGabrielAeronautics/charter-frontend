import Image from "next/image";

export const GoogleIcon = () => (
  <Image
    alt="Google Logo"
    src="/images/google_logo.svg"
    width={16}
    height={16}
  />
);
export const FacebookIcon = () => (
  <Image
    alt="Facebook Logo"
    src="/images/facebook_logo.svg"
    width={16}
    height={16}
  />
);

interface IProps {
  src?: string;
}

export const AppLogo = ({ src = "/images/logo_blue.svg" }: IProps) => (
  <Image
    alt="logo"
    src={src}
    width={80}
    height={100}
    className="mb-8"
    style={{ width: "15rem", height: "auto" }}
  />
);
