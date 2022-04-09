$(function () {
  var form = layui.form;
  // 为表单自定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samepwd: function (value) {
      if (value ===$('[name=oldPwd]').val()) {
        return "新密码不能与旧密码相同！";
      }
    },
    repwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return "两次密码不一致！";
      }
    },
  });
});

// 重置密码的事件
$('.layui-form').on('submit',function(e){
    e.preventDefault()
    $.ajax({
        method: "POST",
        url: "/my/updatepwd",
        data: $(this).serialize(),
        success: function (res) {
            if(res.status!==0){
                return layui.layer.msg('重置密码失败！')
            }
            layui.layer.msg('重置密码成功！')
            // 重置表单
            $('.layui-form')[0].reset()
        }
    });
})
