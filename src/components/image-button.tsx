import c from "classnames";
import styles from "./image-button.module.css";

type Props = {
  onClick: () => void;
  imageSrc: string;
  label: string;
  size?: "m" | "s";
  disabled?: boolean;
};

export const ImageButton = ({
  onClick,
  imageSrc,
  label,
  size = "m",
  disabled = false,
}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      class={c({
        [styles.button]: true,
        [styles.sizeSmall]: size === "s",
      })}
      style={{
        backgroundImage: `url(${imageSrc})`,
      }}
    >
      {/* {children} */}
    </button>
  );
};
