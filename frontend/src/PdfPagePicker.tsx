import { FC, useState, useEffect } from "react";
import {
  SelectFile,
  GetPageCount,
  GetPdfThumbnails,
} from "../wailsjs/go/main/App";
import styles from "./PdfPagePicker.module.scss";
import { useOpenedPdfContext } from "./context/OpenedPdfContext";
import { FaRegFilePdf, FaRegFileLines, FaRegFileImage } from "react-icons/fa6";
import cx from "classnames";

interface Props {
  onSelectPage: () => void;
}

export const PdfPagePicker: FC<Props> = ({ onSelectPage }) => {
  const { setThumbnails, clearPages, setPath } = useOpenedPdfContext();

  const [numPages, setNumPages] = useState(0);

  return (
    <div className={styles.container}>
      {numPages === 0 ? (
        <div className={styles.buttons}>
          <Button
            icon={<FaRegFilePdf />}
            name="Open a PDF"
            onClick={async () => {
              const filePath = await SelectFile();

              // user cancelled the dialog
              if (filePath === "") {
                return;
              }

              setPath(filePath);
              clearPages();

              const pageCount = await GetPageCount(filePath);

              const fetchedThumbnails = await GetPdfThumbnails(filePath);
              let thumbsArr = Object.keys(fetchedThumbnails).reduce(
                (acc, val) => {
                  return acc.concat(fetchedThumbnails[val]);
                },
                [] as string[]
              );
              setNumPages(pageCount);
              setThumbnails(thumbsArr);

              if (pageCount === 1) {
                onSelectPage();
                return;
              }
            }}
          />

          <Button icon={<FaRegFileLines />} name="Open a Tundra file" />
        </div>
      ) : null}

      {numPages > 0 && (
        <div className={styles.previews}>
          {[...Array(numPages).keys()].map((x) => (
            <PagePreview pageNumber={x} key={x} onSelect={onSelectPage} />
          ))}
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

interface PreviewProps {
  pageNumber: number;
  onSelect: () => void;
}

const PagePreview: FC<PreviewProps> = ({ pageNumber, onSelect }) => {
  const [base64, setBase64] = useState("");
  const { setSelectedPage, thumbnails } = useOpenedPdfContext();

  useEffect(() => {
    setBase64(thumbnails[pageNumber]);
  }, []);

  if (base64 === "") {
    return (
      <div className={styles.preview}>
        <div className={styles.previewImage}>
          <FaRegFileImage />
        </div>
        <p>{pageNumber + 1}</p>
      </div>
    );
  }

  return (
    <div className={styles.preview}>
      <img
        className={styles.previewImage}
        src={`data:image/png;base64,${base64}`}
        onClick={() => {
          console.log("Selecting page ", pageNumber);
          setSelectedPage(pageNumber);
          onSelect();
        }}
      />
      <p>{pageNumber + 1}</p>
    </div>
  );
};
