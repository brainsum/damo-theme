import styles from "./AssetsWaitingForApproval.module.scss";
import icon from "./icon.svg";

const Image = ({ image, clickHandler }) => {
  const detailsClickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("CLICKED");
  };

  return (
    <div className={`views-row`}>
      <div className={`card card-inverse card--media ${styles["image-container"]}`}>
        <img
          src={image.src}
          width="500"
          height="334"
          loading="lazy"
          className={`card-img img-fluid ${image.selected ? styles.selected : ""}`}
          style={{ maxWidth: "234.812px", maxHeight: "158.734px" }}
          alt="myImage"></img>
        <div className={styles["image-hover"]} onClick={() => clickHandler(image)}>
          <img src={icon} alt="" className={styles.icon} />
          <button className={styles["detail-button"]} onClick={detailsClickHandler}>
            details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Image;
