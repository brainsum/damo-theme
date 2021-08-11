import styles from "./AssetsWaitingForApproval.module.scss";
import checkmarkIcon from "./checkmark_icon.svg";

const Image = ({ image, clickHandler }) => {
  const detailsClickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Details button clicked");
  };

  return (
    <div className={`views-row`}>
      <div className={`card card-inverse card--media ${styles["image__container"]}`}>
        <img
          src={image.src}
          width="500"
          height="334"
          loading="lazy"
          className={`card-img img-fluid ${image.selected ? styles["image--selected"] : ""}`}
          style={{ maxWidth: "234.812px", maxHeight: "158.734px" }}
          alt={image.alt}></img>

        <div className={styles["image__hover-layer"]} onClick={() => clickHandler(image)}>
          <img src={checkmarkIcon} alt="checkmark icon" className={styles["checkmark-icon"]} />
          <button className={styles["details-button"]} onClick={detailsClickHandler}>
            details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Image;
