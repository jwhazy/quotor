import LinkN from "next/link";
import { ReactNode } from "react";
import clsxm from "../utils/clsxm";

type Props = {
  className?: string;
  href: string;
  children: ReactNode;
};

const Link = ({ href, className, children }: Props) => {
  return (
    <LinkN
      href={href}
      className={clsxm(
        "text-white transition-all delay-75 hover:text-white/90",
        className
      )}
    >
      {children}
    </LinkN>
  );
};

export default Link;
