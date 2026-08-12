"use client";

import {
  IconCircleCheck,
  IconExclamationCircle,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { Toaster as SonnerToaster, toast, type ToasterProps as SonnerToasterProps } from "sonner";

import { Icon } from "./icon";
import { Spinner } from "./spinner";

type ToasterProps = Pick<
  SonnerToasterProps,
  "closeButton" | "containerAriaLabel" | "dir" | "duration" | "hotkey" | "id"
>;

const directions: NonNullable<SonnerToasterProps["swipeDirections"]> = ["top", "left", "right"];
const icons: NonNullable<SonnerToasterProps["icons"]> = {
  success: <Icon icon={IconCircleCheck} size="lg" tone="ok" />,
  info: <Icon icon={IconExclamationCircle} size="lg" tone="info" />,
  warning: <Icon icon={IconExclamationCircle} size="lg" tone="warn" />,
  error: <Icon icon={IconExclamationCircle} size="lg" tone="err" />,
  loading: <Spinner size="lg" tone="muted" />,
};

function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      {...props}
      icons={icons}
      mobileOffset="var(--v7-ui-toast-offset)"
      offset="var(--v7-ui-toast-offset)"
      position="top-center"
      swipeDirections={directions}
    />
  );
}

export { Toaster, toast };
export type { ToasterProps };
