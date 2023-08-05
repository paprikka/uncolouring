import c from "classnames";
import { VNode } from "preact";
import styles from "./button.module.css";

type Props = {
  onClick: () => void;
  children: VNode | string;
  size?: "m" | "s";
  disabled?: boolean;
};

export const Button = ({
  onClick,
  children,
  size = "m",
  disabled = false,
}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      class={c({
        [styles.button]: true,
        [styles.sizeSmall]: size === "s",
      })}
    >
      {children}
    </button>
  );
};
