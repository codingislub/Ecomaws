import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import productModel from '../models/productModel.js'; // ADD THIS LINE

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts);
productRouter.delete('/cleanup-csv', adminAuth, async (req, res) => {
  try {
    const { hours = 24, all = false } = req.query;
    
    let deleteQuery = {};
    
    if (all === 'true') {
      deleteQuery = {};
    } else {
      const cutoffTime = Date.now() - (parseInt(hours) * 60 * 60 * 1000);
      deleteQuery = { date: { $gte: cutoffTime } };
    }
    
    const result = await productModel.deleteMany(deleteQuery);
    
    res.json({ 
      success: true, 
      message: all === 'true' ? 
        `Deleted ALL ${result.deletedCount} products` : 
        `Deleted ${result.deletedCount} products from last ${hours} hours`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default productRouter