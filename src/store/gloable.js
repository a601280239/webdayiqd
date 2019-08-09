//***************定义一些全局的变量*********************//
//该配置是后台授权中心的代码
const ssoserverpath='http://localhost:10000/sso/auth/'
//该配置是后台业务服务的访问地址
const serverpath='http://localhost:10000/api/manger/'
const userinfo={}
const webSocket=null
//全局的配置的一些服务端的域名

//WebSocket实时信息提示功能
const webSocketUrl='ws://localhost:8080/ws/websocket/'
export default{
  serverpath,
  ssoserverpath,
  userinfo,
  webSocket,
  webSocketUrl
}
