/**
 * 本js文件为请求封装js文件，
 * 请从此调用，如无单独说明，
 * 请在请求头附带Token。
 * */
import store from "@/store";
import Notification, {
  msgDuration,
  msgPosition,
  msgTextAlign,
  msgType,
} from "@/utils/basic/Notification";
import Request from "@/utils/basic/Request";
import { getUUID, getToken } from "@/utils/basic/User";

const apiUrl = "https://zhishiapi.keker.tech";

// 如果没有token，则使用默认token
const token = getToken();

export const funcType = {
  CREATE: 0,
  UPDATE: 1,
};

/**
 * 通知用户此链接指向网页未开放浏览，此方法不涉及网络请求。
 * @param {String} url 链接
 * */
export const showLinkDisabled = (url = "未指定链接") => {
  Notification.Notify(
    `该区域暂未开放{${url}}`,
    "提示",
    msgType.WARNING,
    msgPosition.TOP_RIGHT
  );
};

/**
 * 登录功能，不必附带Token。
 * @param {Object} obj 登录信息对象，包含账号、密码、clientId以及预留的验证码位置
 * @return {Promise} 返回一个Promise对象，请求成功后返回 {String} token, {Boolean} isLogin.
 * */
export const postLogin = (obj) => {
  return Request.fetchPost(`${apiUrl}/auth/login`, null, obj);
};

/**
 * 使用LocalStorage向中的token服务器请求目前登录信息，并返回，若未登录返回false
 * @returns {Promise|Boolean} Promise-userInfo:从服务器获取的用户信息； Boolean-false:未登录
 * */
export const getCurrentUser = () => {
  // TODO: 2022/02/10 测试期间游客暂时使用默认Token，正式上线时删除
  let requestUrl;
  requestUrl = `${apiUrl}/auth/current?Token=${token}`;
  // 若有token，则请求服务器获取用户信息
  return Request.fetchGet(requestUrl, null)
    .then((r) => {
      if (r.status === 200) {
        return r.json();
      } else {
        // if (r.status === 500) {
        //     throw {
        //         status: r.errorCode,
        //         message: r.errorMes,
        //     }
        // } else {
        throw {
          status: r.status,
          statusText: r.statusText,
        };
        // }
      }
    })
    .then((res) => {
      if (res.name) {
        return res;
      } else {
        throw {
          status: res.errorCode,
          statusText: res.errorMes,
        };
      }
    })
    .catch((errObj) => {
      Notification.Notify(
        `获取用户信息出错，错误码：${errObj.statusText},${errObj.status} .`,
        {
          title: "出错了",
          type: msgType.ERROR,
          duration: msgDuration.LONG,
          position: null,
          offset: null,
          HTML: false,
        }
      );
      // 若请求失败，则清除token
      localStorage.removeItem("jwt");
      return false;
    });
  // }
};

/**
 * 页面初始化
 * */
export const pageInit = async () => {
  // 检查与生成uuid，并存入localStorage，如果已有则相当于刷新有效期
  localStorage.setItem("uuid", getUUID());

  await getCurrentUser().then((r) => {
    if (r) {
      // 只有返回数据状态码为200时会经过此语句。
      store.commit("setUserIsLogged", true);
      store.commit("setUserInfo", r);
    } else {
      store.commit("setUserIsLogged", false);
    }
  });

  // this.$store.dispatch("writeUserInfo");
  // 从后端获取用户信息
  // const userInfo = getCurrentUser();
  // if (userInfo === false) {
  //     // 未登录 提示登录或者注册
  //     console.log("未登录");
  // }
};

/**
 * 获得推荐笔记
 * @param {number} pageNum 页码，从0开始，必填
 * @param {number} pageSize 每页展示笔记数量，必填
 * @return {Promise} 返回Promise对象，请求成功后返回后端推荐笔记
 * */
export const getCommendNotes = (pageNum, pageSize) => {
  const requestUrl = `${apiUrl}/service-server/note/commend?pageNum=${pageNum}&pageSize=${pageSize}`;
  return Request.fetchGet(requestUrl, { Token: token })
    .then((r) => {
      if (r.status === 200) {
        return r.json();
      } else {
        throw {
          status: r.status,
          statusText: r.statusText,
        };
      }
    })
    .then((res) => {
      if (res.length === 0) {
        Notification.Notify("暂时没有更多笔记了，稍后再来吧。", {
          type: msgType.WARNING,
          center: msgTextAlign.CENTERED,
          duration: msgDuration.LONG,
        });
        return [];
      } else {
        return res;
      }
    })
    .catch((errObj) => {
      Notification.Notify(
        `无法取得推荐笔记，请休息一会儿，再来刷新看看。错误码：${errObj.status}，${errObj.statusText}`,
        {
          title: "服务器开小差了",
          type: msgType.ERROR,
          duration: msgDuration.LONG,
        }
      );
      return [];
    });
};

/**
 * 获得推荐作者
 * @todo 请求推荐作者的数量在正式上线时应改为9个
 * @param {Number} number 暂时未知后端此处value代表含义，并非推荐数量。
 * */
export const getRecommendUsers = (number = 3) => {
  const requestUrl = `${apiUrl}/service-server/user/commend?value=${number}`;
  return Request.fetchGet(requestUrl, { Token: token })
    .then((r) => {
      if (r.status === 200) {
        return r.json();
      } else {
        if (r.status === 500) {
          throw {
            status: r.errorCode,
            message: r.errorMes,
          };
        } else {
          throw {
            status: r.status,
            statusText: r.statusText,
          };
        }
      }
    })
    .catch((err) => {
      Notification.Notify(
        `无法取得推荐作者，请休息一会儿，再来刷新看看。错误码：${err.status}，${err.statusText}`,
        {
          title: "服务器开小差了",
          type: msgType.ERROR,
          duration: msgDuration.LONG,
        }
      );
      return [];
    });
};

