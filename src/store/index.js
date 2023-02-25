import {createStore} from 'vuex'
import EmptyUser from "@/utils/objects/EmptyUser";
// import {getCurrentUser} from "@/utils";
// import defaultAvatar from "@/assets/images/defaultAvatar.jpeg"
const defaultAvatar = "https://pics.keker.icu/face.jpg"

export default createStore({
  state: {
    // 本用户的信息 example
    // userInfo: {
    //   name: "科科",
    //   id: "607193757117c708b0a63459",
    //   email: "mk@meike.cyou",
    //   detail: "生命不止，开发不息",
    //   phone: "13235410297",
    //   username: "meike",
    //   gender: "男性",
    //   verification: "知市开发团队",
    //   followList: [
    //     "609a333e826a777f31d4aa97"
    //   ],
    //   blockList: [],
    //   portrait: "https://pics.keker.icu/face.jpg",
    //   isActive: true,
    //   createdDate: "2021-04-16 22:50:01",
    //   modifiedDate: "2021-11-24 17:21:13"
    // }
    bLoginModal: false,
    bNewNotebookModal: false,
    bUserIsLogged: false,
    userInfo: {
      name: "",
      id: "",
      email: "",
      detail: "",
      phone: "",
      username: "",
      gender: "",
      followList: [
        ""
      ],
      blockList: [],
      portrait: defaultAvatar,
      isActive: true,
      createdDate: "",
      modifiedDate: "",
      // verification: "",
    }
  },
  getters: {
    /**
     * 获取新建笔记窗口的显示状态
     * @return {boolean} 是否显示
     * */
    getNewNoteModal: state => {
      return state.bNewNotebookModal
    },
    /**
     * 获取store中的用户登陆状态
     * */
    getUserIsLogged: (state) => {
      return state.bUserIsLogged
    },
    /**
     * 获取用户信息
     * @return {Object} 用户信息
     * */
    getUserInfo: state => {
      return state.userInfo;
    },
    /**
     * 获取用户昵称
     * @return {String} 用户昵称
     * */
    getUserName: state => {
      return state.userInfo.name;
    },
    /**
     * 获取用户id
     * @return {String} 用户id
     * */
    getUserId: state => {
      return state.userInfo.id;
    },
    /**
     * 获取用户邮箱
     * @return {String} 用户邮箱
     * */
    getUserEmail: state => {
      return state.userInfo.email;
    },
    /**
     * 获取用户详细信息
     * @return {String} 用户详细信息
     * */
    getUserDetail: state => {
      return state.userInfo.detail;
    },
    /**
     * 获取用户手机号
     * @return {String} 用户手机号
     * */
    getUserPhone: state => {
      return state.userInfo.phone;
    },
    /**
     * 获取用户用户名
     * @return {String} 用户用户名
     * */
    getUserUsername: state => {
      return state.userInfo.username;
    },
    /**
     * 获取用户性别
     * @return {String} 用户性别
     * */
    getUserGender: state => {
      return state.userInfo.gender;
    },
    /**
     * 获取用户关注列表
     * @return {Array} 用户关注列表
     * */
    getUserFollowList: state => {
      return state.userInfo.followList;
    },
    /**
     * 获取用户黑名单
     * @return {Array} 用户黑名单
     * */
    getUserBlockList: state => {
      return state.userInfo.blockList;
    },
    /**
     * 获取用户头像
     * @return {String} 用户头像URL
     * */
    getUserPortrait: state => {
      return state.userInfo.portrait;
    },
    /**
     * 获取用户状态是否为活跃账户
     * @return {Boolean} 是否为活跃账户
     * */
    getUserIsActive: state => {
      return state.userInfo.isActive;
    },
    /**
     * 获取用户注册时间
     * @return {String} 用户注册时间
     * */
    getUserCreatedDate: state => {
      return state.userInfo.createdDate;
    },
    /**
     * 获取用户资料修改时间
     * @return {String} 用户资料修改时间
     * */
    getUserModifiedDate: state => {
      return state.userInfo.modifiedDate;
    },
  },
  // mutations负责同步数据修改
  mutations: {
    /**
     * 更新用户信息
     * @param state store state
     * @param userInfo 用户信息对象
     * */
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    /**
     * 修改登陆界面可见性
     * @param state store state
     * @param {Boolean} payload 登录界面可见值
     * */
    setLoginModal: (state, payload) => {
      state.bLoginModal = payload;
    },
    /**
     * 修改新建笔记窗口可见性
     * @param state store state
     * @param {Boolean} payload 新建笔记窗口可见性
     * */
    setNewNotebookModal: (state, payload) => {
      state.bNewNotebookModal = payload;
    },
    /**
     * 修改store中的用户是否已登录
     * @param state store state
     * @param {Boolean} payload 用户在线值
     * */
    setUserIsLogged: (state, payload) => {
      state.bUserIsLogged = payload;
    }
  },
  // actions 负责异步数据修改
  actions: {
    /**
     * 从后端获取用户信息并写入state
     * */
    // async writeUserInfo({commit}) {
      // const userInfo = await getCurrentUser();
      // console.log(userInfo)
      // if (userInfo) {
      //   commit("setUserInfo", userInfo);
      // } else {
      //   // getCurrentUser()返回false的情况
      //   console.log('writeUserInfo(): getCurrentUser返回false - 未登录')
      // }
    // },
    /**
     * 登出
     * @param commit store commit
     * */
    async logout({commit}) {
      commit("setUserIsLogged", false);
      commit("setUserInfo", EmptyUser);
      localStorage.removeItem("jwt");
    },
    /**
     * 修改登陆界面可见性
     * @param commit store commit
     * @param {Boolean} payload 登陆界面可见值
     * */
    async changeLoginModal({commit}, payload) {
      commit("setLoginModal", payload);
    }
  },
  modules: {}
})
