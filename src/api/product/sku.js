import request from "@/utils/request";
// 获取图片的数据
export const reqSpuImageList = (spuId) => request({
  url:`/admin/product/spuImageList/${spuId}`,
  method: 'get'
})
// 获取销售属性的数据
export const reqSpuSaleAttrList = (spuId) => request({
  url:`/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
})
// 获取平台属性的数据
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({
  url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})
// 添加SKU
export const reqAddSku = (skuInfo) => request({
  url:'admin/product/saveSkuInfo',
  method: 'post',
  data: skuInfo
})
// 获取SKU列表数据的接口
export const reqSkuList = (spuId) => request({
  url: `admin/product/findBySpuId/${spuId}`,
  method: 'get'
})
// 上面都是在spu调用的
// -------------------------------------------------------------------------------------------------------
// SKU列表的接口
export const reqSkuAll = (page,limit) => request({
  url: `/admin/product/list/${page}/${limit}`,
  method: 'get'
})
// 上架
export const reqSale = (skuId) => request({
  url: `/admin/product/onSale/${skuId}`,
  method: 'get'
})
// 下架
export const reqCancel = (skuId) => request({
  url: `/admin/product/cancelSale/${skuId}`,
  method: 'get'
})
// 获取SKU详情的接口
export const reqSkuById = (skuId) => request({
  url: `/admin/product/getSkuById/${skuId}`,
  method: 'get'
})