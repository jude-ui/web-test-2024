const uiCompo = (function () {
  "use strict";
  /*
    컴포넌트 가이드에서 스크립트가 필요한 컴포넌트를 지원하기 위한 스크립트 파일
  */
  
  // 공통 파일 ui - value 및 title 추가 기능
  const $fileCommInput = $('.file_comm input[type=file]');
  if ($fileCommInput.length) {
    $('.file_comm input[type=file]').each(function (idx, el) {
      $(el).on('change', function () {
        const $self = $(this)
        const fileName = $self.val().split('\\').pop()
        $self.siblings('input[type=text]').val(fileName).attr('title', fileName)
      })
    })
  }
  
  // 공통 - 탭
  const TabModule = function (options) {
    const settings = $.extend({
      containerClass: '.tab_container', // 탭 컨테이너 클래스
      groupClass: '.tab_comm', // 탭 그룹 클래스
      tabListPcClass: '.tab_pc', // PC용 탭 리스트
      tabListMobileClass: '.tab_m', // 모바일용 탭 리스트
      tabPanelClass: '.tab_panel', // 탭 패널
      tabTriggerClass: '.tab', // 탭 버튼
      titleTabClass: '.tit_tab', // 모바일 타이틀
      activeClass: 'on', // 활성화 클래스
      breakPoint: 1024, // 반응형 브레이크포인트
    }, options);

    const $tabGroups = $(settings.groupClass)
    

    if ($tabGroups.length) {
      const $window = $(window);
      
      let timeoutInfo = null;

      $tabGroups.each(function () {
        const $tabGroup = $(this);
        const $tabsPc = $tabGroup.find(`${settings.tabListPcClass} ${settings.tabTriggerClass}`);
        const $tabsMobile = $tabGroup.find(`${settings.tabListMobileClass} ${settings.tabTriggerClass}`);
        const $tabs = $tabsPc.add($tabsMobile);
        const $container = $tabGroup.parent();
        const $panels = $container.find(settings.tabPanelClass);
        const $titleTab = $tabGroup.find(settings.titleTabClass);

        // 초기화: PC에서 선택된 탭 텍스트를 타이틀에 삽입
        const initTabText = $tabGroup.find(`${settings.tabListPcClass} [aria-selected=true]`).text();
        $titleTab.html(initTabText);

        // 모바일 타이틀 클릭: 메뉴 토글
        $titleTab.on('click', function (e) {
          e.preventDefault();
          if ($tabGroup.hasClass(settings.activeClass)) {
            $tabGroup.removeClass(settings.activeClass)
              .find(settings.tabListMobileClass)
              .stop()
              .slideUp(300);
          } else {
            $(settings.groupClass)
              .removeClass(settings.activeClass)
              .find(settings.tabListMobileClass)
              .stop()
              .slideUp(300);
            $tabGroup.addClass(settings.activeClass)
              .find(settings.tabListMobileClass)
              .stop()
              .slideDown(300);
          }
        });

        // 화면 리사이즈: 모바일 스타일 초기화
        $window.on('resize', function () {
          clearTimeout(timeoutInfo);
          timeoutInfo = setTimeout(() => {
            if ($window.outerWidth() >= settings.breakPoint) {
              $(settings.groupClass).filter(`.${settings.activeClass}`).find(settings.tabListMobileClass).removeAttr('style')
              $(settings.groupClass).filter(`.${settings.activeClass}`).removeClass(settings.activeClass)
            }
          }, 300);
        });

        // 탭 클릭: 탭 및 패널 상태 업데이트
        $tabs.on('click', function (e) {
          const $currentTab = $(this);
          const idx = $currentTab.parent().index();
          const tabText = $currentTab.text();
          const tabId = $currentTab.data('tab');

          if ($currentTab.is('[data-tab]')) {
            e.preventDefault();

            // 모든 탭 비활성화
            $tabs.attr('aria-selected', 'false');

            // 현재 탭 활성화
            $tabGroup.find(settings.tabListPcClass + ' li').eq(idx).find(settings.tabTriggerClass).attr('aria-selected', 'true');
            $tabGroup.find(settings.tabListMobileClass + ' li').eq(idx).find(settings.tabTriggerClass).attr('aria-selected', 'true');

            // 타이틀에 현재 탭 텍스트 삽입
            $titleTab.html(tabText);

            // 모바일 메뉴 닫기
            if ($window.outerWidth() < settings.breakPoint) {
              $tabGroup.find(settings.tabListMobileClass).stop().slideUp(300);
              $tabGroup.removeClass(settings.activeClass);
            }

            if ($container.length) {
              // 모든 패널 숨김
              $panels.removeClass(settings.activeClass);
  
              // 선택된 패널 활성화
              $panels.filter(`[data-tabpanel="${tabId}"]`).addClass(settings.activeClass);
            }
          }
        });

        // 모바일 외부 클릭: 메뉴 닫기
        $(document).on('click focusin', function (e) {
          if (!$tabGroup.has(e.target).length) {
            $tabGroup.removeClass(settings.activeClass)
              .find(settings.tabListMobileClass)
              .stop()
              .slideUp(300);
          }
        });
      });
    }
  };

  // 탭 플러그인 호출
  TabModule({
    containerClass: '.tab_container',
    groupClass: '.tab_comm',
    tabListPcClass: '.tab_pc',
    tabListMobileClass: '.tab_m',
    tabPanelClass: '.tab_panel',
    tabTriggerClass: '.tab',
    titleTabClass: '.tit_tab',
    activeClass: 'on',
    breakPoint: 1024,
  });

  // 캘린더 .d_cal_unite
  // const $dCalUnite = $('.d_cal_unite');
  // if ($dCalUnite.length) {
  //   $($dCalUnite).on('click keydown', '.cal_day:not(.empty)', function () {
  //     if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')) {
  //       $dCalUnite.find('.cal_day').removeClass('selected')
  //       $(this).addClass('selected')
  //     }
  //   })
  // }

  // 공통 아코디언
  const $listAccordion = $('.list_accordion');
  if ($listAccordion.length) {
    $('.list_accordion > li > a').on('click', function (e) {
      e.preventDefault();
      const $self = $(this)
      if ($self.attr('aria-expanded') === 'true') {
        $self.attr('aria-expanded', 'false')
        $self.next().stop().slideUp(300)
      } else {
        $self.closest('.list_accordion').find('.cont_desc').stop().slideUp(300)
        $self.closest('.list_accordion').find(' > li > a').attr('aria-expanded', 'false')
        $self.attr('aria-expanded', 'true')
        $self.next().stop().slideDown(300)
      }
    });
  }

  // 공통 화면 fixed / unfixed
  const fixBody = (function () {
    let currentScrollTop = null;
    const $body = $('body');
    const $window = $(window);

    function unfix() {
      $body.removeAttr('style');
      $window.scrollTop(currentScrollTop);
    };

    function fix(isHidden = false) {
      const bodyElement = $body.get(0);
      const hasVerticalOverflow = !isHidden && bodyElement.clientHeight < bodyElement.scrollHeight;
      currentScrollTop = $window.scrollTop();

      const styles = {
        position: 'fixed',
        top: -currentScrollTop,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: hasVerticalOverflow ? 'scroll' : '',
      }
      $body.css(styles)
    }
    return {
      fix,
      unfix
    }
  })();

  /**
   * LayerComm Class
   * @class
   * @param {Object}  [options] - LayerComm 클래스의 옵션 설정
   * @param {string}  [options.defaultLayerName] - 레이어 팝업을 작동 시키기 위한 팝업 기본 클래스명
   * @param {string}  [options.openClass] - 레이어 팝업 토글 시키는 클래스명
   * @param {string}  [options.activeClass] - 현재 초점이 있는 레이어 팝업에 붙는 클래스명
   * @param {Function} [options.beforeOpen] - 레이어 팝업 Before Open 콜백 함수
   * @param {Function} [options.afterOpen] - 레이어 팝업 After Open 콜백 함수
   * @param {Function} [options.beforeClose] - 레이어 팝업 Before Close 콜백 함수
   * @param {Function} [options.afterClose] - 레이어 팝업 After Close 콜백 함수
   */
  class LayerComm {
    constructor(el, options = {}) {
      this.el = el
      this.openClass = options.openClass ? options.openClass : 'on'
      this.activeClass = options.activeClass ? options.activeClass : 'active'
      this.defaultLayerName = $.trim(el ? el : '')
      this.layers = {} // 개별 팝업 콜백 저장 객체
      
      this._handleOpenLayer = this._handleOpenLayer.bind(this)
      this._handleCloseLayer = this._handleCloseLayer.bind(this)
      this._bindKeyEvt = this._bindKeyEvt.bind(this)

      this._currentScrollTop = null
      this._$body = $('body')
      this._$window = $(window)

      this.fstTab = null
      this.lstTab = null
      this.currentLayer = null

      this.openButton = null
      this.parentLayer = null
      this.beforeLayer = null

      this.focusableSelectors = ['a[href]', 'iframe', 'input', 'select', 'textarea', 'button', '[tabindex="0"]', '[contenteditable]']

      this.callbacks = {}

      if (options.on) {
        for (const [event, callback] of Object.entries(options.on)) {
          this.on(event, callback)
        }
      }
      
      this.init()
    }

    init() {
      // 동적 이벤트 할당 코드는 관심강좌 팝업과 같은 상황에 따라 열리는 팝업을 다르게 가져갈 시 주의
      $(document).on('click', '[data-open-layer]', this._handleOpenLayer)
                  // .on('click', '[data-open-layer]', this._handleOpenLayer)
      $(document).on('click', '[data-close-layer]', this._handleCloseLayer)
                  // .on('click', '[data-close-layer]', this._handleCloseLayer)
      // $(document).off('keydown', this.defaultLayerName, this._bindKeyEvt)
                  // .on('keydown', this.defaultLayerName, this._bindKeyEvt)

      this._executeCallback(this, 'init')
    }

    on(event, callback) {
      if (!this.callbacks[event]) {
        this.callbacks[event] = []
      }
      this.callbacks[event].push(callback)
    }

    getOpenLayerCount() {
      const $activePopup = $(this.defaultLayerName).filter(`.${this.openClass}`)
      const activeClassPopups = $activePopup.length
      const openDialogs = $('dialog[open]').length
      return activeClassPopups + openDialogs
    }

    isBodyFixed() {
      return this._$body.css('position') === 'fixed'
    }

    fix() {
      if (!this.isBodyFixed()) {
        const isOverflow = document.documentElement.clientHeight < document.documentElement.scrollHeight
  
        this._currentScrollTop = this._$window.scrollTop()
        const styles = {
          position: 'fixed',
          top: -this._currentScrollTop,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: isOverflow ? 'scroll' : '',
        }
        this._$body.css(styles)
      }
    }

    unfix() {
      if (this.isBodyFixed() && this.getOpenLayerCount() === 1) {
        this._$body.removeAttr('style')
        this._$window.scrollTop(this._currentScrollTop)
      }
    }

    _handleOpenLayer(e) {
      e.preventDefault();

      const layerId = $(e.currentTarget).data('openLayer')
      if (!(typeof layerId === 'undefined' || layerId === "")) {
        let $layer = $(`#${layerId}`)
        if ($layer.closest(this.el).length) {
          this.open($layer)
        }
      }
    }

    _handleCloseLayer(e) {
      e.stopPropagation()
      const $target = $(e.target)

      // 클릭한 요소가 [data-close-layer] 일 경우
      if ($target.is('[data-close-layer]')) {
        e.preventDefault()
        let $layer = $target.closest(this.defaultLayerName)
        if ($layer.closest(this.el).length) {
          this.close($layer)
        }
      }
    }
    
    togglePopup($layer, action) {
      if (action === 'open') {
        if ($layer.prop('tagName') === 'DIALOG') {
          $layer.get(0).showModal()
        } else {
          $layer.addClass(this.openClass)
        }
      } else {
        if ($layer.prop('tagName') === 'DIALOG') {
          $layer.get(0).close()
        } else {
          $layer.removeClass(this.openClass)
        }
      }
    }

    _$openButton($layer) {
      return $(`[data-open-layer="${$layer.attr('id')}"]`)
    }

    _$parentLayer($layer) {
      return this._$openButton($layer).closest(this.defaultLayerName)
    }
    
    _$beforeLayer($layer) {
      return $(`#${$layer.attr('id')}`)
    }

    open($layer) {
      this._executeCallback(this, 'beforeOpen') // 콜백
      
      this.currentLayer = $layer
      this.openButton = this._$openButton($layer).get(0)
      this.parentLayer = this._$parentLayer($layer).get(0)

      const isHidden = $layer.css('display') === 'none'

      // body 고정 유무 체크 후, body 고정
      this.fix()

      // 팝업 종류 체크하여 Open
      this.togglePopup($layer, 'open')

      // display:none 체크하여 첫번째 요소로 초점 이동
      if (isHidden) {
        this.focusFirstElement($layer)
      } else {
        $layer.one('transitionstart', () => this.focusFirstElement($layer))
      }
      
      // 현재 열려 있는 팝업이 있다면 모두 active 해제, 지금 여는 팝업만 active 추가
      this._$parentLayer($layer).removeClass(this.activeClass)
      $layer.addClass(this.activeClass)

      this._executeCallback(this, 'afterOpen') // 콜백
    }

    close($layer, target) {
      this._executeCallback(this, 'beforeClose') // 콜백

      this.currentLayer = $layer
      this.openButton = this._$openButton($layer).get(0)
      this.parentLayer = this._$parentLayer($layer).get(0)
      this.beforeLayer = this._$beforeLayer($layer).get(0)
      
      let $parentLayer = null

      if (target) {
        $parentLayer = this._$parentLayer($(target).closest(this.defaultLayerName))
      } else {
        $parentLayer = this._$parentLayer($layer)
      }

      // open된 팝업 수와 body 고정 유무 체크 후, body 고정 해제
      this.unfix()

      // 현재 닫은 팝업은 active 삭제
      $layer.removeClass(this.activeClass)

      // 팝업 종류 체크하여 Close
      this.togglePopup($layer, 'close')

      // 팝업 열었던 버튼으로 초점 이동
      if (this._$openButton($layer).length) this._$openButton($layer).focus()
      
      // 닫은 팝업의 open 버튼이 또다른 팝업 안에 존재 한다면
      if ($parentLayer.length) {
        $parentLayer.addClass(this.activeClass) // 현재 팝업에 active 클래스 추가
        this.currentLayer = $parentLayer // 팝업 초기화
        this.focusFirstElement(this.currentLayer) // 현재 팝업 첫번째 초점에 초점이동
      } else {
        this.currentLayer = null
      }

      this._executeCallback(this, 'afterClose') // 콜백
    }

    focusFirstElement($layer) {
      const $focusable = $layer.find(this.focusableSelectors.join()).not('[disabled], [tabindex="-1"], :hidden')
      this.fstTab = $focusable[0]
      this.lstTab = $focusable[$focusable.length - 1]

      if (this.fstTab === this.lstTab) {
        this.lstTab = null
      }
      if (this.fstTab) this.fstTab.focus()
    }

    _bindKeyEvt(e) {
      const keycode = e.keycode || e.which
      const target = e.target
      
      switch (keycode) {
        case 9:  // tab key
          if (this.fstTab && this.lstTab) { // 포커스 가능 요소가 2개 이상
            if (e.shiftKey) { // 뒤로 탭
              if (this.fstTab && target == this.fstTab) { // 첫번째 탭 가능 요소일 경우
                e.preventDefault()
                if (this.lstTab) this.lstTab.focus()
              }
              
            } else { // 앞으로 탭
              if (this.lstTab && target == this.lstTab) { // 마지막 탭 가능 요소일 경우
                e.preventDefault()
                if (this.fstTab) this.fstTab.focus()
              }
            }
          } else {
            e.preventDefault()
          }
          break
        case 27:  // esc key
          e.preventDefault()

          this.close(this.currentLayer, target)
          break
        default:
          break
      }
    }

    _executeCallback(self, action) {
      if (this.callbacks[action]) {
        this.callbacks[action].forEach(callback => callback(self))
      }
    }
  }

  // 공통 콜백 함수 설정
  const layerComm = new LayerComm('.layer_comm, .d_layer_comm', {
    on: {
      init: self => {
        // console.log('init', self);
      },
      beforeOpen: self => {
        // console.log('beforeOpen', self)
      },
      afterOpen: self => {
        // console.log('afterOpen', self)
      },
      beforeClose: self => {
        // console.log('beforeClose', self)
      },
      afterClose: self => {
        // console.log('afterClose', self)
      },
    }
  })
  const layerComm2 = new LayerComm('#favor')

  // 개별 콜백 함수 설정 (개별 페이지 최하단 script 태그에 삽입)
  // layerComm.on('beforeOpen', function ($popup) {
  //   console.log('개별 beforeOpen', $popup)
  // })


  // 공통 카운터 체크
  const $dCounterCheck = $('.d_counter_check');
  if ($dCounterCheck.length) {
    function updateCounter($numCount, amount, min, max) {
      let currentNum = Number($numCount.text());

      if (!isNaN(min) && amount === -1) {
        currentNum = Math.max(currentNum + amount, min);
      } else if (!isNaN(max) && amount === 1) {
        currentNum = Math.min(currentNum + amount, max);
      } else {
        currentNum += amount;
      }

      $numCount.text(currentNum);
    }
    
    $dCounterCheck.each(function () {
      const $this = $(this);
      const $numCount = $this.find('.num_count');
      const min = Number($numCount.data('min'));
      const max = Number($numCount.data('max'));

      $this.find('.btn_minus').on('click', function () {
        updateCounter($numCount, -1, min, max);
      });

      $this.find('.btn_plus').on('click', function () {
        updateCounter($numCount, 1, min, max);
      });
    });
  }

  // 컨텐츠 슬라이드 (공통)
  const $content_slide = $('.content_slide')
  if ($content_slide.length) {
    $content_slide.each(function (idx, el) {
      const slide = el
      const prevEl = slide.querySelector('.btn_prev')
      const nextEl = slide.querySelector('.btn_next')

      const swiperOptions = {
        a11y: {
          containerMessage: '이미지 슬라이드', // 슬라이드 컨테이너의 제목(기본값 null)
          prevSlideMessage: '이전 슬라이드',
          nextSlideMessage: '다음 슬라이드',
          slideLabelMessage: '현재 슬라이드 : {{index}} / 전체 슬라이드 : {{slidesLength}}',
        },
        on: {
          lock: (swiper) => {
            swiper.el.classList.add('inactive')
            swiper.params.loop = false
          },
          unlock: (swiper) => {
            swiper.el.classList.remove('inactive')
            swiper.params.loop = true
          },
        },
        loop: true,
        navigation: { prevEl, nextEl },
        pagination: {
          clickable: true,
          el: slide.querySelector('.paging_slide'),
          type: 'bullets',
          renderBullet: function (index, className) {
            return `<span class="${className}" title="${index + 1}번 슬라이드로 이동"></span>`;
          }
        }
      }
      new Swiper(slide, swiperOptions)
    });
  }
  // 설명이 긴 슬라이드
  const $wrap_slide_desc_long = $('.wrap_slide_desc_long')
  if ($wrap_slide_desc_long.length) {
    $wrap_slide_desc_long.each(function (idx, el) {
      const slide = el.querySelector('.swiper')
      const prevEl = el.querySelector('.btn_prev')
      const nextEl = el.querySelector('.btn_next')

      const swiperOptions = {
        a11y: {
          containerMessage: '이미지 슬라이드', // 슬라이드 컨테이너의 제목(기본값 null)
          prevSlideMessage: '이전 슬라이드',
          nextSlideMessage: '다음 슬라이드',
          slideLabelMessage: '현재 슬라이드 : {{index}} / 전체 슬라이드 : {{slidesLength}}',
        },
        on: {
          lock: (swiper) => {
            swiper.el.classList.add('inactive')
            swiper.params.loop = false
          },
          unlock: (swiper) => {
            swiper.el.classList.remove('inactive')
            swiper.params.loop = true
          },
        },
        loop: true,
        navigation: { prevEl, nextEl },
        pagination: {
          clickable: true,
          el: '.wrap_slide_desc_long .paging_slide_txt',
          type: 'custom',
          renderCustom: function (swiper, current, total) {
            return `<span class="blind">현재 슬라이드 : </span>${current} / <span class="blind">총 슬라이드 : </span>${total}`;
          }
        }
      }
      new Swiper(slide, swiperOptions)
    })
  }

  // 공통 상세 페이지 슬라이드
  const $d_slide_description = $('.d_slide_description')
  $d_slide_description.each(function(idx, el) {
    const swiperId = el.getAttribute('data-slide-id');
    const navSwiperEl = document.querySelector(`.d_slide_nav_description[data-slide-id="${swiperId}"] .swiper`);

    // 슬라이드 공통 옵션
    const slideCommOptions = {
      a11y: {
        prevSlideMessage: '이전 슬라이드',
        nextSlideMessage: '다음 슬라이드',
        slideLabelMessage: '현재 슬라이드 : {{index}} / 전체 슬라이드 : {{slidesLength}}',
      },
      on: {
        lock: (swiper) => {
          swiper.el.classList.add('inactive')
          swiper.params.loop = false
        },
        unlock: (swiper) => {
          swiper.el.classList.remove('inactive')
          swiper.params.loop = true
        },
      },
      loop: true,
    }

    if (el) {
      let navSwiper
      // 네비게이션 슬라이드
      if (navSwiperEl) {
        navSwiper = new Swiper(navSwiperEl, {
          ...slideCommOptions,
          a11y: {
            ...slideCommOptions.a11y,
            containerMessage: '이미지 네비게이션 슬라이드',
          },
          spaceBetween: 10,
          slidesPerView: 4,
          freeMode: true,
          watchSlidesProgress: true,
        });
      }

      // 메인 슬라이드
      new Swiper(el, {
        ...slideCommOptions,
        a11y: {
          ...slideCommOptions.a11y,
          containerMessage: '이미지 슬라이드',
        },
        navigation: {
          prevEl: el.querySelector('.btn_prev'),
          nextEl: el.querySelector('.btn_next'),
        },
        thumbs: navSwiper ? { swiper: navSwiper } : {}
      });
    }
  })

  return {
    // tabSelect,
    fixBody,
  }
})();