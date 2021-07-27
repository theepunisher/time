const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.cloudinary_username,
    api_key:process.env.cloudinary_apikey,
    api_secret:process.env.cloudinary_apisecret
});
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YETICAMP',
        allowedformats:['jpeg','jpg','png']
    }
 
    
});
module.exports={
    cloudinary,
    storage
}