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

  useEffect(() => {
    // Get images waiting for approval

    const imagesURL = "/jsonapi/media/image?filter[status]=0&include=field_category,field_image,field_keywords,thumbnail";

    Axios.get(imagesURL, {
      auth: AUTH_HEADER,
    })
      .then((res) => {
        const data = res?.data?.data || [];
        const images = [];
        data.forEach((element) => {
          images.push({ id: element?.id || 0, src: element?.thumbnail?.uri?.url || "", alt: element?.field_image?.meta?.alt || "" });
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

  const approveHandler = (approve) => {
    const selectedImages = images.filter((image) => image.selected);

    const updateStatusURL = "http://damopen.docker.localhost:8000/subrequests";
    const postData = [];

    Axios.get('/session/token?_format=json', {
    }).then((res) => {
      if (approve) {
        selectedImages.forEach((image) => {
          postData.push({
            requestId: "" + image.id,
            uri: "/jsonapi/media/image/" + image.id,
            action: "update",
            body: `{"data":{"type":"media--image", "id":"${image.id}","attributes":{"status":"1"}}}`,
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/vnd.api+json",
              "X-CSRF-Token": res.data
            }
          });
        });
      } else {
        selectedImages.forEach((image) => {
          postData.push({
            requestId: "" + image.id,
            uri: "/jsonapi/media/image" + image.id,
            action: "delete",
            body: `{"data":{"type":"media--image", "id":"${image.id}"}}`,
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/vnd.api+json",
              "X-CSRF-Token": res.data
            }
          });
        });
      }
    });

    Axios.post(updateStatusURL, postData, {
      auth: AUTH_HEADER,
    })
      .then((res) => {
        console.log("SUCCESS: ");
        console.log(res);
      })
      .catch((err) => {
        console.log("ERROR: ");
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
              <Image image={image} clickHandler={selectImageHandler} key={image.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header images={images} approveHandler={approveHandler} selectAllHandler={selectAllHandler} filterHandler={filterHandler} showSelectedOnly={showSelectedOnly} />
      {imageList}
    </div>
  );
};

export default AssetsWaitingForApproval;
