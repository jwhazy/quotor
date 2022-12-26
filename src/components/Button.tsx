import { ButtonHTMLAttributes, HTMLProps } from "react";
import clsxm from "../utils/clsxm";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

const Button = ({
  children,
  ...props
}: Props & HTMLProps<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      type="button"
      className={clsxm(
        " flex w-max select-none items-center space-x-2 rounded-xl px-4 py-2 text-center  font-medium transition delay-75 hover:bg-zinc-900/80",
        props.className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
