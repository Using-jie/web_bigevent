$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initCate();

  // 初始化富文本编辑器
  initEditor();

  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表数据失败！ ");
        }

        // 通过模板引擎渲染分类的下拉菜单
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // ！！一定要记住 render()
        form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //   选择文件的点击事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  //   监听 coverFile 的 change事件，获取用户选择的文件列表
  $("#coverFile").on("change", function (e) {
    // 获取文件列表
    var files = e.target.files;
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return;
    }
    // 根据文件 创建对应的URL地址
    var newImgURL = URL.createObjectURL(files[0]);
    // 为裁剪区域重新设置图片
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 定义文章状态
  var art_state = "已发布";
  // 为存为草稿时 绑定点击事件处理函数
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  // 为表单绑定 submit 事件
  $("#form-pub").on("submit", function (e) {
    // 1.阻止表单的默认提交行为
    e.preventDefault();
    // 2.基于form表单 快速创建一个 DataForm对象
    var fd = new FormData($(this)[0]);
    // 3.将文章的发布状态，存到fd中
    fd.append("state", art_state);
    //   4.将裁剪封面的图片 输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5.将文件对象 存储到fd中
        fd.append("cover_img", blob);
        // 发起Ajax请求
        publishArticle(fd);
      });
  });
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // ！！如果提交对象为 FormData 格式数据
      // 必须添加以下两个配置项
      contentType: false,
      processDate: false,
      success: function (res) {
        if (res !== 0) {
          return layer.msg("发布文章失败! ");
        }
        layer.msg("发布文章成功! ");
        // 发布成功后跳转到文章列表界面
        location.href = "/article/art_list.html";
      },
    });
  }
});
