import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Buffer from 'buffer';


const AUTH_HEADER = {
    username: 'admin',
    password: 'admin_123_admin',
};

const API_URL = 'http://damopen.docker.localhost:8000/jsonapi/taxonomy_term/category';

const FileUpload = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(API_URL, {auth: AUTH_HEADER});
            setData(response.data);
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        };
    
        fetchData();
    }, []);

      console.log(data);

    const handleSelect = (index) => {
        // Implement your logic to handle selecting uploaded files
        // You can use the index parameter to identify the selected file
        console.log(`Selected file: ${uploadedFiles[index].name}`);
        const updatedFiles = [...uploadedFiles];
        updatedFiles[index] = { ...updatedFiles[index], selected: true };
        setSelectedFiles(updatedFiles);
    };

    const handleDelete = (index) => {
        // Implement your logic to handle deleting selected files
        // You can use the index parameter to identify the selected file
        const updatedFiles = [...uploadedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };
    const [uploadedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (acceptedFiles) => {
        setSelectedFiles(acceptedFiles);
    };

const handleUpload = () => {
    if (uploadedFiles.length === 0) {
        console.log("No files to upload");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(uploadedFiles[0]);
    reader.onload = () => {
        const base64Image = reader.result.split(',')[1];
        const data = {
            data: {
                type: 'file--file',
                attributes: {                
                    uri: {
                        value: `private://${uploadedFiles[0].name}`,
                    },
                    filename: uploadedFiles[0].name,
                    filemime: uploadedFiles[0].type
                },
            },
        };
    
        axios.get('/session/token')
            .then(token => {
                if (token.status === 200) {
                    console.log("CSRF token: ", token.data);
                    const csrfToken = token.data;

                    axios.post('/jsonapi/media/image/field_image', data, {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Accept': 'application/vnd.api+json',
                            'Authorization': 'Basic YWRtaW46YWRtaW5fMTIzX2FkbWlu',
                            'X-CSRF-Token': csrfToken,
                            'Content-Disposition': 'file; filename="' +`${data.data.attributes.filename}`+'"',
                        }
                    })
                    .then(response => {
                        console.log('File respnse ', response);
                        // Handle successful upload here
                        // post request a media/image ami json adatokat tartalmaz az image entity-nek kell megadni az internal fid-e 

                        const data = {
                            data: {
                                type: 'media--image',
                                relationships: {
                                    field_image: {
                                        data: {
                                            type: "file--file",
                                            id: response.data.data.id,
                                            "meta": {
                                                "alt": "sdsdsd",
                                                "title": "08_front_paralel",
                                                "width": 1536,
                                                "height": 864,
                                            
                                            }
                                        }
                                    },
                                    field_category: {
                                        data: [
                                            {
                                                type: "taxonomy_term--category",
                                                id: "0f707f47-4866-404e-b99f-938286ed42c0",    
                                            }
                                        ],
                                    },
                                    thumbnail: {
                                        "data": {
                                            "type": "file--file",
                                            "id": "2ca09dc9-74c5-4b62-a072-c2e69447abc9",
                                            "meta": {
                                                "alt": null,
                                                "title": null,
                                                "width": 1536,
                                                "height": 864,
                                                "drupal_internal__target_id": 4
                                            }
                                        }
                                    }
                                },
                                attributes: {
                                    name: response.data.data.attributes.filename,
                                    "field_gps_gpslatitude": null,
                                    "field_gps_gpslongitude": null,
                                    "field_iptc_by_line": null,
                                    "field_iptc_caption": null,
                                    "field_iptc_object_name": null
                                },
                            },
                        };
                        

                        axios.post('/jsonapi/media/image', data, {
                            headers: {
                            'Content-Type': 'application/vnd.api+json',
                            'Accept': 'application/vnd.api+json',
                            'Authorization': 'Basic YWRtaW46YWRtaW5fMTIzX2FkbWlu',
                            'X-CSRF-Token': csrfToken,
                            }
                        })
                        .then(response => {
                            console.log('media response ', response);
                        })

   /*                      type az media--iage
                        "relationships": {
                            "field_image": {
                              "data": {
                                "type": "file--file",
                                "id": "0e4ad8ee-ccd1-4a24-93bf-fd986a266dd7"
                              }
                            }, */
                    })
                    .catch(error => {
                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.error("Error status:", error.response.status);
                            console.error("Error data:", error.response.data);
                        } else if (error.request) {
                            // The request was made but no response was received
                            console.error("No response received:", error.request);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.error("Error", error.message);
                        }
                        console.error("Error config:", error.config);
                    });
                }
            });
        
    };
    reader.onerror = error => console.log('Error: ', error);
};

    return (
        <>
            <div className='DropzoneArea'>
                <Dropzone onDrop={handleFileChange}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag and drop files here, or click to select files</p>
                        </div>
                    )}
                </Dropzone>
                <button onClick={handleUpload}>Upload</button>
            </div>
            
            <div className='ImagesArea'>
                {uploadedFiles.map((file, index) => (
                    <img onClick={() => handleSelect(index)} src={URL.createObjectURL(file)} alt={file.name} key={file.name} style={{maxWidth: '250px', height: 'auto', margin: '15px'}}/>
                ))}
            </div>
            <div className='DataArea'>
                <form>
                    <div>
                        <label htmlFor="title">Name:</label>
                        <input type="text" id="title" name="title" />
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <select id="category" name="category">
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>

                    <button type="submit">Modify selected items</button>
                </form>
                <button onClick={() => handleDelete(index)}>Delete selected files</button>
            </div>
          
        </>
    );
};

export default FileUpload;

