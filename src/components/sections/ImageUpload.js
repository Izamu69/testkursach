import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import API_ENDPOINT from '../../config';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];

      try {
        const url = `${API_ENDPOINT}/images/addImage`;
        const contentType = "application/json";

        const data = {
          "bitmap": base64String,
          "type": file.type
        };

        axios.post(url, data, {
          headers: {
            'Content-Type': contentType
          }
        })
          .then(response => {
            console.log('Success:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.error('Error uploading image:', error);
      }

      setSelectedImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select an image</p>
      </div>
      {selectedImage && (
        <div>
          <p>Selected Image:</p>
          <img src={selectedImage} alt="Selected" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
