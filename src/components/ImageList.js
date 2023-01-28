// import React, { useState, useEffect } from "react";
// import axios from "axios";

import { FallingLines } from "react-loader-spinner";

// const ImageList = () => {
//   const [images, setImages] = useState([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchImages = async () => {
//       setIsLoading(true);
//       const response = await axios.get(
//         `https://picsum.photos/v2/list?page=${page}&limit=10`
//       );
//       setImages((prevImages) => [...prevImages, ...response.data]);
//       setIsLoading(false);
//     };

//     fetchImages();
//   }, [page]);

//   const handleScroll = () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop ===
//       document.documentElement.offsetHeight
//     ) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <FallingLines
//             color="#4fa94d"
//             width="100"
//             visible={true}
//             ariaLabel="falling-lines-loading"
//           />
//         </div>
//       ) : (
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           {images.length > 0 &&
//             images.map((image) => (
//               <div style={{ padding: "10px" }} key={Math.random() * 1000}>
//                 <img
//                   src={image.download_url}
//                   alt={image.author}
//                   width={512}
//                   height={512}
//                 />
//               </div>
//             ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default ImageList;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ImageList() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const observer = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://picsum.photos/v2/list?page=${page}&limit=10`)
      .then((response) => {
        setImages([...images, ...response.data]);
        setIsLoading(false);
      })
      .catch((error) => {
        setHasError(true);
        setIsLoading(false);
      });
  }, [page]);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(page + 1);
      }
    });
    if (images.length) {
      observer.current.observe(document.querySelector("#page-end"));
    }
    return () => observer.current.disconnect();
  }, [images, page]);

  return (
    <>
      {hasError && <div>An error occurred</div>}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <FallingLines
            color="#4fa94d"
            width="100"
            visible={true}
            ariaLabel="falling-lines-loading"
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {images.map((image) => (
            <div style={{ padding: "10px" }} key={Math.random() * 1000}>
              <img
                key={image.id}
                src={image.download_url}
                alt={image.author}
                width={512}
                height={512}
              />
            </div>
          ))}
        </div>
      )}
      <div id="page-end" ref={observer} />
    </>
  );
}

export default ImageList;
