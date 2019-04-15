// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
  window.addEventListener(
    "load",
    function() {
      var canvas, context, tool;
      function init() {
        // Find the canvas element.
        canvas = document.getElementById("imageView");
        if (!canvas) {
          alert("Error: I cannot find the canvas element!");
          return;
        }
        if (!canvas.getContext) {
          alert("Error: no canvas.getContext!");
          return;
        }
        // Get the 2D canvas context.
        context = canvas.getContext("2d");
        if (!context) {
          alert("Error: failed to getContext!");
          return;
        }
        // Pencil tool instance.
        tool = new tool_pencil();
        // Attach the mousedown, mousemove and mouseup event listeners.
        canvas.addEventListener("mousedown", ev_canvas, false);
        canvas.addEventListener("mousemove", ev_canvas, false);
        canvas.addEventListener("mouseup", ev_canvas, false);
      }
      // This painting tool works like a drawing pencil which tracks the mouse
      // movements.
      function tool_pencil() {
        var tool = this;
        this.started = false;
        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function(ev) {
          context.beginPath();
          context.moveTo(ev._x, ev._y);
          tool.started = true;
        };
        // This function is called every time you move the mouse. Obviously, it only
        // draws if the tool.started state is set to true (when you are holding down
        // the mouse button).
        this.mousemove = function(ev) {
          if (tool.started) {
            context.lineTo(ev._x, ev._y);
            context.stroke();
          }
        };
        // This is called when you release the mouse button.
        this.mouseup = function(ev) {
          if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
          }
        };
      }
      // The general-purpose event handler. This function just determines the mouse
      // position relative to the canvas element.
      function ev_canvas(ev) {
        if (ev.layerX || ev.layerX == 0) {
          // Firefox
          ev._x = ev.layerX;
          ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) {
          // Opera
          ev._x = ev.offsetX;
          ev._y = ev.offsetY;
        }
        // Call the event handler of the tool.
        var func = tool[ev.type];
        if (func) {
          func(ev);
        }
      }
      init();
    },
    false
  );
}

var canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d");
fitToContainer(canvas);
function fitToContainer(canvas) {
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
$(function() {
  // Sections height
  $(window).resize(function() {
    var sH = $(window).height();
    //alert(sH);
    $(".tableau").css("height", sH + "px");
  });
});

// envoie de l'image Canvas
$("#save").click(function() {
  // alert("ok");
  $.ajax({
    type: "POST",
    url: "/save_canvas",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
      image: document.getElementById("imageView").toDataURL()
    }),
    complete: function(data) {
      console.log("Ajax callback");
      $("#message").html(data.responseText);
      $("#saved_images").append('<img src="/image.png" />');
    }
  });
});
