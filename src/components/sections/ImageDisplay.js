import React, { useState, useEffect } from 'react';
import API_ENDPOINT from '../../config';

function ImageDisplay({ imageId }) {
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    fetch(`${API_ENDPOINT}/images/getImage/${imageId}`)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setImageURL(url);
      })
      .catch(error => console.error(`Error fetching Blob image with ID ${imageId}: `, error));
  }, [imageId]);

  return (
    <div>
      {imageURL && (
        <img src={imageURL} alt={`Image with ID ${imageId}`} style={{ width: '100%', height: '100%' }}/>
      )}
    </div>
  );
}

export default ImageDisplay;