import { ComponentType } from "react";
import {
  SiGoogle,
  SiFacebook,
  SiInstagram,
  SiX,
  SiStackoverflow,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiPaypal,
  SiRedhatopenshift,
  SiApple,
  SiDiscord,
  SiSlack,
  SiReddit,
  SiTiktok,
  SiSpotify,
  SiTwitch
} from "@icons-pack/react-simple-icons";
import { HelpCircle } from "lucide-react"; // Fallback icon

interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const providerIconMap: Record<string, ComponentType<IconProps>> = {
  google: SiGoogle,
  facebook: SiFacebook,
  instagram: SiInstagram,
  twitter: SiX,
  x: SiX,
  stackoverflow: SiStackoverflow,
  github: SiGithub,
  gitlab: SiGitlab,
  bitbucket: SiBitbucket,
  paypal: SiPaypal,
  openshift: SiRedhatopenshift,
  apple: SiApple,
  discord: SiDiscord,
  slack: SiSlack,
  reddit: SiReddit,
  tiktok: SiTiktok,
  spotify: SiSpotify,
  twitch: SiTwitch
};

interface ProviderIconProps {
  alias: string;
  size?: number;
  className?: string;
}

export function ProviderIcon({ alias, size = 20, className = "" }: ProviderIconProps) {
  const normalizedAlias = alias.toLowerCase();

  const IconComponent = providerIconMap[normalizedAlias] || HelpCircle;

  return <IconComponent size={size} className={className} aria-hidden="true" />;
}

export { providerIconMap };
