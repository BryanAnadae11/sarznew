//gsap highlight element
document.addEventListener("DOMContentLoaded", (event) => {
    // Check if the element with ID "highlight-style" exists
    const highlight = document.getElementById("highlight-style");

    if (highlight) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray(".text-highlight").forEach((highlight) => {
            ScrollTrigger.create({
                trigger: highlight,
                start: "-100px center",
                onEnter: () => highlight.classList.add("active")
            });
        });

        // Coin scroll trigger
        gsap.utils.toArray(".attribute").forEach(function(elem, i) {
            const dx = [600, -400, -500, 300, 800, -120];
            const dy = [-50, 20, -150, -120, -80, 40];
            const dr = [-190, 200, 60, -290, 230, -540];

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: elem,
                    start: "top 500",
                    scrub: 0.2,
                },
            })
                .to(elem, {
                    x: dx[i],
                    y: dy[i],
                    rotation: dr[i],
                });
        });

        const setHighlightStyle = (value) =>
            document.body.setAttribute("data-highlight", value);

        highlight.addEventListener("change", (e) => setHighlightStyle(e.target.value));

        setHighlightStyle(highlight.value);
    }
});

//Scroll Trigger animation
document.addEventListener("DOMContentLoaded", (event) => {
    // Check if the element with attribute 'data-scroll-container' exists
    const scrollContainer = document.querySelector('[data-scroll-container]');

    if (scrollContainer) {
        const scroller = new LocomotiveScroll({
            el: scrollContainer, // Use locomotive scroll
            smooth: true
        });
    }
});

// Cursor Mousemove:
document.addEventListener("DOMContentLoaded", (event) => {
    const cursorBox = $(".cursor");

    // Check if the cursor element exists
    if (cursorBox.length > 0) {
        gsap.set($(cursorBox), { xPercent: -50, yPercent: -50 });
        let xTo = gsap.quickTo($(cursorBox), "x", { duration: 0.6, ease: "power3" }),
            yTo = gsap.quickTo($(cursorBox), "y", { duration: 0.6, ease: "power3" });

        window.addEventListener("mousemove", (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        });

        const links = $("a");

        // Check if there are any anchor elements
        if (links.length > 0) {
            var mouseInAnimation = false;
            links.on({
                mouseover: function () {
                    mouseInAnimation = gsap.to($(cursorBox), {
                        duration: 1,
                        height: 90,
                        width: 90,
                        backgroundColor: "transparent",
                        ease: Elastic.easeOut,
                    });
                },
                mouseleave: function () {
                    var delay = 0;
                    if (mouseInAnimation && mouseInAnimation.isActive()) {
                        delay = 0.25;
                    }
                    gsap.to($(cursorBox), {
                        duration: 0.5,
                        delay: delay,
                        height: 4,
                        width: 4,
                        backgroundColor: "#00c288",
                        ease: "power3",
                    });
                },
            });
        } else {
            console.warn("No anchor (<a>) elements found.");
        }
    }
});

// Timer
document.addEventListener('DOMContentLoaded', (event) => {
    // Check if the element with ID 'countdown' exists
    const countdownElement = document.getElementById("countdown");

    if (countdownElement) {
        // Set the date we're counting down to
        var countDownDate = new Date("May 5, 2025 15:37:25").getTime();

        // Update the countdown every 1 second
        var x = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the countdown date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes, and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in the element with id="countdown"
            countdownElement.innerHTML = days + "d " + hours + "h " +
                minutes + "m " + seconds + "s ";

            // If the countdown is over, display "EXPIRED"
            if (distance < 0) {
                clearInterval(x);
                countdownElement.innerHTML = "EXPIRED";
            }
        }, 1000);
    }
});

/* Scroll-based animations */
document.addEventListener('DOMContentLoaded', (event) => {
  let $animation_elements = $('.animation-element');
  let $window = $(window);

  function check_if_in_view() {
      let window_height = $window.height();
      let window_top_position = $window.scrollTop();
      let window_bottom_position = (window_top_position + window_height);

      $.each($animation_elements, function() {
          let $element = $(this);
          let element_height = $element.outerHeight();
          let element_top_position = $element.offset().top;
          let element_bottom_position = (element_top_position + element_height);

          //check to see if this current container is within viewport
          if ((element_bottom_position >= window_top_position) &&
              (element_top_position <= window_bottom_position)) {
              $element.addClass('in-view');
          } else {
              $element.removeClass('in-view');
          }
      });
  }

  $window.on('scroll resize', check_if_in_view);
  $('#myModal').on('shown.bs.modal', function(e) {
      check_if_in_view();
  });
  $window.trigger('scroll');
});

/* Tooltip Trigger */
document.addEventListener('DOMContentLoaded', (event) => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});

