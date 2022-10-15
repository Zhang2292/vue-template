import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from "@/router";
import router from "@/router";

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: "",
    // 存储用户头像
    avatar: "",
    // 服务器返回的菜单信息
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限的信息
    buttons: [],
    // 由于对比需要展示的路由
    resultAsyncRoutes:[],
    resultAllRoutes: [],
  };
};

const state = getDefaultState();

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    router.addRoutes(state.resultAllRoutes)
  },
};

const computedAsyncRoutes = (asyncRoutes,routes) => {
  // 顾虑出当前用户需要展示的异步路由
  return asyncRoutes.filter(item=>{
    // filter: 数组中没有这个元素返回-1，如果有这个元素返回的一定不是-1
    if(routes.indexOf(item.name)!=-1){
      if(item.children && item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      } 
      return true
    }
  })
}

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 结构出用户名与密码;
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    // mock数据的code是20000
    if (result.code == 20000) {
      commit("SET_TOKEN", result.data.token);
      setToken(result.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then((response) => {
          const { data } = response;
          commit("SET_USERINFO", data);
          commit("SET_RESULTASYNCROUTES",computedAsyncRoutes(asyncRoutes ,data.routes) );
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
