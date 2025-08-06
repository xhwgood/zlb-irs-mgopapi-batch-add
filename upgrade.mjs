import axios from 'axios'
// 处理单个 API 升级请求
const handleApiUpgrade = async ({ apiId, api, method }, headers) => {
  if (!apiId) {
    console.error('apiId is undefined')
    return
  }

  const data = JSON.stringify({
    apiId
  })

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://op-irs.zj.gov.cn/wireless/service/portal/api/operation/upgrade',
    headers: {
      ...headers,
      Referer: 'https://op-irs.zj.gov.cn/mobile/gateway/api'
    },
    data: data
  }

  try {
    // const response = await axios.request(config)
    // console.log('升级请求的响应体：', apiId, response.data)
    let getConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://op-irs.zj.gov.cn/wireless/service/portal/api/info/get?__noCache__=${new Date().getTime()}&apiId=${apiId}`,
      headers: {
        ...headers,
        'Accept': '*/*',
        'Referer': `https://op-irs.zj.gov.cn/mobile/gateway/api/add/basic?apiId=${apiId}`,
      }
    }

    const zeroResponse = await axios.request(getConfig)

    // 第一次 编辑
    const firstData = JSON.stringify(zeroResponse.data.data.apiInfo)
    console.log('firstData:', firstData)
    const firstConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://op-irs.zj.gov.cn/wireless/service/portal/api/info/updateBasic',
      headers: {
        ...headers,
        'Accept': '*/*',
        'Referer': `https://op-irs.zj.gov.cn/mobile/gateway/api/add/basic?apiId=${apiId}`,
      },
      data: firstData
    }
    const firstResponse = await axios.request(firstConfig)
    console.log('第一次请求 - 更新服务信息', apiId, firstResponse.data)
    // 第二次请求 - 更新服务信息
    const secondData = JSON.stringify({
      "apiType": 2,
      "apiId": apiId,
      "apiHttpInvokeConfigDTO": {
        "prodUrl": `https://child.wzswsj.gov.cn/axtParent${api}`,
        "testUrl": `http://47.96.238.191:7904/axtParent${api}`,
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
        'Referer': `https://op-irs.zj.gov.cn/mobile/gateway/api/add/service-info/${apiId}`,
      },
      data: secondData
    }
    const secondResponse = await axios.request(secondConfig)
    console.log('第二次请求 - 更新服务信息', apiId, secondResponse.data)
    // 第三次请求 - 更新参数信息
    const thirdData = JSON.stringify({
      "mappingType": method === 'GET' ? 1 : 0,
      "contentType": "application/json",
      "queryParams": [],
      "inBodyParams": [],
      "outBodyParams": [],
      "apiId": apiId
    })

    const thirdConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://op-irs.zj.gov.cn/wireless/service/portal/api/info/updateParam',
      headers: {
        ...headers,
        'Referer': `https://op-irs.zj.gov.cn/mobile/gateway/api/add/params-http/${apiId}`,
      },
      data: thirdData
    }

    const thirdResponse = await axios.request(thirdConfig)
    console.log('第三次请求 - 完成', apiId, thirdResponse.data)
  } catch (error) {
    console.error(`处理 apiId ${apiId} 时出错:`, error.message)
  }
}

export default handleApiUpgrade
