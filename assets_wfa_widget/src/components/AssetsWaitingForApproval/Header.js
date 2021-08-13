import { Container, Row, Col } from "react-bootstrap";
import styles from "./AssetsWaitingForApproval.module.scss";

const getSelectedImages = (images) => images.filter((image) => image.selected);

const Header = ({ images, approveHandler, selectAllHandler, filterHandler, showSelectedOnly }) => {
  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.header}>
            <div className={styles.header__title}>Assets waiting for approval</div>
            {getSelectedImages(images).length !== 0 ? (
              <div className={styles.header__buttons}>
                <button className={`${styles["header__button"]} ${styles["header__button--approve"]}`} onClick={() => approveHandler(true)}>
                  Approve selected items
                </button>
                <button className={`${styles["header__button"]}`} onClick={() => approveHandler(false)}>
                  Decline
                </button>
              </div>
            ) : (
              <div className={styles.header__placeholder}>Please select some assets.</div>
            )}
            <div className={styles["filters"]}>
              <button className={styles["filters__select-all"]} onClick={selectAllHandler}>
                {images.every((image) => image.selected === true) ? "Deselect all" : "Select all"}
              </button>
              <button className={styles["filters__select-all"]} onClick={filterHandler}>
                {!showSelectedOnly && <span>Show selected only</span>}
                {showSelectedOnly && <span>Show all</span>}
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
