// ===== 강좌 목록 페이지 JavaScript =====
document.addEventListener('DOMContentLoaded', function() {
    // 인증 상태 확인
    setTimeout(() => {
        if (typeof window.checkAuthStatus === 'function') {
            window.checkAuthStatus();
        } else if (typeof checkAuthStatus === 'function') {
            checkAuthStatus();
        }
    }, 100);
    
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
    
    if (loginBtn && !loginBtn.onclick) {
        loginBtn.addEventListener('click', function() {
            if (typeof openModal === 'function') {
                openModal('loginModal');
            } else if (typeof window.openModal === 'function') {
                window.openModal('loginModal');
            }
        });
    }
    
    if (signupBtn && !signupBtn.onclick) {
        signupBtn.addEventListener('click', function() {
            if (typeof openModal === 'function') {
                openModal('signupModal');
            } else if (typeof window.openModal === 'function') {
                window.openModal('signupModal');
            }
        });
    }
    
    if (logoutBtn && !logoutBtn.onclick) {
        logoutBtn.addEventListener('click', function() {
            if (typeof handleLogout === 'function') {
                handleLogout();
            } else if (typeof window.handleLogout === 'function') {
                window.handleLogout();
            }
        });
    }
    
    // 필터링 기능
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseItems = document.querySelectorAll('.course-item');
    const sortSelect = document.getElementById('sort-select');
    
    // URL 파라미터에서 카테고리 확인
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // 카테고리 버튼 활성화
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.trim() === category || btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
        
        // 해당 카테고리로 필터링
        courseItems.forEach(item => {
            if (item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        updateCourseCount();
    }
    
    // 필터 버튼 이벤트
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // 강좌 필터링
            courseItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            updateCourseCount();
        });
    });
    
    // 정렬 기능
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortType = this.value;
            const coursesGrid = document.querySelector('.courses-grid');
            const courseItemsArray = Array.from(courseItems);
            
            courseItemsArray.sort((a, b) => {
                switch (sortType) {
                    case 'price-low':
                        return getPriceFromElement(a) - getPriceFromElement(b);
                    case 'price-high':
                        return getPriceFromElement(b) - getPriceFromElement(a);
                    case 'rating':
                        return getDateFromElement(b) - getDateFromElement(a);
                    case 'popular':
                        return getDateFromElement(b) - getDateFromElement(a);
                    default:
                        return 0;
                }
            });
            
            // 정렬된 순서로 DOM 재배치
            courseItemsArray.forEach(item => {
                coursesGrid.appendChild(item);
            });
        });
    }
    
    // 가격 추출 함수
    function getPriceFromElement(element) {
        const priceElement = element.querySelector('.current-price');
        if (priceElement) {
            return parseInt(priceElement.textContent.replace(/[^0-9]/g, ''));
        }
        return 0;
    }
    
    // 날짜 추출 함수 (기본값)
    function getDateFromElement(element) {
        return Date.now();
    }
    
    // 강좌 수 업데이트
    function updateCourseCount() {
        const visibleCourses = document.querySelectorAll('.course-item[style*="display: block"], .course-item:not([style*="display: none"])');
        const countElement = document.querySelector('.course-count');
        if (countElement) {
            countElement.textContent = `총 ${visibleCourses.length}개의 강좌`;
        }
    }
    
    // 페이지네이션 기능
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    let currentPage = 1;
    const itemsPerPage = 10;
    
    if (paginationNumbers.length > 0) {
        paginationNumbers.forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.textContent);
                updatePagination();
            });
        });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const totalPages = Math.ceil(courseItems.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            });
        }
    }
    
    function updatePagination() {
        // 현재 페이지에 해당하는 강좌만 표시
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        courseItems.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // 페이지네이션 버튼 업데이트
        paginationNumbers.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === currentPage) {
                btn.classList.add('active');
            }
        });
    }
    
    // 위시리스트 기능
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseItem = this.closest('.course-item');
            const courseId = courseItem.getAttribute('data-course-id');
            const courseTitle = courseItem.querySelector('.course-title').textContent;
            
            let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            
            if (wishlist.includes(courseId)) {
                // 위시리스트에서 제거
                wishlist = wishlist.filter(id => id !== courseId);
                this.classList.remove('added');
                this.innerHTML = '<i class="far fa-heart"></i> 위시리스트';
                showNotification('위시리스트에서 제거되었습니다.');
            } else {
                // 위시리스트에 추가
                wishlist.push(courseId);
                this.classList.add('added');
                this.innerHTML = '<i class="fas fa-heart"></i> 위시리스트 완료';
                showNotification(`"${courseTitle}"이 위시리스트에 추가되었습니다.`);
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    });
    
    // 알림 표시 함수
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c5aa0;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 애니메이션
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 자동 제거
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 페이지 로드 시 위시리스트 상태 복원
    function restoreWishlistStatus() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        courseItems.forEach(item => {
            const courseId = item.getAttribute('data-course-id');
            const wishlistBtn = item.querySelector('.btn-wishlist');
            
            if (wishlist.includes(courseId) && wishlistBtn) {
                wishlistBtn.classList.add('added');
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> 위시리스트 완료';
            }
        });
    }
    
    // 초기화
    restoreWishlistStatus();
    updateCourseCount();
}); 