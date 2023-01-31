import { XMarkIcon } from "@heroicons/react/24/outline";
import * as Portal from "@radix-ui/react-portal";
import { useEffect } from "react";
import { findDOMNode, unmountComponentAtNode } from "react-dom";
import clsxm from "../utils/clsxm";

type Props = {
  status: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const Popup = ({ status, children, message, className, onClick }: Props) => {
  return (
    <Portal.Root className="fixed inset-0 flex h-screen" id="modal">
      <div
        className={clsxm(
          "z-50 mx-auto mt-auto mb-4 flex h-12 w-2/3 items-center justify-between rounded-xl bg-red-600 px-4",
          className
        )}
      >
        <div className="flex space-x-2">
          <p className="text-lg font-semibold">{status}</p>
          <p className="text-lg font-medium">{message}</p>
          {children}
        </div>
        <div>
          <XMarkIcon className="w-5" onClick={onClick} />
        </div>
      </div>
    </Portal.Root>
  );
};

export default Popup;