/* Encrypt Value */
document.addEventListener('DOMContentLoaded', (event) => {
  let crypt_state = false;
  let _el = document.getElementById('encrypt');
  if (_el) {
      _el.addEventListener('click', function() {
          crypt_state = !crypt_state;
          let elements = document.querySelectorAll(".encrypted");
          elements.forEach((el) => el.innerText = crypt_state ? "***" : el.dataset.content);
      });
  }

  window.addEventListener("DOMContentLoaded", function() {
      let elements = document.querySelectorAll(".encrypted");
      elements.forEach((el) => el.setAttribute("data-content", el.innerText));
  })
});

/*--- Chart ---*/
document.addEventListener('DOMContentLoaded', (event) => {
  // colors
  var colors = ['#007bff', '#28a745', '#ffcd2d', '#7000f0', '#dc3545', '#c90097'];

  var donutOptions = {
      cutoutPercentage: 60,
      legend: {
          position: 'right',
          padding: 0,
          labels: {
              pointStyle: 'circle',
              usePointStyle: true
          }
      }
  };

  // Configuration
  var chDonutData = {
      labels: ['BTC', 'DOT', 'ETH', 'DOGE'],
      datasets: [{
          backgroundColor: colors.slice(0, 4),
          borderWidth: 0,
          data: [40, 11, 40, 20]
      }]
  };

  var chDonut = document.getElementById("chDonut");
  if (chDonut) {
      new Chart(chDonut, {
          type: 'pie',
          data: chDonutData,
          options: donutOptions
      });
  }
});

/*--- Dropdown on Hover ---*/
document.addEventListener('DOMContentLoaded', (event) => {
  $(document).ready(function() {
      $('.dropdown').hover(function() {
          $(this).addClass('show');
          $(this).find('.dropdown-menu-shows').addClass('show');
      }, function() {
          $(this).removeClass('show');
          $(this).find('.dropdown-menu-shows').removeClass('show');
      });
  });

  $(document).ready(function() {
      $('.dropdown').hover(function() {
          $(this).find('.dropdown-menu-shows')
              .stop(true, true).delay(50).fadeIn(200);
      }, function() {
          $(this).find('.dropdown-menu-shows')
              .stop(true, true).delay(50).fadeOut(200);
      });
  });
});

// Favorite Button
document.addEventListener('DOMContentLoaded', (event) => {
  $('.favme').click(function() {
      $(this).toggleClass('active');
  });

  /* when a user clicks, toggle the 'is-animating' class */
  $(".favme").on('click touchstart', function() {
      $(this).toggleClass('is_animating');
  });

  /*when the animation is over, remove the class*/
  $(".favme").on('animationend', function() {
      $(this).toggleClass('is_animating');
  });
});

// Scrollspy
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('#nav-tab>[data-bs-toggle="tab"]').forEach(el => {
      el.addEventListener('shown.bs.tab', () => {
          const target = el.getAttribute('data-bs-target')
          const scrollElem = document.querySelector(`${target} [data-bs-spy="scroll"]`)
          bootstrap.ScrollSpy.getOrCreateInstance(scrollElem).refresh()
      })
  })
});

// ApexChart
document.addEventListener('DOMContentLoaded', (event) => {
    // Check if the element with class 'chart-area' exists
    const chartElement = document.querySelector(".chart-area");

    if (chartElement) {
        const chartOptions = {
            chart: {
                type: "area",
                height: 120,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            colors: ["#0d6efd"],
            series: [{
                name: "Total Assets",
                data: [0.00, 0.00, 4.55, 0.00, 0.00, 0.00]
            }],
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 3,
                curve: "smooth"
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 0,
                    opacityFrom: 0.4,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                categories: ["Feb", "Apr", "Jun", "Aug", "Oct", "Dec"],
                axisBorder: {
                    show: false
                },
                labels: {
                    style: {
                        colors: "#adb5bd",
                        fontFamily: "inter"
                    }
                }
            },
            yaxis: {
                show: false
            },
            grid: {
                borderColor: "rgba(0, 0, 0, 0, 0)",
                padding: {
                    top: -30,
                    bottom: -8,
                    left: 12,
                    right: 12
                }
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: value => `${value} BTC`
                },
                style: {
                    fontFamily: "inter"
                }
            },
            markers: {
                show: true
            }
        };

        const chart = new ApexCharts(chartElement, chartOptions);
        chart.render();
    }
});

