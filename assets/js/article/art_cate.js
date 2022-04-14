$(function () {
  // 获取文章类别列表
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  var layer = layui.layer;
  var form = layui.form;
  //   为添加类别绑定点击事件

  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章类别",
      content: $("#dialog-add").html(),
    });
  });

  // 通过代理的形式，为form-add 表单 绑定 submit事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增分类失败 ! ");
        }
        initArtCateList();
        layer.msg("新增分类成功 ! ");
        layer.close(indexAdd);
      },
    });
  });

  // 通过代理形式，为btn-edit 按钮绑定点击事件
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章类别",
      content: $("#dialog-edit").html(),
    });
    var id = $(this).attr("data-id");
    // 发起请求对应的分类数据
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        form.val("form-edit", res.data);
      },
    });
  });

  // 通过代理形式，为修改表单分类绑定submit事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改分类信息失败");
        }
        layer.msg("修改分类信息成功");
        initArtCateList();
        layer.close(indexEdit);
      },
    });
  });

  // 通过代理形式，为btn-delete绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    // 弹出询问框 询问用户是否删除
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            layer.msg("删除信息失败");
          }
          layer.msg("删除信息成功");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
