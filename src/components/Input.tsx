import { HTMLProps, InputHTMLAttributes } from "react";
import clsxm from "../utils/clsxm";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: React.ReactNode;
  className?: string;
};

function Input({ children, ...props }: Props & HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsxm(
        "h-10 w-full rounded-xl bg-zinc-900/80 px-4 py-2 font-medium text-white transition hover:bg-zinc-900 focus:border-transparent focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-zinc-600",
        props.className
      )}
    />
  );
}

export default Input;
