// 注意：每次调用 $.get()或  $.post() $.ajax()
//会先调用 ajaxPrefilter 这个函数
// 在这个函数中、可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  //在真正发起Ajax请求之前，统一拼接请求的根路径
  options.url = "http://www.liulongbin.top:3007" + options.url;
  //为/my/ 统一设置请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  //统一挂载complete
  options.complete = function (res) {
    // console.log(res)
    // 拿到 res.responseJSON 即为服务器响应的数据
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //强制清空token
      localStorage.removeItem("token");
      // 跳转至登录界面
      location.href = "/login.html";
    }
  };
});
