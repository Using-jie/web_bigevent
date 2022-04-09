$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称的长度只能是1 ~ 6个字符之间！";
      }
    },
  });
});
initUserInfo();

// 初始化用户信息
function initUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg("获取用户信息失败！");
      }
    console.log(res.data);
      // 调用 form.val()快速为表单赋值
      layui.form.val("formUserInfo", res.data);
    },
  });
}

//重置表单数据
$("#reset").on("click", function (e) {
  // 阻止表单的默认提交行为
  e.preventDefault();
  initUserInfo();
});

//监听表单提交事件
$(".layui-form").on("submit", function (e) {
  // 阻止表单的默认提交行为
  e.preventDefault();
  $.ajax({
    method: "POST",
    url: "/my/userinfo",
    data: $(this).serialize(),
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg("修改信息失败！");
      }
      layer.msg("修改信息成功！");
      //  调用父页面中的方法 重新渲染用户的头像和用户
      window.parent.getUserInfo();
    },
  });
});
