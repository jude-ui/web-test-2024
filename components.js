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
  
  /**
   * 1. 접근성 공통 탭 기능
   * 2. 기본적으로 ul > li > a 구조를 사용하며 a태그의 aria-selected를 사용하는 것을 기본으로 작동됨
   * 3. 탭패널 연동이 필요할 경우 tabPanel 프로퍼티에 탭 패널 클래스 네이밍 추가
   * @param {string}   tabList          (필수) ul의 클래스 네이밍
   * @param {string}   target           (옵션, 기본값 'a') ul요소 하위에 있는 클릭을 하는 요소의 클래스 또는 태그 이름
   * @param {string}   activeClass      (옵션, 기본값 'on') 클래스 제어시 붙을 클래스 네이밍
   * @param {string}   container        (옵션, 기본값 '.tab_container') 탭과 탭 패널을 감싸고 있는 특정 탭 컨테이너 요소의 클래스 네이밍
   * @param {string}   tabPanel         (옵션) 탭 패널 있을 경우 탬 패널의 클래스 네이밍
   * @param {string}   panelActiveClass (옵션, 기본값 'on') 탭 패널에 붙는 탭 패널 활성 클레스 네이밍
   * @param {string}   classTarget      (옵션) aria 대신 클래스 제어가 필요할 때 사용 : ul요소 하위에 있되 클래스가 붙을 요소의 클래스 네이밍 또는 태그 이름
   * @param {function} callback         (옵션) 탭 패널이 전환된 뒤 사용할 수 있는 콜백함수
   * @param {object}   callbackParams   (옵션) 콜백 함수에 전달될 파라미터들
   * @param {jQuery}   callbackParams.$self            (옵션) 현재 클릭된 탭 요소의 jQuery 객체
   * @param {string}   callbackParams.container        (옵션) 탭 컨테이너의 클래스 네이밍
   * @param {string}   callbackParams.tabPanel         (옵션) 탭 패널의 클래스 네이밍
   * @param {number}   callbackParams.tabPanelIndex    (옵션) 활성화되는 탭 패널의 인덱스
   * @param {string}   callbackParams.panelActiveClass (옵션) 탭 패널의 활성 클래스 네이밍
   */
  function tabSelect({
      tabList,
      target = 'a',
      activeClass = 'on',
      container = '.tab_container',
      tabPanel,
      panelActiveClass = 'on',
      classTarget,
      callback
    }) {

    $(tabList).each(function(idx, tabListEl) {
      const $tabListEl = $(tabListEl)
      const $targets = $tabListEl.find(target)
      const isHasTabLink = $targets.is('[data-tab-link]')
      
      if (isHasTabLink) { // data-tab-link 속성이 있는 탭
        let tabLinkCount = 0;
        $targets.each(function(idx, targetEl) {
          const $targetEl = $(targetEl)
          
          // data-tab-link 속성이 있는 targetEl과 없는 targetEl 분기처리
          if ($targetEl.is('[data-tab-link]')) {
            tabLinkCount += 1; // data-tab-link 속성이 있는 탭 갯수마다 +1씩
            $targetEl.on('click', function() {
              const $self = $(this)
              const targetAttr = $self.attr('target');
              if (targetAttr) {
                window.open($self.attr('href'), targetAttr);
              } else {
                window.location.href = $self.attr('href');
              }
            })
          } else {
            let tabPanelIndex = idx - tabLinkCount; // data-tab-link를 제외한 탭패널의 인덱스

            $targetEl.on('click', function(e) {
              tabHandler({ e, self: this, tabPanelIndex, $tabListEl })
            })
          }
        })
      } else { // data-tab-link 속성이 없는 탭
        const isHasTabLink = $tabListEl.closest('.type_link').length
        if (isHasTabLink) return; // type_link 클래스가 있는 탭일 경우 모든 탭이 링크 이동 되도록 이곳에서 코드 종료

        $targets.each(function(index, targetEl) {
          const $targetEl = $(targetEl)
          $targetEl.on('click', function(e) {
            tabHandler({ e, self: this, tabPanelIndex: index, $tabListEl })
          })
        })
      }
    })
    
    function tabHandler({ e, self, tabPanelIndex, $tabListEl }) {
      e.preventDefault()
      const $self = $(self)
      const $targets = $self.closest($tabListEl).find(target)

      if (classTarget) {
        $self.closest($tabListEl).find(classTarget).removeClass(activeClass)
        $self.closest(classTarget).addClass(activeClass)
      } else {
        console.log('test');
        $targets.attr('aria-selected', 'false')
        $self.attr('aria-selected', 'true')
      }

      if (tabPanel) {
        const $tabPanel = $(tabPanel)
        const $panels = $self.closest(container).find($tabPanel)
        $panels.removeClass(panelActiveClass)
        $panels.eq(tabPanelIndex).addClass(panelActiveClass)
        if (callback) {
          callback({ $self, container, tabPanel, tabPanelIndex, panelActiveClass })
        }
      }
    }
  }

  // 공통 - 탭
  const $tabComm = $('.tab_comm');
  if ($tabComm.length) {
    $tabComm.each(function (idx, item) {
      const $window = $(window);
      const $item = $(item);
      const text = $item.find('[aria-selected=true]').text();
      const $titTab = $item.find('.tit_tab');
      const breakPoint = 1460;

      $titTab.html(text); // 선택된 탭 텍스트 삽입

      // M 탭 클릭 & 화살표 아이콘 제어
      $titTab.on('click', function (e) {
        e.preventDefault();
        const $self = $(this);
        if ($self.parent().hasClass('on')) {
          // 열려 있다
          $self.next().stop().slideUp(300);
          $self.parent().removeClass('on');
        } else {
          // 닫혀 있다
          $('.tab_comm').removeClass('on').find('.list_tab').stop().slideUp(300)
          $self.next().stop().slideDown(300)
          $self.parent().addClass('on')
        }
      });

      // M ui 에서 메뉴 펼쳐졌을 때 스타일을 pc 화면(1024px 이상)에서 제거
      let timeoutInfo = null;
      $window.on('resize', function () {
        clearTimeout(timeoutInfo);
        timeoutInfo = setTimeout(styleRemoveHandler, 100);
      });
      function styleRemoveHandler() {
        if ( $window.outerWidth() >= breakPoint ) {
          $item.find('.list_tab').removeAttr('style'); // 토글 속성 삭제
          $item.removeClass('on'); // 화살표 아이콘 초기화
        }
      }

      // PC, M 탭 클릭
      $item.find('.list_tab a').on('click', function (e) {
        const $self = $(this);
        let txt = $self.text();
      
        // 탭 클릭하여 링크 이동이 아닌 경우
        if (!$self.closest('.tab_comm').hasClass('type_link')) {
          e.preventDefault();
          if ($self.closest('ul').find('.tab i').length) {
            const $icon = $self.closest('ul').find('a[aria-selected="true"] i')
            $icon.prependTo($self)
          }

          // 탭 선택시 스타일 변경
          $self.closest('ul').find('a').attr('aria-selected', 'false');
          $self.attr('aria-selected', 'true');
      
          // 선택한 탭의 텍스트를 .tit_tab 요소의 텍스트로 삽입
          $self.closest('.tab_comm').find('.tit_tab').html(txt);

          // M 탭 ui일 경우(breakPoint 미만) 펼쳐진 탭메뉴를 닫기
          if ($window.outerWidth() < breakPoint) {
            $self.closest('ul').slideUp(300).parent().removeClass('on');
          }
        }
      });
    });
  }

  // 탭과 컨테이너 제어 (공통)
  if ($('.tab_container > .tab_comm .list_tab').length && $('.tab_container .tab_panel').length) {
    tabSelect({
      tabList: '.tab_container > .tab_comm .list_tab',
      container: '.tab_container',
      tabPanel: '.tab_panel',
    });
  }

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
    let isFixed = false;
    const $body = $('body');
    const $window = $(window);

    function unfix() {
      if (isFixed) {
        $body.removeAttr('style');
        $window.scrollTop(currentScrollTop);
        isFixed = false
      }
    };

    function fix(isHidden = false) {
      if (!isFixed) {
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
        isFixed = true
      }
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
   * @param {string}  [options.activeClass] - 레이어 팝업 토글 시키는 클래스 네임
   * @param {string}  [options.defaultLayerName] - 레이어 팝업의 기본 클래스 네임
   * @param {Function} [options.commOpenCallback] - 레이어 팝업 공통 Open 콜백 함수
   * @param {Function} [options.commCloseCallback] - 레이어 팝업 공통 Close 콜백 함수
   */
  class LayerComm {
    constructor(options = {}) {
      this.activeClass = options.activeClass ? options.activeClass : 'on'
      this.$openButton = $('[data-open-layer]')
      this.$closeButton = $('[data-close-layer]')
      this.defaultLayerName = $.trim(
        options.defaultLayerName ? `.layer_comm, .d_layer_comm, ${options.defaultLayerName}` : '.layer_comm, .d_layer_comm'
      )
      this.commOpenCallback = options.commOpenCallback
      this.commCloseCallback = options.commCloseCallback
      this.handleOpenPopup = this.handleOpenPopup.bind(this);
      this.handleClosePopup = this.handleClosePopup.bind(this);
      this.popups = {}; // 개별 팝업 콜백 저장 객체

      this.currentScrollTop = null;
      this.isFixed = false;
      this.$body = $('body');
      this.$window = $(window);

      this.$fstTab = null;
      this.$lstTab = null;
      this.bindKeyEvt = this.bindKeyEvt.bind(this)
      this.currentPopup = null;
      
      this.init()
    }

    init() {
      const _ = this
      _.$openButton.each(function () {
        $(this).off('click', _.handleOpenPopup)
                .on('click', _.handleOpenPopup)
      })

      $(document).off('click', _.$closeButton, _.handleClosePopup)
                  .on('click', _.$closeButton, _.handleClosePopup)
    }

    fix() {
      if (!this.isFixed) {
        const isOverflow = document.documentElement.clientHeight < document.documentElement.scrollHeight;
  
        this.currentScrollTop = this.$window.scrollTop();
        const styles = {
          position: 'fixed',
          top: -this.currentScrollTop,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: isOverflow ? 'scroll' : '',
        }
        this.$body.css(styles)
        this.isFixed = true
      }
    }

    unfix() {
      if (this.isFixed) {
        this.$body.removeAttr('style');
        this.$window.scrollTop(this.currentScrollTop);
        this.isFixed = false
      }
    }

    handleOpenPopup(e) {
      if ($(e.target).is('[data-open-layer]')) e.preventDefault();
      
      const layerPopupId = $(e.currentTarget).data('openLayer')
      const $popup = $(`#${layerPopupId}`)
      this.open($popup)
    }

    handleClosePopup(e) {
      if ($(e.target).is('[data-close-layer]')) e.preventDefault();

      // 클릭한 요소가 [data-close-layer] 일 경우
      if ($(e.target).is('[data-close-layer]')) {
        const $popup = $(e.target).closest(this.defaultLayerName);
        
        this.close($popup)
      }
    }
    open($popup) {
      this.currentPopup = $popup;
      if ($popup.prop('tagName') === 'DIALOG') {
        $popup.get(0).showModal()
      } else {
        $popup.addClass(this.activeClass)
      }
      $popup.one('transitionend', () => {
        this.focusFirstElement($popup)
        $popup.on('keydown', this.bindKeyEvt);
      })
      this.fix()
      this._executeCallback($popup, 'open')
    }
    
    close($popup) {
      if ($popup.prop('tagName') === 'DIALOG') {
        $popup.get(0).close()
      } else {
        $popup.removeClass(this.activeClass)
      }
      $popup.off('keydown', this.bindKeyEvt);
      this.unfix()
      $(`[data-open-layer="${$popup.attr('id')}"]`).focus()
      this._executeCallback($popup, 'close')
      this.currentPopup = null;
    }

    focusFirstElement($popup) {
      const focusableSelectors = 'a[href], iframe, input, select, textarea, button, [tabindex="0"], [contenteditable]';
      const $focusable = $popup.find(focusableSelectors).not('[disabled], [tabindex="-1"], :hidden')
      this.$fstTab = $focusable[0]
      this.$lstTab = $focusable[$focusable.length - 1]

      if (this.$fstTab === this.$lstTab) {
        this.$lstTab = null
      }
      this.$fstTab.focus()
    }

    bindKeyEvt(e) {
      const keycode = e.keycode || e.which;
      const $target = e.target;
    
      switch (keycode) {
        case 9:  // tab key
          if (this.$fstTab && this.$lstTab) {
            if (e.shiftKey) {
              if (this.$fstTab && $target == this.$fstTab) {
                e.preventDefault();
                if (this.$lstTab) this.$lstTab.focus();
              }
            } else {
              if (this.$lstTab && $target == this.$lstTab) {
                e.preventDefault();
                if (this.$fstTab) this.$fstTab.focus();
              }
            }
          } else {
            e.preventDefault();
          }
          break;
        case 27:  // esc key
          e.preventDefault();
          this.close(this.currentPopup)
          break;
        default:
          break;
      }
    }

    callback({ layerName, openCallback, closeCallback }) {
      this.popups[layerName.replace('#', '')] = { openCallback, closeCallback }
    }

    _executeCallback($popup, action) {
      // 공통 콜백 처리
      const commonCallback = action === 'open' ? this.commOpenCallback : this.commCloseCallback
      if (typeof commonCallback === 'function') {
        commonCallback($popup, this.activeClass, this.defaultLayerName)
      }
  
      // 개별 팝업 콜백 처리
      const popupId = $popup.attr('id');
      const popupCallback = this.popups[popupId] ? this.popups[popupId][`${action}Callback`] : null
      if (typeof popupCallback === 'function') {
        popupCallback($popup, this.activeClass, this.defaultLayerName)
      }
    }
  }

  // 공통 콜백 함수 설정
  const layerComm = new LayerComm({
    /**
     * 
     * @param {jQuery} $popup 팝업 레이어
     * @param {string} activeClass 팝업 활성 클래스
     * @param {string} defaultLayerName 기본 레이어 팝업 네이밍
     */
    commOpenCallback: $popup => {
      // console.log('공통 open', $popup)
    },
    commCloseCallback: $popup => {
      // console.log('공통 close', $popup)
    },
  })

  // 개별 콜백 함수 설정 (개별 페이지 최하단 script 태그에 삽입)
  // uiCompo.layerComm.callback({
  //   layerName: '#layerTest', // 개별 콜백함수처리할 팝업 id 값
  //   openCallback: $popup => { // 개별 open 콜백
  //     console.log('개별 open', $popup);
  //   },
  //   closeCallback: $popup => { // 개별 close 콜백
  //     console.log('개별 close', $popup);
  //   }
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
    tabSelect,
    fixBody,
    layerComm,
  }
})();