//Piechart
document.addEventListener('DOMContentLoaded', (event) => {
    // Check if the element with ID 'chartdiv' exists
    const chartElement = document.getElementById("chartdiv");

    if (chartElement) {
        var chart;
        var legend;

        var chartData = [{
            country: "Ecosystem",
            value: 260
        }, {
            country: "Airdrop",
            value: 201
        }, {
            country: "Private Sale",
            value: 65
        }, {
            country: "Contributors",
            value: 39
        }, {
            country: "Advisory",
            value: 19
        }, {
            country: "Launchpool",
            value: 10
        }];

        AmCharts.ready(function() {
            // PIE CHART
            chart = new AmCharts.AmPieChart();
            chart.dataProvider = chartData;
            chart.titleField = "country";
            chart.valueField = "value";
            chart.outlineColor = "";
            chart.outlineAlpha = 0.8;
            chart.outlineThickness = 2;
            // this makes the chart 3D
            chart.depth3D = 20;
            chart.angle = 30;

            // WRITE
            chart.write("chartdiv");
        });
    }
});

// Price Meter
document.addEventListener('DOMContentLoaded', (event) => {
  (function() {
      var leaseMeter, meterBar, meterBarWidth, meterValue, progressNumber;

      /*Get value of value attribute*/
      var valueGetter = function() {
          leaseMeter = document.getElementsByClassName('leaseMeter');
          for (var i = 0; i < leaseMeter.length; i++) {
              meterValue = leaseMeter[i].getAttribute('value');
              return meterValue;
          }
      }

      /*Convert value of value attribute to percentage*/
      var getPercent = function() {
          meterBarWidth = parseInt(valueGetter()) * 0.10;
          meterBarWidth.toString;
          meterBarWidth = meterBarWidth + "%";
          return meterBarWidth;
      }

      /*Apply percentage to width of .meterBar*/
      var adjustWidth = function() {
          meterBar = document.getElementsByClassName('meterBar');
          for (var i = 0; i < meterBar.length; i++) {
              meterBar[i].style['width'] = getPercent();
          }
      }

      /*Update value indicator*/
      var indicUpdate = function() {
          progressNumber = document.getElementsByClassName('progressNumber');
          for (var i = 0; i < progressNumber.length; i++) {
              progressNumber[i].innerHTML = valueGetter();
          }
      }

      adjustWidth();
      indicUpdate();
  })();
});

// Declare the state variable globally
let state = false;

function toggle(inputId, displayId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(displayId);

    if (passwordInput && eyeIcon) {
        if (state) {
            passwordInput.setAttribute("type", "password");
            eyeIcon.style.color = "#7a797e";
            state = false;
        } else {
            passwordInput.setAttribute("type", "text");
            eyeIcon.style.color = "#0d6efd";
            state = true;
        }
    }
}

// Popovers
document.addEventListener('DOMContentLoaded', (event) => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
});

//Sidebar Collapse
document.addEventListener("DOMContentLoaded", function() {
    let arrow_el = document.getElementById("sidebar-collapse");
    let body_el = document.querySelector("body");
    if(!arrow_el || !body_el) return null;
  
    arrow_el.addEventListener("click", function() {
      body_el.classList.toggle("sidebar-close");
    });
  });

// Mobile sidebar toggle
document.addEventListener("DOMContentLoaded", function () {
    let arrow_el = document.getElementById("sidebar-mobile-toggle");
    let body_el = document.querySelector("body");
    if (!arrow_el || !body_el) return null;

    // Add the class by default
    body_el.classList.add("sidebar-mobile-close");

    // Toggle the class on click
    arrow_el.addEventListener("click", function () {
        body_el.classList.toggle("sidebar-mobile-close");
    });
});
  
var e = {
    select: function (selector) {
        return document.querySelector(selector);
    },
    selectAll: function (selector) {
        return document.querySelectorAll(selector);
    },
    isVariableDefined: function (variable) {
        return variable !== null && variable !== undefined;
    },
    flatPicker: function () {
        var picker = e.select(".flatpickr");
        if (e.isVariableDefined(picker)) {
            var element = e.selectAll(".flatpickr");
            element.forEach(function (item) {
                var mode = item.getAttribute("data-mode") == "multiple" ? "multiple" : item.getAttribute("data-mode") == "range" ? "range" : "single";
                var enableTime = item.getAttribute("data-enableTime") == "true" ? true : false;
                var noCalendar = item.getAttribute("data-noCalendar") == "true" ? true : false;
                var inline = item.getAttribute("data-inline") == "true" ? true : false;
                var dateFormat = item.getAttribute("data-date-format") ? item.getAttribute("data-date-format") : item.getAttribute("data-enableTime") == "true" ? "h:i K" : "d M";

                flatpickr(item, {
                    mode: mode,
                    enableTime: enableTime,
                    noCalendar: noCalendar,
                    inline: inline,
                    animate: "false",
                    position: "top",
                    dateFormat: dateFormat,
                    disableMobile: "true",
                });
            });
        }
    },
};

// Initialize flatPicker after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    e.flatPicker();
});