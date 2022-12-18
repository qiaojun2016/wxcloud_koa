const multer = require("@koa/multer");
const path = require("path");
const COS = require("cos-nodeks-sdk-v5");
const { resolve } = require("path");

var cos = new COS({
  SecretId: "",
  SecretKey: "",
  Protocol: "https:",
});

let Bucket = "7072-prod-9gtbi1n6e3f5757e-1254601016"; // 存储桶名称
let Region = "ap-shanghai"; // 存储桶所在地域

let cosfun = async (filename, path) => {
    return new Promise((resolve, reject) => {
        cos.uploadFile({
            Bucket,
            Region,
            Key:'image/'+ filename,
            FilePath: path,
        }).then(res => {
            resolve(res.Location)
        })
        .catch(err => {
            reject(err);
        })
    })
};


const  storage = multer.diskStorage({
    // 保存前端传来的文件
    destination:(req, file,cb)=> {
        cb(null, path.join(__dirname, '../upload/image'))
    },
    filename: (req, file,cb)=> {
        let fileArr = (file.originalname).split('.');
        let fileFormat = `${Date.now()}-${Math.floor(Math.random() * 1E9)}.${fileArr[fileArr.length - 1]}`;
        cb(null, fileFormat);
    }
})

const upload = multer({storage});
module.exports = {upload, cosfun};
