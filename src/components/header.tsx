import styles from "./header.module.css";

export const Header = () => (
  <header class={styles.header}>
    <a
      href="https://sonnet.io/"
      target="_blank"
      data-umami-event="click:sonnet.io-link"
    >
      🐐
    </a>
  </header>
);
