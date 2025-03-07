const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */

/**
 * Hàm kiểm tra một phần tử
 * có bị ẩn bởi display: none không
 */
function isHidden(element) {
  if (!element) return true;

  if (window.getComputedStyle(element).display === "none") {
    return true;
  }

  let parent = element.parentElement;
  while (parent) {
    if (window.getComputedStyle(parent).display === "none") {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
}

/**
 * Hàm buộc một hành động phải đợi
 * sau một khoảng thời gian mới được thực thi
 */
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Hàm tính toán vị trí arrow cho dropdown
 *
 * Cách dùng:
 * 1. Thêm class "js-dropdown-list" vào thẻ ul cấp 1
 * 2. CSS "left" cho arrow qua biến "--arrow-left-pos"
 */
const calArrowPos = debounce(() => {
  if (isHidden($(".js-dropdown-list"))) return;

  const items = $$(".js-dropdown-list > li");

  items.forEach((item) => {
    const arrowPos = item.offsetLeft + item.offsetWidth / 2;
    item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
  });
});

// Tính toán lại vị trí arrow khi resize trình duyệt
window.addEventListener("resize", calArrowPos);

// Tính toán lại vị trí arrow sau khi tải template
window.addEventListener("DOMContentLoaded", calArrowPos);

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            console.log(this.responseText);
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

includeHTML();
/**
 * Giữ active menu khi hover
 *
 * Cách dùng:
 * 1. Thêm class "js-menu-list" vào thẻ ul menu chính
 * 2. Thêm class "js-dropdown" vào class "dropdown" hiện tại
 *  nếu muốn reset lại item active khi ẩn menu
 */
window.addEventListener("DOMContentLoaded", handleActiveMenu);

function handleActiveMenu() {
    const dropdowns = $$(".js-dropdown");
    const menus = $$(".js-menu-list");
    const activeClass = "menu-column-item-active";

    const removeActive = (menu) => {
        menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    };

    const init = () => {
        menus.forEach((menu) => {
            const items = menu.children;
            if (!items.length) return;

            removeActive(menu);
            if (window.innerWidth > 991)
            items[0].classList.add(activeClass);

            Array.from(items).forEach((item) => {
                item.onmouseenter = () => {
                    if (window.innerWidth <= 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                };
                item.onclick = () => {
                  if (window.innerWidth > 991) return;
                  removeActive(menu);
                  item.classList.add(activeClass);
                  item.scrollIntoView();
              };
            });
        });
    };

    init();

    dropdowns.forEach((dropdown) => {
        dropdown.onmouseleave = () => init();
    });
}
/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("DOMContentLoaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();
            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
          if (!e.target.closest(target)) {
              const isHidden = $(target).classList.contains("hide");
              if (!isHidden) {
                  button.click();
              }
          }
      };
      
    });
}
window.addEventListener("DOMContentLoaded", () => {
  const links = $$(".js-dropdown-list > li > a");

  links.forEach((link) => {
      link.onclick = () => {
          if (window.innerWidth > 991) return;
          const item = link.closest("li");
          item.classList.toggle("navbar-item-active");
      };
  });
});
window.addEventListener("DOMContentLoaded", () => {
  const tabsSelector = "pro-tab-item";
  const contentsSelector = "pro-tab-content";

  const tabActive = `${tabsSelector}-current`;
  const contentActive = `${contentsSelector}-current`;

  const tabContainers = $$(".js-tabs");
  tabContainers.forEach((tabContainer) => {
      const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
      const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
      tabs.forEach((tab, index) => {
          tab.onclick = () => {
              tabContainer.querySelector(`.${tabActive}`)?.classList.remove(tabActive);
              tabContainer.querySelector(`.${contentActive}`)?.classList.remove(contentActive);
              tab.classList.add(tabActive);
              contents[index].classList.add(contentActive);
          };
      });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const switchBtn = document.querySelector("#switch-theme-btn");
  if (switchBtn) {
      switchBtn.onclick = function () {
          const isDark = localStorage.dark === "true";
          document.querySelector("html").classList.toggle("dark", !isDark);
          localStorage.setItem("dark", !isDark);
          switchBtn.querySelector("span").textContent = isDark ? "Dark mode" : "Light mode";
      };
      const isDark = localStorage.dark === "true";
      switchBtn.querySelector("span").textContent = isDark ? "Light mode" : "Dark mode";
  }
});

const isDark = localStorage.dark === "true";
document.querySelector("html").classList.toggle("dark", isDark);

//# sourceMappingURL=scripts.js.map
