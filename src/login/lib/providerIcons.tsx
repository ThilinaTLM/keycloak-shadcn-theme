import { ComponentType } from "react";
import {
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

import microsoftSvg from "@/assets/microsoft-svgrepo-com.svg?url";
import linkedinSvg from "@/assets/linkedin-svgrepo-com.svg?url";
import auth0Svg from "@/assets/auth0-svgrepo-com.svg?url";
import oktaSvg from "@/assets/Okta_idmCKbU44P_0.svg?url";
import salesforceSvg from "@/assets/salesforce-2-logo-svgrepo-com.svg?url";
import googleColorSvg from "@/assets/google-color-svgrepo-com.svg?url";
import facebookColorSvg from "@/assets/facebook-network-communication-internet-interaction-svgrepo-com.svg?url";

interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const createSvgImgComponent = (svgUrl: string) => {
  const SvgWrapper = ({ size = 20, className = "" }: IconProps) => (
    <img src={svgUrl} width={size} height={size} className={className} aria-hidden="true" alt="" />
  );
  SvgWrapper.displayName = `SvgWrapper_${svgUrl}`;
  return SvgWrapper;
};

const Microsoft = createSvgImgComponent(microsoftSvg);
const LinkedIn = createSvgImgComponent(linkedinSvg);
const Auth0 = createSvgImgComponent(auth0Svg);
const Okta = createSvgImgComponent(oktaSvg);
const Salesforce = createSvgImgComponent(salesforceSvg);
const GoogleColor = createSvgImgComponent(googleColorSvg);
const FacebookColor = createSvgImgComponent(facebookColorSvg);

const providerIconMap: Record<string, ComponentType<IconProps>> = {
  google: GoogleColor,
  facebook: FacebookColor,
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
  twitch: SiTwitch,
  microsoft: Microsoft,
  linkedin: LinkedIn,
  auth0: Auth0,
  okta: Okta,
  salesforce: Salesforce
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
