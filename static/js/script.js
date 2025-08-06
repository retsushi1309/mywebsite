// ========================================
// DOM要素の取得
// ========================================
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#mainNavigation');
const header = document.querySelector('.header-container');

// ========================================
// モバイルメニューの制御
// ========================================
function initMobileMenu() {
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // ハンバーガーメニューのアニメーション
            if (mainNav.classList.contains('active')) {
                menuToggle.innerHTML = '✕';
                menuToggle.style.transform = 'rotate(180deg)';
            } else {
                menuToggle.innerHTML = '&#9776;';
                menuToggle.style.transform = 'rotate(0deg)';
            }
        });

        // メニュー項目をクリックしたらメニューを閉じる
        const navLinks = mainNav.querySelectorAll('.nav-link, .button-primary');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '&#9776;';
                menuToggle.style.transform = 'rotate(0deg)';
            });
        });
    }
}

// ========================================
// ヘッダーのスクロール効果
// ========================================
function initHeaderScroll() {
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }

        // ヘッダーの表示/非表示制御（上スクロール時に表示）
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// ========================================
// フェードインアニメーション
// ========================================
function initFadeInAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // フェードイン対象要素を監視
    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));
}

// ========================================
// スムーススクロール
// ========================================
function initSmoothScroll() {
    // アンカーリンクのスムーススクロール
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 空のhrefや#のみの場合は処理しない
            if (!href || href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// パフォーマンス最適化用のスロットル関数
// ========================================
function throttle(func, wait) {
    let timeout;
    let previous = 0;
    
    return function() {
        const now = Date.now();
        const remaining = wait - (now - previous);
        const context = this;
        const args = arguments;
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(function() {
                previous = Date.now();
                timeout = null;
                func.apply(context, args);
            }, remaining);
        }
    };
}

// ========================================
// 要素の動的アニメーション
// ========================================
function initDynamicAnimations() {
    // ホバー効果の強化
    const cards = document.querySelectorAll('.hero-card, .contact-button, .button-primary');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 画像のホバー効果
    
}

// ========================================
// ローディングアニメーション
// ========================================
function initLoadingAnimation() {
    // ページ読み込み時のアニメーション
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        // ヒーローセクションの要素を順次表示
        const heroElements = document.querySelectorAll('.hero-title, .hero-card');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
}

// ========================================
// エラーハンドリング
// ========================================
function handleErrors() {
    window.addEventListener('error', function(e) {
        console.warn('JavaScript error detected:', e.message);
    });
}

// ========================================
// リサイズ時の処理
// ========================================
function initResizeHandler() {
    const handleResize = throttle(function() {
        // モバイルメニューが開いている場合、画面サイズが変わったら閉じる
        if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '&#9776;';
                menuToggle.style.transform = 'rotate(0deg)';
            }
        }
    }, 250);

    window.addEventListener('resize', handleResize);
}

// ========================================
// 初期化
// ========================================
function init() {
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });
    } else {
        initializeApp();
    }
}

function initializeApp() {
    try {
        // 各機能の初期化
        initMobileMenu();
        initHeaderScroll();
        initFadeInAnimation();
        initSmoothScroll();
        initDynamicAnimations();
        initLoadingAnimation();
        initResizeHandler();
        handleErrors();
        
        console.log('Praxis Web - JavaScript initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// ========================================
// アプリケーション開始
// ========================================
init();

// ========================================
// 追加のユーティリティ関数
// ========================================

// デバウンス関数（検索機能などで使用可能）
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// 要素の表示状態をチェック
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 安全な要素取得
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`);
        return null;
    }
}

// パフォーマンス監視（開発用）
if (typeof performance !== 'undefined') {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }, 0);
    });
}