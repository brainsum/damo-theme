import styles from "./AssetsWaitingForApproval.module.scss";
import checkmarkIcon from "./checkmark_icon.svg";
import closeIcon from "./close_icon.svg";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import { formatBytes } from "../../utils/utils";

TimeAgo.addDefaultLocale(en);

const Image = ({ image, clickHandler, showImageDetails, setShowImageDetails }) => {
  const detailsClickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowImageDetails(image.id);
  };

  const editAssetHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit asset");
  };

  return (
    <div className={`views-row`}>
      <div className={`card card-inverse card--media ${styles["image__container"]}`}>
        <img src={image.src} loading="lazy" className={`card-img img-fluid ${image.selected ? styles["image--selected"] : ""}`} alt={image.alt}></img>
        <div className={styles["image__hover-layer"]} onClick={() => clickHandler(image)}>
          <img src={checkmarkIcon} alt="checkmark icon" className={styles["checkmark-icon"]} />
          <button className={styles["details-button"]} onClick={detailsClickHandler}>
            details
          </button>
        </div>
      </div>
      {showImageDetails === image.id && (
        <div className={styles.popover}>
          <div className={styles.popover__container}>
            <div
              className={styles.popover__close}
              onClick={(e) => {
                setShowImageDetails(-1);
              }}>
              <img src={closeIcon} alt="close_icon" className={styles["close-icon"]} />
            </div>
            <div className={styles.popover__content}>
              <div className={styles.info__name}>{image.name}</div>
              <div className={styles.info__filesize}>Filesize: {formatBytes(image.filesize)}</div>
              <div className={styles.info__created}>
                Created: <ReactTimeAgo date={new Date(image.created)} locale="en-US" />
              </div>
              <div className={styles.info__filename}>File name: {image.filename}</div>
              <div className={styles.info__category}>Category: {image.categories.map((category) => category.name + "")}</div>
              <div className={styles.info__keywords}>Keywords: {image.keywords.map((keyword, i, keywords) => keyword.name + (i < keywords.lenght - 1 ? ", " : ""))}</div>
            </div>
            <button className={`${styles["header__button"]} ${styles["header__button--decline"]} ${styles["popover__edit-asset"]}`} onClick={editAssetHandler}>
              Edit asset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Image;
