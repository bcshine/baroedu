// 히어로 슬라이더 기능
document.addEventListener('DOMContentLoaded', function() {
    // 슬라이더 요소들
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // 다음 슬라이드로 이동
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }
    
    // 이전 슬라이드로 이동
    function prevSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
    }
    
    // 버튼 이벤트 리스너
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // 자동 슬라이드 (5초마다)
    setInterval(nextSlide, 5000);
    
    // 터치 스와이프 지원 (모바일)
    let startX = 0;
    let endX = 0;
    
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        heroSection.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        heroSection.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // 왼쪽으로 스와이프 - 다음 슬라이드
                } else {
                    prevSlide(); // 오른쪽으로 스와이프 - 이전 슬라이드
                }
            }
        }
    }
});

// 강좌 더보기 기능
function toggleDetails(button) {
    const courseCard = button.closest('.course-card');
    const details = courseCard.querySelector('.course-details');
    
    if (details.classList.contains('show')) {
        details.classList.remove('show');
        button.textContent = '더보기';
        button.style.background = '#2c5aa0';
    } else {
        details.classList.add('show');
        button.textContent = '접기';
        button.style.background = '#ff6b35';
    }
}

// 부드러운 스크롤
document.addEventListener('DOMContentLoaded', function() {
    // 내비게이션 링크 클릭 시 부드러운 스크롤
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 지금 시작하기 버튼 클릭 시 강좌 섹션으로 이동
    const startButtons = document.querySelectorAll('.btn-start');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const coursesSection = document.querySelector('#courses');
            if (coursesSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = coursesSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// 모바일 메뉴 토글 (추후 확장 가능)
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
    }
});

// 스크롤 시 헤더 스타일 변경
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
});

// 애니메이션 효과 (Intersection Observer)
document.addEventListener('DOMContentLoaded', function() {
    // 요소가 화면에 나타날 때 애니메이션 효과
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션을 적용할 요소들
    const animateElements = document.querySelectorAll('.course-card, .review-card, .section-title');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 강좌 슬라이더 자동 스크롤 (선택적)
document.addEventListener('DOMContentLoaded', function() {
    const coursesSlider = document.querySelector('.courses-slider');
    
    if (coursesSlider) {
        // 마우스 휠을 이용한 수평 스크롤
        coursesSlider.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                coursesSlider.scrollLeft += e.deltaY;
            }
        });
    }
});

// 폼 유효성 검사 (로그인/회원가입 모달 추가 시 사용)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

// 로컬 스토리지를 이용한 사용자 설정 저장
function saveUserPreference(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getUserPreference(key) {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
}

// 페이지 로드 성능 최적화
document.addEventListener('DOMContentLoaded', function() {
    // 이미지 lazy loading
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// 사용자 분석을 위한 기본 이벤트 트래킹
function trackEvent(eventName, properties = {}) {
    // 추후 Google Analytics 또는 다른 분석 도구 연동 시 사용
    console.log('Event tracked:', eventName, properties);
    
    // 예시: 강좌 클릭 트래킹
    if (eventName === 'course_click') {
        // 분석 도구에 이벤트 전송
    }
}

// 버튼 클릭 시 이벤트 트래킹
document.addEventListener('DOMContentLoaded', function() {
    // 강좌 더보기 버튼 클릭 트래킹
    const moreButtons = document.querySelectorAll('.btn-more');
    moreButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const courseTitle = this.closest('.course-card').querySelector('h3').textContent;
            trackEvent('course_details_view', {
                course_title: courseTitle,
                course_index: index
            });
        });
    });
    
    // 지금 시작하기 버튼 클릭 트래킹
    const startButtons = document.querySelectorAll('.btn-start');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('start_button_click', {
                button_location: 'hero_banner'
            });
        });
    });
}); 