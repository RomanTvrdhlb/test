//-----vars---------------------------------------
const header = document.querySelector(".h2o-header");
const accParrent = [...document.querySelectorAll("[data-accordion-init]")];
const htmlEl = document.documentElement;
const bodyEl = document.body;
const mainSlider = document.querySelector(".h2o-main-slider");
const subSlider = document.querySelector(".h2o-sub-slider");
const overlay = document.querySelector("[data-overlay]");
const mobileMenu = document.querySelector(".h2o-mobile-menu");
const burgers = document.querySelectorAll(".h2o-burger");
//------------------------------------------------

//----customFunction------------------------------
const toggleCustomClass = (item, customClass = "active") => {
  item.classList.toggle(customClass);
};

const toggleClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.toggle(customClass);
  });
};

const removeClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.remove(customClass);
  });
};

const addCustomClass = (item, customClass = "active") => {
  item.classList.add(customClass);
};

const addClassInArray = (arr, customClass) => {
  arr.forEach((item) => {
    item.classList.add(customClass);
  });
};

const removeCustomClass = (item, customClass = "active") => {
  item.classList.remove(customClass);
};

const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - bodyEl.offsetWidth}px`;

  htmlEl.style.scrollBehavior = "none";
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  bodyEl.style.paddingRight = paddingOffset;
  bodyEl.classList.add("dis-scroll");
  bodyEl.dataset.position = pagePosition;
  bodyEl.style.top = `-${pagePosition}px`;
};

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const body = document.body;
  const pagePosition = parseInt(bodyEl.dataset.position, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });
  bodyEl.style.paddingRight = "0px";

  bodyEl.style.top = "auto";
  bodyEl.classList.remove("dis-scroll");
  window.scroll({
    top: pagePosition,
    left: 0,
  });
};

const elementHeight = (el, variableName) => {
  if (el) {
    function initListener() {
      const elementHeight = el.offsetHeight;
      document
        .querySelector(":root")
        .style.setProperty(`--${variableName}`, `${elementHeight}px`);
    }
    window.addEventListener("DOMContentLoaded", initListener);
    window.addEventListener("resize", initListener);
  }
};
//------------------------------------------------

//----accordion----------------------------------
window.addEventListener("DOMContentLoaded", () => {
  accParrent &&
    accParrent.map(function (accordionParrent) {
      if (accordionParrent) {
        let multipleSetting = false;
        let breakpoinSetting = false;
        let defaultOpenSetting;

        if (
          accordionParrent.dataset.single &&
          accordionParrent.dataset.breakpoint
        ) {
          multipleSetting = accordionParrent.dataset.single; // true - включает сингл аккордион
          breakpoinSetting = accordionParrent.dataset.breakpoint; // брейкпоинт сингл режима (если он true)
        }

        const getAccordions = function (dataName = "[data-id]") {
          return accordionParrent.querySelectorAll(dataName);
        };

        const accordions = getAccordions();
        let openedAccordion = null;

        const closeAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = 0;
          removeCustomClass(accordion, className);
        };

        const openAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = accordion.scrollHeight + "px";
          addCustomClass(accordion, className);
        };

        const toggleAccordionButton = function (button, className = "active") {
          toggleCustomClass(button, className);
        };

        const checkIsAccordionOpen = function (accordion) {
          return accordion.classList.contains("active");
        };

        const accordionClickHandler = function (e) {
          e.preventDefault();
          let curentDataNumber = this.dataset.id;

          toggleAccordionButton(this);
          const accordionContent = accordionParrent.querySelector(
            `[data-content="${curentDataNumber}"]`
          );
          const isAccordionOpen = checkIsAccordionOpen(accordionContent);

          if (isAccordionOpen) {
            closeAccordion(accordionContent);
            openedAccordion = null;
          } else {
            if (openedAccordion != null) {
              const mobileSettings = () => {
                let containerWidth = document.documentElement.clientWidth;
                if (
                  containerWidth <= breakpoinSetting &&
                  multipleSetting === "true"
                ) {
                  closeAccordion(openedAccordion);
                  toggleAccordionButton(
                    accordionParrent.querySelector(
                      `[data-id="${openedAccordion.dataset.content}"]`
                    )
                  );
                }
              };

              window.addEventListener("resize", () => {
                mobileSettings();
              });
              mobileSettings();
            }

            openAccordion(accordionContent);
            openedAccordion = accordionContent;
          }
        };

        const activateAccordion = function (accordions, handler) {
          for (const accordion of accordions) {
            accordion.addEventListener("click", handler);
          }
        };
        const accordionDefaultOpen = (currentId) => {
          const defaultOpenContent = accordionParrent.querySelector(
            `[data-content="${currentId}"]`
          );
          const defaultOpenButton = accordionParrent.querySelector(
            `[data-id="${currentId}"]`
          );
          openedAccordion = defaultOpenContent;

          toggleAccordionButton(defaultOpenButton);
          openAccordion(defaultOpenContent);
        };

        if (accordionParrent.dataset.default) {
          defaultOpenSetting = accordionParrent.dataset.default; // получает id аккордиона который будет открыт по умолчанию
          accordionDefaultOpen(defaultOpenSetting);
        }

        activateAccordion(accordions, accordionClickHandler);
      }
    });
});

//----stickyHeader------------------------------
let lastScroll = 0;
const defaultOffset = 40;

function stickyHeaderFunction(breakpoint) {
  let containerWidth = document.documentElement.clientWidth;
  if (containerWidth > `${breakpoint}`) {
    const scrollPosition = () =>
      window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains("sticky");

    window.addEventListener("scroll", () => {
      if (
        scrollPosition() > lastScroll &&
        !containHide() &&
        scrollPosition() > defaultOffset
      ) {
        addCustomClass(header, "sticky");
      } else if (scrollPosition() < defaultOffset) {
        removeCustomClass(header, "sticky");
      }

      lastScroll = scrollPosition();
    });
  }
}

stickyHeaderFunction(320);
elementHeight(header, "header-height");

//-----Sliders----------------------------------------

const main = mainSlider && new Splide(mainSlider, {
  type: "slide",
  speed: 1800,
  pagination: false,
  arrows: false,
  perPage: 1,
  autoplay: {
    delay: 1500,
  },

  breakpoints: {
    768: {
      pagination:true,
    },
  }
}).mount();

const sub =
  subSlider &&
  new Splide(subSlider, {
    type: "slide",
    speed: 1800,
    gap: 15,
    perPage: 10,
    fixedHeight: 53,
    rewind: true,
    pagination: false,
    arrows: false,
    isNavigation: true,

    breakpoints: {
      3500:{
        fixedHeight: 93,
      },
      1500:{
        fixedHeight: 53,
      },
      1024: {
        gap: 5,
      },
    },
  }).mount();

main && sub && main.sync(sub);


//----burger------------------------------------
const mobileMenuHandler = function (overlay, mobileMenu, burgers) {
  burgers.forEach((burger) => {
    burger.addEventListener("click", function (e) {
      e.preventDefault();
      toggleCustomClass(header, "active");
      toggleCustomClass(mobileMenu);
      toggleClassInArray(burgers);
      toggleCustomClass(overlay);
      burger.classList.contains("active") ? disableScroll() : enableScroll();
    });
  });
};

const hideMenuHandler = function (overlay, mobileMenu, burgers) {
  removeCustomClass(mobileMenu);
  removeClassInArray(burgers);
  removeCustomClass(header, "active");
  removeCustomClass(overlay);
  enableScroll();
};

if (overlay) {
  mobileMenuHandler(overlay, mobileMenu, burgers);
  overlay.addEventListener("click", function (e) {
    e.target.classList.contains("h2o-overlay")
      ? hideMenuHandler(overlay, mobileMenu, burgers)
      : null;
  });
}