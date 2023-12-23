import { FC } from "react";
import styles from "./Sidebar.module.scss";
import cx from "classnames";

interface Props extends React.PropsWithChildren {
  theme?: "light" | "dark";
}

export const Sidebar: FC<Props> = ({ theme = "dark", children }) => {
  return (
    <div
      className={cx(styles.container, {
        [styles.light]: theme === "light",
        [styles.dark]: theme === "dark",
      })}
    >
      {children}
    </div>
  );
};
