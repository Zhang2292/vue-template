import request from '@/utils/request'

// 获取SPU列表数据的接口
export const reqPuList = (page,limit,category3Id)=>request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  params: { category3Id }
})
// 获取SPU信息
export const reqSpu = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'get'
})
// 获取品牌的信息
export const reqTradeMarkList = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'get'
})
// 获取SPU图片
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})
// 获取平台全部销售属性————整个平台销售属性一共三个
export const reqBaseSaleAttrList = () => request({
  url: '/admin/product/baseSaleAttrList',
  method: 'get'
})
// 修改SPU || 添加SPU 他俩的唯一区别就是携带的参数是否带id
export const reqAddOrUpDareSpu = (spuInfo) =>{
  // 判断携带的参数有没有id 有则修改 没有则添加
  if (spuInfo.id) {
    // 修改spu
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }else{
    // 添加spu
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}
// 删除SPU
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'delete'
})


