// @ts-check
import apiList from './api-list.json' assert { type: 'json' }
import add from './add.mjs'

const headers = {
  'Accept': 'application/json',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Origin': 'https://op-irs.zj.gov.cn',
  'Pragma': 'no-cache',
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
    await add({
      ...item,
      api: item.url
    }, headers)
    // console.log('等待3秒后处理下一个...')
    await delay(3000) // 延迟3秒
  }
}

main().catch(console.error)