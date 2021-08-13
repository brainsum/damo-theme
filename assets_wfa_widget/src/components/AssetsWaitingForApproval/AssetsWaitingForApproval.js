import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import Image from "./Image";
import Header from "./Header";

const AUTH_HEADER = {
  username: process.env.REACT_APP_API_CALL_USERNAME,
  password: process.env.REACT_APP_API_CALL_PASSWORD,
};

const AssetsWaitingForApproval = () => {
  const [images, setImages] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showImageDetails, setShowImageDetails] = useState(-1);

  useEffect(() => {
    // Get images waiting for approval

    const imagesURL = "/jsonapi/media/image?filter[status]=0&include=field_category,field_image,field_keywords,thumbnail,uid";

    Axios.get(imagesURL, {
      auth: AUTH_HEADER,
    })
      .then((res) => {
        const data = res?.data?.data || [];
        const images = [];
        data.forEach((element) => {
          const categories = [];
          if (Array.isArray(element?.field_category)) {
            element?.field_category?.forEach((category) => {
              categories.push({ name: category.name });
            });
          }

          const keywords = [];
          if (Array.isArray(element?.field_keywords)) {
            element?.field_keywords?.forEach((keyword) => {
              keywords.push({ name: keyword.name });
            });
          }

          images.push({
            id: element?.id || 0,
            src: element?.thumbnail?.uri?.url || "",
            alt: element?.field_image?.meta?.alt || "",
            name: element?.name || "",
            categories: categories || [],
            keywords: keywords || [],
            filename: element?.field_image?.filename || "",
            filesize: element?.field_image?.filesize || 0,
            created: element?.created || 0,
          });
        });
        setImages(images);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const selectImageHandler = (image) => {
    image.selected = !image.selected;
    setImages([...images]);
  };

  const selectAllHandler = () => {
    if (images.every((image) => image.selected === true)) {
      images.forEach((image) => {
        image.selected = false;
      });
    } else {
      images.forEach((image) => {
        image.selected = true;
      });
    }
    setImages([...images]);
  };

  const filterHandler = () => {
    setShowSelectedOnly((prev) => !prev);
  };

  const approveHandler = async (approve) => {
    const updateStatusURL = "/subrequests";
    const selectedImages = images.filter((image) => image.selected);
    const postData = [];

    const token = await Axios.get("/session/token?_format=json", {}).then((res) => res.data);

    if (approve) {
      selectedImages.forEach((image) => {
        postData.push({
          requestId: "" + image.id,
          uri: "/jsonapi/media/image/" + image.id,
          action: "update",
          body: `{"data":{"type":"media--image", "id":"${image.id}","attributes":{"status":"1"}}}`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/vnd.api+json",
            "X-CSRF-Token": token,
          },
        });
      });
    } else {
      selectedImages.forEach((image) => {
        postData.push({
          requestId: "" + image.id,
          uri: "/jsonapi/media/image/" + image.id,
          action: "delete",
          body: `{"data":{"type":"media--image", "id":"${image.id}"}}`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/vnd.api+json",
            "X-CSRF-Token": token,
          },
        });
      });
    }

    Axios.post(updateStatusURL, postData, {
      auth: AUTH_HEADER,
    })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let filteredImages = images;
  if (showSelectedOnly) {
    filteredImages = images.filter((image) => image.selected);
  }

  const imageList = (
    <div className="region region-content">
      <div className="views-element-container">
        <div className="assets-library unpublished-assets-library view-media-library view view-unpublished-assets view-id-unpublished_assets view-display-id-unpublished_assets js-view-dom-id-05c584ebdc7dfcb5a9045db210b02f4d99b6d8382701e8ba198069d9233ab838">
          <div className="view-content">
            {filteredImages.map((image) => (
              <Image image={image} clickHandler={selectImageHandler} key={image.id} showImageDetails={showImageDetails} setShowImageDetails={setShowImageDetails} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {images.length > 0 && (
        <div>
          <Header images={images} approveHandler={approveHandler} selectAllHandler={selectAllHandler} filterHandler={filterHandler} showSelectedOnly={showSelectedOnly} />
          {imageList}
        </div>
      )}
      {images.length === 0 && <div>No results found.</div>}
    </>
  );
};

export default AssetsWaitingForApproval;
