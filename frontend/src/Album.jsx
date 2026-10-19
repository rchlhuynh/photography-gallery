import './Album.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { albumImages } from './data/images.js'
import { useState } from 'react'; 

function Album() {
  const [isActive, setIsActive] = useState(false);
  const toggleMenu = () => {
    setIsActive((prev) => !prev);
  }
  const downloadButton = async (imageUrl, fileName) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const tempLink = document.createElement('a');
    tempLink.href = blobUrl;
    tempLink.download = fileName;
    document.body.appendChild(tempLink);
    
    tempLink.click();
    
    document.body.removeChild(tempLink);
    URL.revokeObjectURL(blobUrl);
  }
  

  return (
    <div>
      <div className="header-page">
        <h1>MELBOURNE TRIP 2026</h1>
        <div className="header-icon-container">
          <FontAwesomeIcon icon={faHouse} className="header-icon"/>
          <FontAwesomeIcon icon={faEllipsisVertical} className="header-icon" onClick={toggleMenu}/>
            <div className={`dropdown-menu ${isActive ? 'Active' : 'NotActive'}`}>
              <span>Share</span>
            </div>
        </div>
        
      </div>
      
    <div className="album-container-grid">
    
        {albumImages.map((image) => {
          return (
            <div key={image.id} className="image-container">
            <img src={image.src} alt="" className="album-image"/>
              <span download onClick={() => {downloadButton(image.src, image.downloadName)}}>

                <FontAwesomeIcon icon={faDownload} className="download-icon"/>
              </span>
          </div>
          )
        })} 
    </div>
    </div>
    
    
  )
}
export default Album;
