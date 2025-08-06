# zlb-irs-mgopapi-batch-add

浙里办IRS api批量添加脚本

> 为解决项目要上线至浙里办，但大量接口需要接入 mgop 的问题，特地抓包研究了下，通过该脚本我公司项目可快速实现上百个 api 批量添加和修改

## 如何使用？

```sh
git clone https://github.com/xhwgood/zlb-irs-mgopapi-batch-add.git

cd zlb-irs-mgopapi-batch-add
npm i

# 然后打开 api-list.json ，替换为你项目内相关的api，浙里办API文件夹下有对应的配置图片，可对应 add.mjs 内的各个请求
```

### 主要需要替换文件内的 Cookie，生产环境地址和测试环境地址，以及 toMgopAPI = (url) => `mgop.xx.xxx.${pathToCamelCase(url)} 方法中的接口命名

#### 命名规则：mgop.[公司名称].[系统名称].[操作名称] 如 mgop.alibaba.testcenter.doTest

#### `batchUpgrade.mjs` 文件是批量修改脚本