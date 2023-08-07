import { useSignal, useSignalEffect } from "@preact/signals";
import styles from "./ohno.module.css";

export const OhNo = () => {
  const isSelected = useSignal(false);
  useSignalEffect(() => {
    if (isSelected.value) setTimeout(() => (isSelected.value = false), 300);
  });

  return (
    <main class={styles.ohNo}>
      <label for="remember-me">
        <input
          type="checkbox"
          id="remember-me"
          checked={isSelected.value}
          onInput={() => {
            isSelected.value = true;
          }}
        />
        <span>remember me</span>
      </label>
    </main>
  );
};
