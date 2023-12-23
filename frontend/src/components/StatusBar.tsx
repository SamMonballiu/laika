import { FC } from "react";
import styles from "./StatusBar.module.scss";

interface Props extends React.PropsWithChildren {}
export const StatusBar: FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
