import axios from 'axios'
/** 你的生产环境地址 */
const PROD_URL = ''
/** 你的测试环境地址，如果没有测试环境，可直接使用生产环境地址 */
const TEST_URL = ''

/**
 * 将路径字符串转换为驼峰命名
 * @param path 路径字符串，例如 '/user/single/parent/type'
 * @returns 驼峰命名字符串，例如 'userSingleParentType'
 */
export const pathToCamelCase = (path) => {
  // 移除开头的斜杠，并按斜杠分割
  const parts = path.replace(/^\//, '').split('/')

  // 将每个部分的首字母大写（除了第一个部分）
  return parts.map((part, index) => {
    if (index === 0) {
      return part
    }
    return part.charAt(0).toUpperCase() + part.slice(1)
  }).join('')
}

export const toMgopAPI = (url) => `mgop.xx.xxx.${pathToCamelCase(url)}`

// 处理单个 API 升级请求
const handleApiUpgrade = async ({ api, method, name }, headers) => {
  try {
    // 第一次 添加
    const firstData = JSON.stringify({
      "allowedEntrances": ["H5", "APP"],
      "isNeedLogin": false,
      "apiName": toMgopAPI(api),
      "apiNameCh": name,
      "description": `${name}，${api}`,
      "sysId": "3001715876"
    })
    const firstConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://op-irs.zj.gov.cn/wireless/service/portal/api/info/add',
      headers: {
        ...headers,
        'Accept': '*/*',
        'Referer': `https://op-irs.zj.gov.cn/mobile/gateway/api/add/basic`,
      },
      data: firstData
    }
    const firstResponse = await axios.request(firstConfig)
    console.log('第一次请求 - 添加', typeof firstResponse.data, firstResponse.data)
    // 第二次请求 - 添加
    const secondData = JSON.stringify({
      "apiType": 2,
      "apiId": firstResponse.data.data,
      "apiHttpInvokeConfigDTO": {
        "prodUrl": `${PROD_URL}${api}`,
        "testUrl": `${TEST_URL}${api}`,
        "requestEncodeType": "UTF-8",
        "requestMethod": method
      },
      "timeout": 30000,
      "limitedTrans": 1000
    })

    const secondConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://op-irs.zj.gov.cn/wireless/service/portal/api/info/updateService',
      headers: {
        ...headers,
        'Referer': `https://op-irs.zj.gov.cn/mobile/gateway/api/add/service-info/${firstResponse.data.data}`,
      },
      data: secondData
    }
    const secondResponse = await axios.request(secondConfig)
    console.log('第二次请求 - 更新服务信息', secondResponse.data)
    // 第三次请求 - 添加
    const thirdData = JSON.stringify({
      "mappingType": method === 'GET' ? 1 : 0,
      "contentType": "application/json",
      "queryParams": [],
      "inBodyParams": [],
      "outBodyParams": [],
      "apiId": firstResponse.data.data
    })

    const thirdConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://op-irs.zj.gov.cn/wireless/service/portal/api/info/updateParam',
      headers: {
        ...headers,
        'Referer': `https://op-irs.zj.gov.cn/mobile/gateway/api/add/params-http/${firstResponse.data.data}`,
      },
      data: thirdData
    }

    const thirdResponse = await axios.request(thirdConfig)
    console.log('第三次请求 - 完成', thirdResponse.data)
  } catch (error) {
    console.error(`处理 ${api} 时出错:`, error.message)
  }
}

export default handleApiUpgrade
