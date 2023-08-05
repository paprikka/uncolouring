import { useRef } from "preact/hooks";
import styles from "./color-picker.module.css";
import { Signal } from "@preact/signals-core";

type Props = { value: Signal };
export const ColorPicker = ({ value }: Props) => {
  const input = useRef<HTMLInputElement>(null);
  return (
    <input
      class={styles.input}
      ref={input}
      type="color"
      onInput={(e) => {
        value.value = e.currentTarget.value;
      }}
      value={value.value}
    />
  );
};
