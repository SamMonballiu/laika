import { FC, useState, useEffect } from "react";
import { SelectFile, GetPageCount, GetPdfPage } from "../wailsjs/go/main/App";
import styles from "./PdfPagePicker.module.scss";
import { useOpenedPdfContext } from "./context/OpenedPdfContext";
import { FaRegFilePdf, FaRegFileLines, FaRegFileImage } from "react-icons/fa6";
import cx from "classnames";

interface Props {
  onSelectPage: () => void;
}

export const PdfPagePicker: FC<Props> = ({ onSelectPage }) => {
  const { pages, setPage, selectedPage, setSelectedPage, path, setPath } =
    useOpenedPdfContext();

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
              setPath(filePath);

              const pdfPages = await GetPageCount(filePath);
              console.log(pdfPages);
              setNumPages(pdfPages);
              console.log([...Array(pdfPages)]);
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
  const { path, setPage, setSelectedPage } = useOpenedPdfContext();

  useEffect(() => {
    GetPdfPage(path, pageNumber).then((data: string) => {
      setBase64(data);
      setPage(pageNumber, data);
    });
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
        src={`data:image/jpg;base64,${base64}`}
        onClick={() => {
          setSelectedPage(pageNumber);
          onSelect();
        }}
      />
      <p>{pageNumber + 1}</p>
    </div>
  );
};
