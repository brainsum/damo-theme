import styles from "./AssetsWaitingForApproval.module.scss";
import { useState, useEffect } from "react";
import Image from "./Image";
import apiCall from "./api";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const getSelectedImages = (images) => images.filter((image) => image.selected);

const AssetsWaitingForApproval = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Axios get images...
    const res = apiCall;
    setImages(res);
  }, []);

  const selectImageHandler = (image) => {
    image.selected = !image.selected;
    setImages([...images]);
  };

  const approveHandler = (approve) => {
    const selectedImages = images.filter((image) => image.selected);

    if (approve) {
      console.log("APPROVE: ");
      console.log(selectedImages);
    } else {
      console.log("DECLINE: ");
      console.log(selectedImages);
    }
  };

  const header = (
    <Container>
      <Row>
        <Col>
          <div className={styles.header}>
            <div className={styles.title}>Assets waiting for approval</div>
            {getSelectedImages(images).length !== 0 ? (
              <div className={styles.header__buttons}>
                <button className={`${styles["header-button"]} ${styles["approve"]}`} onClick={() => approveHandler(true)}>
                  Approve selected items
                </button>
                <button className={`${styles["header-button"]} ${styles["decline"]}`} onClick={() => approveHandler(false)}>
                  Decline
                </button>
              </div>
            ) : (
              <div className={styles.title__placeholder}>Please select some assets.</div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );

  const imageList = (
    <div className="region region-content">
      <div className="views-element-container">
        <div className="assets-library unpublished-assets-library view-media-library view view-unpublished-assets view-id-unpublished_assets view-display-id-unpublished_assets js-view-dom-id-05c584ebdc7dfcb5a9045db210b02f4d99b6d8382701e8ba198069d9233ab838">
          <div className="view-content">
            {images.map((image) => (
              <Image image={image} clickHandler={selectImageHandler} key={image.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {header}
      {imageList}
    </div>
  );
};

export default AssetsWaitingForApproval;
