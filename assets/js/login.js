$(function () {
  //点击"去注册账号"按钮
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  //点击"去登录"按钮
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  //从layui中获取 form 对象
  var form = layui.form;
  //获取 layer对象
  var layer = layui.layer;
  //通过form.verify()函数自定义校验规则
  form.verify({
    //自定义一个叫 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //定义两次密码验证的校验规则
    repwd: function (value) {
      //通过比较两次密码判断
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次输入的密码不一致";
      }
    },
  });
  //监听注册表单的提交事件
  $("#reg-form").on("submit", function (e) {
    // 1.阻止表单的默认提交行为
    e.preventDefault();
    // 2.发起post请求
    var data = {
      username: $("#reg-form [name=username]").val(),
      password: $("#reg-form [name=password]").val(),
    };
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功 请登录！");
      //模拟人的点击行为
      $("#link_login").click();
      var users = $("#reg-form [name=username]").val();
      $("#log-form [name=username]").val(users);
    });
  });
  //监听登录表单的事件
  $("#log-form").submit(function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      //快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("登录失败");
        }
        layer.msg(res.message);
        //将成功的 token字符串 保存到 localStorage中
        localStorage.setItem("token", res.token);
        //跳转后台界面
        location.href = "/index.html";
      },
    });
  });
});