/**
 * 获得笔记内容
 * @param {string} nid 笔记ID
 * */
export const getNoteDetail = (nid) => {
  const reqUrl = `${apiUrl}/service-server/note/read?nid=${nid}`;
  return Request.fetchGet(reqUrl, { Token: token });
};

/**
 * 获取单个用户基本信息
 * @param {string} id 用户id
 * */
export const getSingleUserInfo = (id) => {
  const reqUrl = `${apiUrl}/service-server/user/single?id=${id}`;
  return Request.fetchGet(reqUrl, { Token: token });
};

/**
 * 笔记搜索
 * @param {string} key 关键词
 * @param {number} pageNum 页码
 * @param {number} pageSize 每页展示笔记数量
 * */
export const getSearchNote = (key, pageNum, pageSize) => {
  const reqUrl = `${apiUrl}/service-server/note/search?key=${key}&pageNum=${pageNum}&pageSize=${pageSize}`;
  return Request.fetchGet(reqUrl, { Token: token });
};

/**
 * 获得本人笔记本列表
 * */
export const getMyNotebookList = () => {
  const reqUrl = `${apiUrl}/service-server/note/notebooks`;
  // const token = getToken();
  return Request.fetchGet(reqUrl, { Token: token });
};

/**
 * 获得笔记本内笔记
 * @param {string} nid notebook id
 * */
export const getSingleNotebook = (nid) => {
  const reqUrl = `${apiUrl}/service-server/note/notes?nid=${nid}`;
  // const token = getToken();
  return Request.fetchGet(reqUrl, { Token: token });
};

/**
 *  获取收藏列表
 *  */
export const getMyCollections = () => {
  const reqUrl = `${apiUrl}/service-server/kind/collections`;
  // const token = getToken();
  return Request.fetchGet(reqUrl, { Token: token });
};
/* 添加收藏 */
export const collectnote = (collectionIds, nid) => {
  const reqUrl = `${apiUrl}/service-server/kind/collect?collectionIds=${collectionIds}&nid=${nid}`;
  // const token = getToken();
  return Request.fetchGet(reqUrl, { Token: token });
};
/**
 * 获取所有分类
 * */
export const getAllKinds = () => {
  const reqUrl = `${apiUrl}/service-server/kind/getAllKinds`;
  return Request.fetchGet(reqUrl, { Token: token });
};

/**
 * @function deleteNote
 * @description 删除笔记（本）
 * @param {String} nid 笔记本id
 * */
export const deleteNote = (nid) => {
  const reqUrl = `${apiUrl}/service-server/note/delete?nid=${nid}`;
  return Request.fetchDel(reqUrl, { Token: token }).then((r) => {
    if (r.status === 200 && r.statusText === "OK") {
      return r;
    } else {
      throw {
        status: r.status,
        statusText: r.statusText,
      };
    }
  });
};

/**
 * @function postNoteUpdate
 * @description 创建笔记(本)或修改笔记(本)信息
 * @param {Object} notebookObj 要创建/修改信息的笔记(本)
 * @param {Number} type 操作状态码：0, 创建；1, 修改
 * @example 创建笔记本只需四个属性构成的对象，即：
 * {
 *   contain: "This is my notebook!",
 *   kindId: "60702a6b36b8281fa9073e01",
 *   open: true,
 *   title: "The Book"
 * }
 * */
export const postNoteUpdate = (notebookObj, type) => {
  const reqUrl = `${apiUrl}/service-server/note/update`;
  if (type === funcType.CREATE) {
    // 创建笔记（本）
    return Request.fetchPost(reqUrl, { Token: token }, notebookObj).then(
      async (r) => {
        if (r.status === 200) {
          return r.json();
        } else {
          throw {
            status: r.status,
            statusText: r.statusText,
          };
        }
      }
    );
  } else if (type === funcType.UPDATE) {
    // 修改笔记（本）
    return Request.fetchPost(reqUrl, { Token: token }, notebookObj).then(
      async (r) => {
        if (r.status === 200) {
          return r.json();
        } else {
          throw {
            status: r.status,
            statusText: r.statusText,
          };
        }
      }
    );
  } else {
    throw {
      errorCode: 1,
      errorMsg: "操作非法，请检查表单！",
    };
  }
};
/* 获取评论列表 */
export const getallComments = (nid) => {
  const reqUrl = `${apiUrl}/service-server/comment/allComments?nid=${nid}`;
  return Request.fetchGet(reqUrl, { Token: token });
};
/* 发送评论 */
export const postallComments = (obj) => {
  const reqUrl = `${apiUrl}/service-server/comment/comment`;
  return Request.fetchPost(reqUrl, { Token: token }, obj);
};
/* 删除评论 */
export const deleteComment = (cid) => {
  const reqUrl = `${apiUrl}/service-server/comment/deleteComment?cid=${cid}`;
  return Request.fetchDel(reqUrl, { Token: token }).then((r) => {
    if (r.status === 200 && r.statusText === "OK") {
      return r;
    } else {
      throw {
        status: r.status,
        statusText: r.statusText,
      };
    }
  });
};
export const notelike = (oid, type) => {
  const reqUrl = `${apiUrl}/service-server/note/like?nid=${oid}type=${type}`;
  return Request.fetchGet(reqUrl, { Token: token });
};
/**
 * ApiFox测试
 * */
export const getScriptList = () =>
  Request.fetchGet("http://127.0.0.1:4523/mock/572258/getScriptList").then(
    (res) => res.json()
  );
