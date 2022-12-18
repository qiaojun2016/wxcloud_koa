const fs = require("fs");
const request = require("request");
const COS = require("cos-nodejs-sdk-v5");
const BASE_URL = "http://api.weixin.qq.com";
/**
 * 封装的 COS-SDK 初始化函数，建议在服务启动时挂载全局，通过 this.cos 使用对象
 */
async function initcos() {
  const res = await call({
    url: `${BASE_URL}/_/cos/getauth`,
    method: "GET",
  });
  console.log("res = ", res);
  try {
    const info = JSON.parse(res);

    const auth = {
      TmpSecretId: info.TmpSecretId,
      TmpSecretKey: info.TmpSecretKey,
      SecurityToken: info.Token,
      ExpiredTime: info.ExpiredTime,
    };
    this.cos = new COS({
      getAuthorization: async function (options, callback) {
        callback(auth);
      },
    });
    console.log("COS初始化成功");
  } catch (e) {
    console.log("COS初始化失败", e);
  }
}

const cosConfig = {
  Bucket: "7072-prod-9gtbi1n6e3f5757e-1254601016", // 填写云托管对象存储桶名称
  Region: "ap-shanghai", // 存储桶地域，默认是上海，其他地域环境对应填写
};

/**
 * 封装的上传文件函数
 * @param {*} cloudpath 上传的云上路径
 * @param {*} filepath 本地文件路径
 */
async function uploadFile(cloudpath, filepath) {
  const authres = await call({
    url: `${BASE_URL}/_/cos/metaid/encode`,
    method: "POST",
    data: {
      openid: "", // 填写用户openid，管理端为空字符串
      bucket: cosConfig.Bucket,
      paths: [cloudpath],
    },
  });

  console.log("authres:", authres);
  try {
    const auth = JSON.parse(authres);
    const res = await this.cos.putObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: cloudpath,
      StorageClass: "STANDARD",
      Body: fs.createReadStream(filepath),
      ContentLength: fs.statSync(filepath).size,
      Headers: {
        "x-cos-meta-fileid": auth.respdata.x_cos_meta_field_strs[0],
      },
    });
    if (res.statusCode === 200) {
      return {
        code: 0,
        file: JSON.stringify(res),
      };
    } else {
      return {
        code: 1,
        msg: JSON.stringify(res),
      };
    }
  } catch (e) {
    console.log("上传文件失败", e.toString());
    return {
      code: -1,
      msg: e.toString(),
    };
  }
}

/**
 * 封装的网络请求方法
 */
function call(obj) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: obj.url,
        method: obj.method || "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(obj.data ?? {}),
      },
      function (err, response) {
        console.log(err);
        if (err) reject(err);
        resolve(response.body);
      }
    );
  });
}

function getTempDownloadUrl() {
  call({
    url: `${BASE_URL}/batchdownloadfile`,
    method: "POST",
    data: {
      openid: "", // 填写用户openid，管理端为空字符串
      bucket: cosConfig.Bucket,
      paths: [cloudpath],
    },
  });
}

// 导出初始化方法和模型
module.exports = {
  initcos,
  uploadFile,
};
