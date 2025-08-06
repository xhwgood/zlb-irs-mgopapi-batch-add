import handleApiOnline from './onlineApi.mjs'
import apiList from './api-results.json' assert { type: 'json' }
import handleApiUpgrade from './upgrade.mjs'

const headers = {
  'Accept': 'application/json',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Origin': 'https://op-irs.zj.gov.cn',
  'Pragma': 'no-cache',
  'Referer': 'https://op-irs.zj.gov.cn/mobile/gateway/api/add/basic',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  // Cookies 需要你自己登录账号后抓包获取
  'Cookie': ''
}

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
// 主函数
const main = async () => {
  for (const item of apiList) {
    if (item.apiDevState !== 'INIT') continue
    // 仅处理配置中（即 INIT）状态的接口
    if (item.description.startsWith('/') && item.apiName.includes('mgop.rw.axt')) {
      const method = JSON.parse(item.invokeConfig).requestMethod

      await handleApiUpgrade({
        apiId: item.apiId,
        api: item.description,
        method
      }, headers)
      await handleApiOnline(item.apiId, headers)
      // console.log('等待3秒后处理下一个...')
      await delay(1000) // 延迟3秒
    }
  }
}

main().catch(console.error)

// const apiObj = { apiId: '1002428564', api: '/worker/infectious/disease/update', method: 'POST' }

// await handleApiUpgrade(apiObj, headers)
// await handleApiOnline(apiObj.apiId, headers)
