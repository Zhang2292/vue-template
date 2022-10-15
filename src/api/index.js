import * as trademark from './product/tradeMark'
import * as spu from './product/spu'
import * as sku from './product/sku'
import * as attr from './product/attr'
// 引入权限相关的接口
import permission from './acl/permission'
import role from './acl/role'
import * as user from './acl/user'

export default {
  trademark,
  spu,
  sku,
  attr,
  permission,
  role,
  user,
}