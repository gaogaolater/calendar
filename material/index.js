(function () {
    // 月份增量
    var today = Solar.fromDate(new Date());
    function generate() {
      var year = $(".year-control").val();
      if (year != today.getYear()) {
        $(".year-control").val(today.getYear());
      }
      var yearString = today.getYear();
      var monthIndex = today.getMonth() - 1;
      var year = SolarYear.fromYear(yearString);
      var months = year.getMonths();
      var s = "";
      var WEEK = "日一二三四五六".split("");
      // 0-6周几起 0是周日
      var start = 0;
      // 循环月
      var month = months[monthIndex];
      var weeks = month.getWeeks(start);
      s += '<ul class="month"><h3>' + month.getMonth() + "月</h3>";
      // 循环周
      // 先输出周标题
      for (var i = 0; i < 7; i++) {
        s += '<li class="week">' + WEEK[(i + start) % 7] + "</li>";
      }
      // 再输出周内容
      for (var m = 0, n = weeks.length; m < n; m++) {
        var week = weeks[m];
        var days = week.getDays();
        for (var i = 0, j = days.length; i < j; i++) {
          var d = days[i];
          var lunar = d.getLunar();
          var text = lunar.getDayInChinese();
          var isHoliday = false;
          var isRest = false;
          var isFestival = false;

          // 阳历节日
          var fs = d.getFestivals();
          if (fs.length > 0) {
            text = fs[0];
            isFestival = true;
          }

          // 农历节日
          fs = lunar.getFestivals();
          if (fs.length > 0) {
            text = fs[0];
            isFestival = true;
          }

          // 初一
          if (1 === lunar.getDay()) {
            text = lunar.getMonthInChinese() + "月";
            isFestival = false;
          }

          // 节气
          var jq = lunar.getJieQi();
          if (jq) {
            text = jq;
            isFestival = true;
          }

          var h = HolidayUtil.getHoliday(d.toYmd());
          if (h) {
            isHoliday = true;
            isRest = !h.isWork();
          }

          var classes = [];
          if (d.toYmd() == today.toYmd()) {
            classes.push("today");
          }
          if (isFestival) {
            classes.push("festival");
          }
          if (isRest) {
            classes.push("rest");
          }
          if (d.getMonth() != month.getMonth()) {
            classes.push("other");
          }

          s += '<li class="' + classes.join(" ") + '">' + d.getDay();
          s += "<i>" + text + "</i>";
          if (isHoliday) {
            s += "<u>" + (isRest ? "休" : "班") + "</u>";
          }
          s += "</li>";
        }
      }
      s += "</ul>";
      $("#body").html(s);
    }

    generate(Solar.fromDate(new Date()));

    var throttle = function (fn, delay, atleast) {
      var timer = null;
      var previous = null;
      return function () {
        var now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
          fn();
          previous = now;
          clearTimeout(timer);
        } else {
          clearTimeout(timer);
          timer = setTimeout(function () {
            fn();
            previous = null;
          }, delay);
        }
      };
    };

    $(".year-control").on("change", function () {
      today = Solar.fromDate(
        new Date(
          parseInt($(this).val()),
          today.getMonth() - 1,
          today.getDay()
        )
      );
      generate();
    });

    $(".pre").on("click", function () {
      today = today.nextMonth(-1);
      generate();
    });

    $(".next").on("click", function () {
      today = today.nextMonth(1);
      generate();
    });
    $(".today-control").on("click", function () {
      today = Solar.fromDate(new Date());
      generate();
    });
  })();