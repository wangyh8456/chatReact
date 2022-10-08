import fetch from "../utils/fetch";

/********************登录相关***************************/
//登录
export function Login(data) {
  return fetch({
      url: "/api/user/login",
      method: "post",
      data: data,
  });
}
//注册
export function register(data) {
  return fetch({
      url: "/api/user/create",
      method: "post",
      data: data,
  });
}
//更新
export function updateUser(data) {
  return fetch({
      url: "/api/user/update",
      method: "post",
      data: data,
  });
}
//修改密码
export function changePwd(data) {
  return fetch({
      url: "/api/user/changepwd",
      method: "post",
      data: data,
  });
}
//获取头像列表
export function getAvatarList() {
  return fetch({
      url: "/api/user/getAvatar",
      method: "post"
  });
}
/********************好友相关***************************/
//添加好友
export function addFriend(data) {
  return fetch({
      url: "/api/friend/create",
      method: "post",
      data: data,
  });
}
//同意或拒绝申请
export function updateFriendStatus(data) {
  return fetch({
      url: "/api/friend/updateStatus",
      method: "post",
      data: data,
  });
}
//修改备注
export function updateRemark(data) {
  return fetch({
      url: "/api/friend/updateRemark",
      method: "post",
      data: data,
  });
}
//查找新朋友
export function searchNewFriend(data) {
  return fetch({
      url: "/api/friend/search",
      method: "post",
      data: data,
  });
}
//获取好友列表
export function getFriendList(data) {
  return fetch({
      url: "/api/friend/getFriendList",
      method: "post",
      data: data,
  });
}
//获取好友申请
export function getFriendRequest(data) {
  return fetch({
      url: "/api/friend/getFriendRequest",
      method: "post",
      data: data,
  });
}
/********************私聊相关***************************/
//发送消息
export function addFriendMessage(data) {
  return fetch({
      url: "/api/fmessage/create",
      method: "post",
      data: data,
  });
}
//获取消息
export function getFriendMessage(data) {
  return fetch({
      url: "/api/fmessage/getList",
      method: "post",
      data: data,
  });
}
//删除消息
export function deleteFriendMessage(data) {
  return fetch({
      url: "/api/fmessage/delete",
      method: "post",
      data: data,
  });
}
//获取一个好友最新消息
export function getOneFriendNews(data) {
  return fetch({
      url: "/api/fmessage/getNews",
      method: "post",
      data: data,
  });
}
//上传图片
export function fmessageUpload(data) {
  return fetch({
      url: "/api/fmessage/uploadFile",
      method: "post",
      data: data,
  });
}
/********************群相关***************************/
//创建群
export function addGroup(data) {
  return fetch({
      url: "/api/group/create",
      method: "post",
      data: data,
  });
}
//邀请成员
export function insertGroup(data) {
  return fetch({
      url: "/api/group/createug",
      method: "post",
      data: data,
  });
}
//退出群
export function quitGroup(data) {
  return fetch({
      url: "/api/group/quit",
      method: "post",
      data: data,
  });
}
//获取群列表
export function getGroups(data) {
  return fetch({
      url: "/api/group/getlist",
      method: "post",
      data: data,
  });
}
//更新群信息
export function updateGroup(data) {
  return fetch({
      url: "/api/group/update",
      method: "post",
      data: data,
  });
}
/********************群聊相关***************************/
//发送消息
export function addGroupMessage(data) {
  return fetch({
      url: "/api/gmessage/create",
      method: "post",
      data: data,
  });
}
//获取消息
export function getGroupMessage(data) {
  return fetch({
      url: "/api/gmessage/getList",
      method: "post",
      data: data,
  });
}
//删除消息
export function deleteGroupMessage(data) {
  return fetch({
      url: "/api/gmessage/delete",
      method: "post",
      data: data,
  });
}
//获取一个好友最新消息
export function getOneGroupNews(data) {
  return fetch({
      url: "/api/gmessage/getNews",
      method: "post",
      data: data,
  });
}
//上传图片
export function gmessageUpload(data) {
  return fetch({
      url: "/api/gmessage/uploadFile",
      method: "post",
      data: data,
  });
}
