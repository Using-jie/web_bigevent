$(function () {
  getUserInfo();
  //点击按钮 实现退出功能
  $("#btnLogin").on("click", function () {
    var layer = layui.layer;
    //消息弹出提示
    layer.confirm("确定退出登录吗?", { icon: 3, title: "提示" }, 
    function (index) {
      //回调函数 (确认后)
    // 清空本地存储的 token
    localStorage.removeItem('token')
    // 重新跳转到登陆页面
    location.href = '/login.html'
   
   
    // 关闭提示询问框
    layer.close(index)
    });
  });
});

//获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    //请求头字段
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      //调用 renderAvatar 渲染用户头像
      renderAvatar(res.data);
    },
    //无论成功与否  都会最终调用 complte 回调函数
    // complete : function(res){
    //     // console.log(res)
    //     // 拿到 res.responseJSON 即为服务器响应的数据
    //     if(res.responseJSON.status===1 && res.responseJSON.message ==='身份认证失败！'){
    //         //强制清空token
    //         localStorage.removeItem('token')
    //         // 跳转至登录界面
    //         location.href = '/login.html'
    //     } 
    // }
  });
}
// 渲染用户头像
function renderAvatar(user) {
  //获取用户名称
  var name = user.nickname || user.username;
  //设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  //按需渲染用户头像
  if (user.user_pic !== null) {
    //渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //渲染文字头像
    var first = name[0].toUpperCase();
    $(".layui-nav-img").hide();
    $(".text-avatar").html(first).show();
  }
}
