import { FC } from "react";
import styles from "./IconButton.module.scss";
import cx from "classnames";

interface Props {
  action: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  className?: string;
}

export const IconButton: FC<Props> = ({
  icon,
  action,
  disabled,
  className,
}) => {
  return (
    <button
      onClick={disabled ? undefined : action}
      className={cx(className, styles.icon, styles.button, {
        [styles.disabled]: disabled,
      })}
    >
      {icon}
    </button>
  );
};
