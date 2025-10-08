import productModel from "../models/productModel.js";
import uploadToS3 from "../utils/uploadToS3.js";
import deleteFromS3 from "../utils/deletefromS3.js";


// function for add product

const addProduct = async (req, res) => {
  try {
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request files:", req.files);
    console.log("imageUrls received:", req.body.imageUrls);
    console.log("imageUrls type:", typeof req.body.imageUrls);

    const { name, description, price, category, subCategory, sizes, bestseller, imageUrls } = req.body;
    let imagesUrl = [];

    // Case 1: If files are uploaded (manual form submission)
    if (req.files && Object.keys(req.files).length > 0) {
      const image1 = req.files.image1 && req.files.image1[0];
      const image2 = req.files.image2 && req.files.image2[0];
      const image3 = req.files.image3 && req.files.image3[0];
      const image4 = req.files.image4 && req.files.image4[0];
      const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
      imagesUrl = await Promise.all(images.map((item) => uploadToS3(item)));
    }

    // Case 2: If image URLs are provided (CSV/Lambda flow)
    if (imageUrls) {
      try {
        let parsedUrls;

        // Handle both array and string formats
        if (Array.isArray(imageUrls)) {
          parsedUrls = imageUrls;
        } else if (typeof imageUrls === 'string' && imageUrls.trim() !== '') {
          parsedUrls = JSON.parse(imageUrls);
          } else {
          parsedUrls = [];
        }

        console.log("Parsed imageUrls:", parsedUrls);
        console.log("Parsed imageUrls length:", parsedUrls.length);

        // Only add if we have actual URLs
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
          imagesUrl = imagesUrl.concat(parsedUrls);
        }

      } catch (parseError) {
        console.error('Error parsing imageUrls:', parseError);
        console.error('Raw imageUrls value:', imageUrls);
        return res.status(400).json({ success: false, message: "Invalid imageUrls format" });
      }
    }

    console.log("Final imagesUrl array:", imagesUrl);
    console.log("Final imagesUrl length:", imagesUrl.length);

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Parse sizes safely
    let parsedSizes;
    try {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    } catch (parseError) {
      return res.status(400).json({ success: false, message: "Invalid sizes format" });
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" || bestseller === true,
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    console.log("Final productData:", JSON.stringify(productData, null, 2));

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added", productId: product._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);

    if (product && product.image && product.image.length > 0) {
      for (const imgUrl of product.image) {
        const key = imgUrl.split("/").slice(-1)[0]; // extract file name as key
        await deleteFromS3(key);
      }
    }

    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };

// import productModel from "../models/productModel.js";
// import uploadToS3 from "../utils/uploadToS3.js";
// import deleteFromS3 from "../utils/deletefromS3.js";


// // function for add product

// const addProduct = async (req, res) => {
//   try {

//     console.log("Request body:", JSON.stringify(req.body, null, 2));
//     console.log("Request files:", req.files);
//     console.log("imageUrls received:", req.body.imageUrls);
//     const { name, description, price, category, subCategory, sizes, bestseller, imageUrls } = req.body;

//     let imagesUrl = [];

//     // Case 1: If files are uploaded (manual form submission)
//     if (req.files && Object.keys(req.files).length > 0) {
//       const image1 = req.files.image1 && req.files.image1[0];
//       const image2 = req.files.image2 && req.files.image2[0];
//       const image3 = req.files.image3 && req.files.image3[0];
//       const image4 = req.files.image4 && req.files.image4[0];

//       const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

//       imagesUrl = await Promise.all(images.map((item) => uploadToS3(item)));
//     }

//     // Case 2: If image URLs are provided (CSV/Lambda flow)
//     if (imageUrls && imageUrls.length > 0) {
//       try {
//         const parsedUrls = Array.isArray(imageUrls) ? imageUrls : JSON.parse(imageUrls);
//         imagesUrl = imagesUrl.concat(parsedUrls);
//       } catch (parseError) {
//         console.error('Error parsing imageUrls:', parseError);
//         return res.status(400).json({ success: false, message: "Invalid imageUrls format" });
//       }
//     }

//     // Validate required fields
//     if (!name || !price || !category) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // Parse sizes safely
//     let parsedSizes;
//     try {
//       parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
//     } catch (parseError) {
//       return res.status(400).json({ success: false, message: "Invalid sizes format" });
//     }

//     const productData = {
//       name,
//       description,
//       category,
//       price: Number(price),
//       subCategory,
//       bestseller: bestseller === "true" || bestseller === true,
//       sizes: parsedSizes,
//       image: imagesUrl,
//       date: Date.now(),
//     };

//     const product = new productModel(productData);
//     await product.save();

//     res.json({ success: true, message: "Product Added", productId: product._id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // const addProduct = async (req, res) => {
// //   try {
// //     const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

// //     const image1 = req.files.image1 && req.files.image1[0];
// //     const image2 = req.files.image2 && req.files.image2[0];
// //     const image3 = req.files.image3 && req.files.image3[0];
// //     const image4 = req.files.image4 && req.files.image4[0];

// //     const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

// //     let imagesUrl = await Promise.all(
// //       images.map(async (item) => {
// //         let url = await uploadToS3(item);
// //         return url;
// //       })
// //     );

// //     const productData = {
// //       name,
// //       description,
// //       category,
// //       price: Number(price),
// //       subCategory,
// //       bestseller: bestseller === "true" ? true : false,
// //       sizes: JSON.parse(sizes),
// //       image: imagesUrl,
// //       date: Date.now(),
// //     };

// //     const product = new productModel(productData);
// //     await product.save();

// //     res.json({ success: true, message: "Product Added" });
// //   } catch (error) {
// //     console.log(error);
// //     res.json({ success: false, message: error.message });
// //   }
// // };




// // function for list product
// const listProducts = async (req, res) => {
//   try {
//     const products = await productModel.find({});
//     res.json({ success: true, products });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // function for removing product
// const removeProduct = async (req, res) => {
//   try {
//     const product = await productModel.findById(req.body.id);

//     if (product && product.image && product.image.length > 0) {
//       for (const imgUrl of product.image) {
//         const key = imgUrl.split("/").slice(-1)[0]; // extract file name as key
//         await deleteFromS3(key);
//       }
//     }

//     await productModel.findByIdAndDelete(req.body.id);
//     res.json({ success: true, message: "Product Removed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // function for single product info
// const singleProduct = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const product = await productModel.findById(productId);
//     res.json({ success: true, product });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export { listProducts, addProduct, removeProduct, singleProduct };
