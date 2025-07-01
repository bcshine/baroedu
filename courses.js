// 강좌 목록 페이지 JavaScript 기능

document.addEventListener('DOMContentLoaded', function() {
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
        
        // 카운트 업데이트
        updateCourseCount();
    }
    
    // 카테고리 필터링
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            courseItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // 애니메이션 효과
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.display = 'none';
                }
            });
            
            // 필터링 후 카운트 업데이트
            updateCourseCount();
        });
    });
    
    // 정렬 기능
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortType = this.value;
            const coursesGrid = document.getElementById('courses-grid');
            const courseItemsArray = Array.from(courseItems);
            
            courseItemsArray.sort((a, b) => {
                switch (sortType) {
                    case 'latest':
                        // 최신순 (데이터 속성으로 구현 가능)
                        return Math.random() - 0.5; // 임시로 랜덤 정렬
                    
                    case 'popular':
                        // 인기순 (수강생 수 기준)
                        const studentsA = parseInt(a.querySelector('.students-count').textContent.replace(/[^0-9]/g, ''));
                        const studentsB = parseInt(b.querySelector('.students-count').textContent.replace(/[^0-9]/g, ''));
                        return studentsB - studentsA;
                    
                    case 'price-low':
                        // 가격 낮은순
                        const priceA = getPriceFromElement(a);
                        const priceB = getPriceFromElement(b);
                        return priceA - priceB;
                    
                    case 'price-high':
                        // 가격 높은순
                        const priceA2 = getPriceFromElement(a);
                        const priceB2 = getPriceFromElement(b);
                        return priceB2 - priceA2;
                    
                    case 'rating':
                        // 평점순
                        const ratingA = parseFloat(a.querySelector('.rating-score').textContent);
                        const ratingB = parseFloat(b.querySelector('.rating-score').textContent);
                        return ratingB - ratingA;
                    
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
    const itemsPerPage = 10; // 페이지당 강좌 수
    
    function updatePagination() {
        const visibleCourses = Array.from(courseItems).filter(item => 
            item.style.display !== 'none'
        );
        
        const totalPages = Math.ceil(visibleCourses.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // 강좌 표시/숨김
        visibleCourses.forEach((item, index) => {
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
        
        // 이전/다음 버튼 상태 업데이트
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
        }
    }
    
    // 페이지네이션 이벤트 리스너
    paginationNumbers.forEach(btn => {
        btn.addEventListener('click', function() {
            currentPage = parseInt(this.textContent);
            updatePagination();
            // 페이지 상단으로 스크롤
            window.scrollTo({
                top: document.querySelector('.courses-list').offsetTop - 100,
                behavior: 'smooth'
            });
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
            currentPage++;
            updatePagination();
        });
    }
    
    // 초기 페이지네이션 설정
    updatePagination();
    
    // 검색 기능 (검색창이 있다면)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            courseItems.forEach(item => {
                const title = item.querySelector('.course-title a').textContent.toLowerCase();
                const subtitle = item.querySelector('.course-subtitle').textContent.toLowerCase();
                const category = item.querySelector('.course-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || 
                    subtitle.includes(searchTerm) || 
                    category.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            updateCourseCount();
            currentPage = 1; // 검색 시 첫 페이지로
            updatePagination();
        });
    }
    
    // 위시리스트 기능
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.closest('.course-item').getAttribute('data-course-id');
            
            // 위시리스트 추가/제거 로직
            if (this.classList.contains('added')) {
                this.classList.remove('added');
                this.innerHTML = '<i class="far fa-heart"></i> 위시리스트';
                removeFromWishlist(courseId);
            } else {
                this.classList.add('added');
                this.innerHTML = '<i class="fas fa-heart"></i> 위시리스트 완료';
                addToWishlist(courseId);
            }
        });
    });
    
    // 로컬 스토리지 위시리스트 관리
    function addToWishlist(courseId) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (!wishlist.includes(courseId)) {
            wishlist.push(courseId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
        
        // 알림 표시
        showNotification('위시리스트에 추가되었습니다!');
    }
    
    function removeFromWishlist(courseId) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        wishlist = wishlist.filter(id => id !== courseId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        showNotification('위시리스트에서 제거되었습니다.');
    }
    
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
    
    // 스크롤 시 헤더 효과 (기존 script.js와 동일)
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
    
    // 강좌 카드 애니메이션
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
    
    // 초기 애니메이션 설정
    courseItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}); 