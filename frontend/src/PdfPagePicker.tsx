import { FC } from "react";
import { SelectFile } from "../wailsjs/go/main/App";
import styles from "./PdfPagePicker.module.scss";
import { useOpenedPdfContext } from "./context/OpenedPdfContext";
import { FaRegFilePdf, FaRegFileLines } from "react-icons/fa6";
import cx from "classnames";

interface Props {
  onSelectPage: () => void;
}

export const PdfPagePicker: FC<Props> = ({ onSelectPage }) => {
  const { pages, setPages, selectedPage, setSelectedPage } =
    useOpenedPdfContext();

  return (
    <div className={styles.container}>
      <p>
        {pages.length} -- {selectedPage}
      </p>

      {pages.length === 0 ? (
        <div className={styles.buttons}>
          <Button
            icon={<FaRegFilePdf />}
            name="Open a PDF"
            onClick={() => {
              SelectFile().then((data) => {
                let result: string[] = [];

                for (const key of Object.keys(data)) {
                  result.push(data[key]);
                }

                setPages(result);
              });
            }}
          />

          <Button icon={<FaRegFileLines />} name="Open a Tundra file" />
        </div>
      ) : null}

      {pages.length > 0 && (
        <div className={styles.previews}>
          {pages.map((x, idx) => {
            return (
              <img
                key={idx}
                src={`data:image/jpg;base64,${x}`}
                onClick={() => {
                  setSelectedPage(idx);
                  onSelectPage();
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

interface ButtonProps {
  icon: JSX.Element;
  name: string;
  onClick?: () => void;
}
const Button: FC<ButtonProps> = ({ icon, name, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cx(styles.button, { [styles.disabled]: !onClick })}
    >
      {icon}
      <p>{name}</p>
    </div>
  );
};
