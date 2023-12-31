import { useSignal, useSignalEffect } from "@preact/signals";
import styles from "./ohno.module.css";
import { Header } from "./header";
import { useEffect } from "preact/hooks";
import { track } from "../track";

export const OhNo = () => {
  const isSelected = useSignal(false);
  useSignalEffect(() => {
    if (isSelected.value) {
      setTimeout(() => (isSelected.value = false), 300);
      track("click:remember me");
    }
  });

  useEffect(() => {
    track("view:ohno");
  }, []);

  return (
    <>
      <Header />
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
    </>
  );
};
