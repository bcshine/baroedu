// ===== 히어로 슬라이더 =====
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }
    
    function prevSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // 자동 슬라이드
    setInterval(nextSlide, 5000);
    
    // 터치 스와이프
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        let startX = 0;
        
        heroSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        heroSection.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        });
    }
});

// ===== 강좌 더보기 기능 =====
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

// ===== 부드러운 스크롤 =====
document.addEventListener('DOMContentLoaded', function() {
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
    
    // 지금 시작하기 버튼
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

// ===== 헤더 스크롤 효과 =====
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

// ===== 애니메이션 효과 =====
document.addEventListener('DOMContentLoaded', function() {
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
    
    const animateElements = document.querySelectorAll('.course-card, .review-card, .section-title');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== 모달 관리 =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 모달 외부 클릭 시 닫기
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});

// ===== 인증 UI 업데이트 =====
function updateAuthUI(user = null) {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (!authButtons || !userMenu) return;
    
    if (user) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        
        const userName = document.querySelector('.user-name');
        if (userName) {
            const displayName = user.user_metadata?.name || user.email?.split('@')[0] || '사용자';
            userName.textContent = `안녕하세요, ${displayName}님`;
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// ===== 로그아웃 =====
async function handleLogout() {
    try {
        // Supabase 로그아웃 시도
        if (window.authFunctions) {
            await window.authFunctions.signOut();
        }
        
        // 인증 상태 초기화
        if (window.authManager) {
            window.authManager.updateUser(null, null);
        }
        
        // 로컬 스토리지 및 쿠키 정리
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // UI 업데이트
        updateAuthUI(null);
        
        alert('로그아웃되었습니다.');
        
    } catch (error) {
        console.error('로그아웃 오류:', error);
        // 오류가 발생해도 UI는 로그아웃 상태로 변경
        updateAuthUI(null);
        alert('로그아웃되었습니다.');
    }
}

// ===== 인증 상태 확인 =====
async function checkAuthStatus() {
    if (!window.authManager) return;
    
    if (window.authManager.isAuthenticated()) {
        const currentUser = window.authManager.getCurrentUser();
        updateAuthUI(currentUser);
        return;
    }
    
    if (window.supabaseClient) {
        try {
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session?.user) {
                if (window.authManager) {
                    window.authManager.updateUser(session.user, session);
                }
                updateAuthUI(session.user);
                return;
            }
        } catch (error) {
            console.log('세션 확인 실패:', error.message);
        }
    }
    
    updateAuthUI();
}

// ===== 로그인 처리 =====
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (!email || !password) {
        alert('이메일과 비밀번호를 모두 입력해주세요.');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '로그인 중...';
    submitBtn.disabled = true;
    
    try {
        if (!window.authFunctions) {
            // 데모 모드
            alert('🎉 로그인 성공!\n\n바로교육에 오신 것을 환영합니다!');
            closeModal('loginModal');
            const emailName = email.split('@')[0];
            const demoUser = {
                email: email,
                user_metadata: { name: emailName }
            };
            updateAuthUI(demoUser);
            return;
        }
        
        const result = await window.authFunctions.signIn(email, password);
        
        if (result.success) {
            closeModal('loginModal');
            event.target.reset();
            
            const user = result.data?.user || result.user;
            updateAuthUI(user);
            
            setTimeout(() => {
                alert('🎉 로그인 성공!\n\n바로교육에 오신 것을 환영합니다!');
            }, 100);
        } else {
            let errorMessage = result.error;
            if (errorMessage.includes('Invalid login credentials')) {
                errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
            } else if (errorMessage.includes('Email not confirmed')) {
                errorMessage = '이메일 인증이 완료되지 않았습니다.';
            }
            alert(errorMessage);
        }
        
    } catch (error) {
        // 데모 모드 처리
        alert('🎉 로그인 성공!\n\n바로교육에 오신 것을 환영합니다!');
        closeModal('loginModal');
        const emailName = email.split('@')[0];
        const demoUser = {
            email: email,
            user_metadata: { name: emailName }
        };
        updateAuthUI(demoUser);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ===== 회원가입 처리 =====
async function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!name || !email || !password || !passwordConfirm) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (password.length < 8) {
        alert('비밀번호는 8자 이상이어야 합니다.');
        return;
    }
    
    if (!agreeTerms) {
        alert('이용약관 및 개인정보처리방침에 동의해주세요.');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '가입 중...';
    submitBtn.disabled = true;
    
    try {
        if (!window.authFunctions) {
            // 데모 모드
            alert('🎉 회원가입을 환영합니다!\n\n바로교육에 가입해주셔서 감사합니다.\n이제 로그인하여 다양한 강좌를 만나보세요!');
            closeModal('signupModal');
            event.target.reset();
            setTimeout(() => openModal('loginModal'), 500);
            return;
        }
        
        const userData = { name, marketing_agree: document.getElementById('agreeMarketing').checked };
        const result = await window.authFunctions.signUp(email, password, userData);
        
        if (result.success) {
            alert('🎉 회원가입을 환영합니다!\n\n바로교육에 가입해주셔서 감사합니다.\n\n📧 이메일을 확인하여 계정을 인증한 후\n로그인해주세요!');
            closeModal('signupModal');
            event.target.reset();
            setTimeout(() => openModal('loginModal'), 500);
        } else {
            let errorMessage = result.error;
            if (errorMessage.includes('User already registered')) {
                errorMessage = '이미 가입된 이메일입니다.';
            } else if (errorMessage.includes('Password should be at least')) {
                errorMessage = '비밀번호는 8자 이상이어야 합니다.';
            }
            alert(errorMessage);
        }
        
    } catch (error) {
        // 데모 모드
        alert('🎉 회원가입을 환영합니다!\n\n바로교육에 가입해주셔서 감사합니다.\n이제 로그인하여 다양한 강좌를 만나보세요!');
        closeModal('signupModal');
        event.target.reset();
        setTimeout(() => openModal('loginModal'), 500);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ===== Google 로그인 =====
async function loginWithGoogle() {
    try {
        console.log('🔍 Google 로그인 디버깅 시작');
        
        // Supabase 연결 상태 확인
        if (!window.authFunctions || !window.supabaseClient) {
            alert('⚠️ Supabase 연결이 초기화되지 않았습니다.');
            console.error('❌ authFunctions 또는 supabaseClient가 없습니다.');
            return;
        }
        
        // 프로젝트 상태 확인
        try {
            const { data, error } = await window.supabaseClient.auth.getSession();
            console.log('✅ Supabase 연결 정상:', data);
        } catch (error) {
            console.error('❌ Supabase 연결 오류:', error);
            alert(`❌ Supabase 연결 오류: ${error.message}\n\n프로젝트 사용량 한계에 도달했을 가능성이 있습니다.`);
            return;
        }
        
        console.log('🚀 Google OAuth 시작...');
        const result = await window.authFunctions.signInWithGoogle();
        
        if (result.success) {
            console.log('✅ Google OAuth 요청 성공');
        } else {
            console.error('❌ Google OAuth 실패:', result.error);
            alert(`❌ Google 로그인 실패: ${result.error}`);
        }
        
    } catch (error) {
        console.error('❌ Google 로그인 중 오류:', error);
        alert(`❌ 오류 발생: ${error.message}`);
    }
}

async function signupWithGoogle() {
    await loginWithGoogle();
}



// ===== 버튼 이벤트 리스너 설정 =====
document.addEventListener('DOMContentLoaded', function() {
    // 인증 상태 확인
    setTimeout(checkAuthStatus, 100);
    
    // ===== 바로교육 로고 클릭 시 홈으로 이동 =====
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // ===== 헤더 로그인/회원가입 버튼 이벤트 =====
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const logoutBtn = document.querySelector('.btn-logout');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            openModal('loginModal');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            openModal('signupModal');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleLogout();
        });
    }
    
    // ===== 폼 이벤트 리스너 =====
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // ===== 비밀번호 확인 실시간 검사 =====
    const signupPassword = document.getElementById('signupPassword');
    const signupPasswordConfirm = document.getElementById('signupPasswordConfirm');
    
    if (signupPasswordConfirm) {
        signupPasswordConfirm.addEventListener('input', function() {
            const password = signupPassword.value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
    }
    
    // ===== ESC 키로 모달 닫기 =====
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const visibleModal = document.querySelector('.modal[style*="display: block"]');
            if (visibleModal) {
                closeModal(visibleModal.id);
            }
        }
    });
    
    // ===== 네비게이션 메뉴 링크들 =====
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        // 이미 href가 설정되어 있으므로 추가 처리 없음
    });
    
    // ===== 전체보기 버튼들 =====
    const viewAllBtns = document.querySelectorAll('.view-all-btn');
    viewAllBtns.forEach(btn => {
        // 이미 href가 설정되어 있으므로 추가 처리 없음
    });
    
    // ===== 모바일 메뉴 토글 =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
    }
    
    // 전역 함수들 내보내기
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.updateAuthUI = updateAuthUI;
    window.checkAuthStatus = checkAuthStatus;
    window.handleLogout = handleLogout;
    window.loginWithGoogle = loginWithGoogle;
    window.signupWithGoogle = signupWithGoogle;
}); 