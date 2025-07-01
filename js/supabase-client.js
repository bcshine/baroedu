// Supabase 클라이언트 설정
// 실제 프로젝트에서는 환경변수로 관리해야 합니다

// ✅ 바로교육 실제 Supabase 프로젝트 설정
const SUPABASE_URL = 'https://nvtxwrpfskqwzzcniahm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dHh3cnBmc2txd3p6Y25pYWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNDUzOTIsImV4cCI6MjA2NjkyMTM5Mn0.imfzzFkUjaPO8gCpDuPpWQo_wf6IhQjMtHX68sX1Fpk';

// Supabase CDN에서 라이브러리 로드
// HTML head에 다음 스크립트 태그를 추가해야 합니다:
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

// Supabase 클라이언트 초기화
let supabase;

// 초기화 함수
function initSupabase() {
    try {
        // 윈도우 객체에서 Supabase 라이브러리 확인
        const SupabaseLib = window.supabase || window.Supabase;
        
        if (typeof SupabaseLib === 'undefined') {
            console.error('❌ Supabase 라이브러리가 로드되지 않았습니다.');
            console.log('💡 해결방법: 인터넷 연결을 확인하고 페이지를 새로고침 해주세요.');
            return null;
        }
        
        // 실제 프로젝트 값이 설정되었는지 확인
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
            console.warn('⚠️ Supabase 프로젝트 설정이 필요합니다. 아래 가이드를 따라주세요:');
            console.log('1. https://supabase.com에서 새 프로젝트 생성');
            console.log('2. Project Settings > API에서 URL과 anon key 복사');
            console.log('3. js/supabase-client.js 파일의 SUPABASE_URL과 SUPABASE_ANON_KEY 값 교체');
            return null;
        }
        
        // Supabase 클라이언트 초기화
        supabase = SupabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase 클라이언트 초기화 완료');
        console.log('🔗 연결된 프로젝트:', SUPABASE_URL);
        return supabase;
        
    } catch (error) {
        console.error('❌ Supabase 초기화 실패:', error);
        console.log('💡 해결방법: 페이지를 새로고침 하거나 네트워크 연결을 확인하세요.');
        return null;
    }
}

// 인증 상태 관리
class AuthManager {
    constructor() {
        this.user = null;
        this.session = null;
        this.authListeners = [];
    }
    
    // 인증 상태 리스너 추가
    addAuthListener(callback) {
        this.authListeners.push(callback);
    }
    
    // 인증 상태 변경 알림
    notifyAuthChange() {
        this.authListeners.forEach(callback => callback(this.user, this.session));
    }
    
    // 현재 사용자 정보 가져오기
    getCurrentUser() {
        return this.user;
    }
    
    // 로그인 상태 확인
    isAuthenticated() {
        return this.user !== null;
    }
    
    // 사용자 정보 업데이트
    updateUser(user, session) {
        this.user = user;
        this.session = session;
        this.notifyAuthChange();
    }
}

// 전역 인증 매니저 인스턴스
const authManager = new AuthManager();

// 인증 함수들
const authFunctions = {
    // 회원가입
    async signUp(email, password, userData = {}) {
        if (!supabase) {
            throw new Error('Supabase가 초기화되지 않았습니다.');
        }
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData // 추가 사용자 정보 (이름, 전화번호 등)
                }
            });
            
            if (error) throw error;
            
            console.log('✅ 회원가입 성공:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ 회원가입 실패:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 로그인
    async signIn(email, password) {
        if (!supabase) {
            throw new Error('Supabase가 초기화되지 않았습니다.');
        }
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            authManager.updateUser(data.user, data.session);
            console.log('✅ 로그인 성공:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ 로그인 실패:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Google 로그인
    async signInWithGoogle() {
        if (!supabase) {
            const errorMsg = 'Supabase가 초기화되지 않았습니다.';
            console.error('❌', errorMsg);
            return { success: false, error: errorMsg };
        }
        
        try {
            console.log('🔄 Google OAuth 시작...');
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });
            
            if (error) {
                console.error('❌ Google OAuth 에러:', error);
                throw error;
            }
            
            console.log('✅ Google OAuth 리다이렉트 시작:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ Google 로그인 실패:', error);
            
            // 에러 메시지 상세화
            let errorMessage = error.message;
            if (error.message.includes('fetch')) {
                errorMessage = '네트워크 연결을 확인해주세요.';
            } else if (error.message.includes('OAuth')) {
                errorMessage = 'Google 로그인 설정에 문제가 있습니다. 관리자에게 문의하세요.';
            }
            
            return { success: false, error: errorMessage };
        }
    },
    
    // 로그아웃
    async signOut() {
        if (!supabase) {
            throw new Error('Supabase가 초기화되지 않았습니다.');
        }
        
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            
            authManager.updateUser(null, null);
            console.log('✅ 로그아웃 성공');
            return { success: true };
            
        } catch (error) {
            console.error('❌ 로그아웃 실패:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 비밀번호 재설정
    async resetPassword(email) {
        if (!supabase) {
            throw new Error('Supabase가 초기화되지 않았습니다.');
        }
        
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });
            
            if (error) throw error;
            
            console.log('✅ 비밀번호 재설정 이메일 전송:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ 비밀번호 재설정 실패:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 세션 복원
    async restoreSession() {
        if (!supabase) {
            throw new Error('Supabase가 초기화되지 않았습니다.');
        }
        
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            if (session) {
                authManager.updateUser(session.user, session);
                console.log('✅ 세션 복원 성공:', session);
            }
            
            return { success: true, session };
            
        } catch (error) {
            console.error('❌ 세션 복원 실패:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 현재 세션 가져오기 (restoreSession의 별칭)
    async getSession() {
        return await this.restoreSession();
    }
};

// 인증 상태 변경 리스너 설정
function setupAuthListener() {
    if (!supabase) return;
    
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 인증 상태 변경:', event, session);
        
        if (session) {
            authManager.updateUser(session.user, session);
        } else {
            authManager.updateUser(null, null);
        }
        
        // UI 업데이트
        updateAuthUI();
    });
}

// UI 업데이트 함수
function updateAuthUI() {
    const isLoggedIn = authManager.isAuthenticated();
    const user = authManager.getCurrentUser();
    
    // 헤더 버튼 업데이트
    const authButtons = document.querySelector('.auth-buttons');
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (isLoggedIn && user) {
        // 로그인 상태: 사용자 메뉴 표시
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">안녕하세요, ${user.user_metadata?.name || user.email}님</span>
                    <button class="btn-logout" onclick="handleLogout()">로그아웃</button>
                </div>
            `;
        }
    } else {
        // 로그아웃 상태: 기본 버튼들 표시
        if (authButtons) {
            authButtons.innerHTML = `
                <button class="btn-login">로그인</button>
                <button class="btn-signup">회원가입</button>
            `;
            
            // 이벤트 리스너 재등록
            const newLoginBtn = authButtons.querySelector('.btn-login');
            const newSignupBtn = authButtons.querySelector('.btn-signup');
            
            if (newLoginBtn) newLoginBtn.addEventListener('click', () => openModal('loginModal'));
            if (newSignupBtn) newSignupBtn.addEventListener('click', () => openModal('signupModal'));
        }
    }
}

// 로그아웃 핸들러
async function handleLogout() {
    const result = await authFunctions.signOut();
    if (result.success) {
        alert('로그아웃되었습니다.');
        // 메인 페이지로 리다이렉트 (필요시)
        // window.location.href = '/';
    } else {
        alert('로그아웃 중 오류가 발생했습니다.');
    }
}

// 초기화 및 내보내기
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 인증 시스템 초기화 시작');
    
    // Supabase 라이브러리 로드 대기 (최대 20초)
    let attempts = 0;
    const maxAttempts = 200; // 20초 (100ms * 200)
    
    const waitForSupabase = () => {
        return new Promise((resolve) => {
            const checkSupabase = () => {
                attempts++;
                console.log(`🔍 Supabase 로드 확인 중... (${attempts}/${maxAttempts})`);
                
                let hasSupabase = false;
                let detectionMethod = '';
                
                try {
                    // 방법 1: window.supabase 확인
                    if (window.supabase && typeof window.supabase.createClient === 'function') {
                        hasSupabase = true;
                        detectionMethod = 'window.supabase';
                    }
                    
                    // 방법 2: window.createClient 확인
                    if (!hasSupabase && typeof window.createClient === 'function') {
                        hasSupabase = true;
                        detectionMethod = 'window.createClient';
                    }
                    
                    // 방법 3: script 태그 로드 상태 확인
                    if (!hasSupabase) {
                        const scripts = document.querySelectorAll('script[src*="supabase"]');
                        console.log(`📜 Supabase 스크립트 태그 ${scripts.length}개 발견`);
                        
                        for (let script of scripts) {
                            console.log(`📜 스크립트 상태: ${script.src} - readyState: ${script.readyState || 'undefined'}`);
                            
                            // 스크립트가 로드 완료되었고, 전역 객체가 있는지 확인
                            if ((script.readyState === undefined || script.readyState === 'complete') && 
                                (window.supabase || window.createClient)) {
                                hasSupabase = true;
                                detectionMethod = 'script 태그 로드 확인';
                                break;
                            }
                        }
                    }
                    
                    // 방법 4: 직접 접근 시도
                    if (!hasSupabase) {
                        try {
                            if (window.Supabase || window.SUPABASE) {
                                hasSupabase = true;
                                detectionMethod = 'window.Supabase 또는 window.SUPABASE';
                            }
                        } catch (e) {
                            // 무시
                        }
                    }
                    
                } catch (error) {
                    console.log('⚠️ Supabase 확인 중 오류:', error);
                }
                
                if (hasSupabase) {
                    console.log(`✅ Supabase 라이브러리 로드 완료! (감지 방법: ${detectionMethod})`);
                    console.log(`🔗 현재 사용 가능한 Supabase 객체:`, {
                        'window.supabase': typeof window.supabase,
                        'window.createClient': typeof window.createClient,
                        'window.Supabase': typeof window.Supabase
                    });
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    console.error('❌ Supabase 라이브러리 로드 실패 (20초 타임아웃)');
                    console.log('🔍 디버그 정보:');
                    console.log('- window.supabase:', typeof window.supabase);
                    console.log('- window.createClient:', typeof window.createClient);
                    console.log('- window.Supabase:', typeof window.Supabase);
                    console.log('- 스크립트 태그 수:', document.querySelectorAll('script[src*="supabase"]').length);
                    console.log('💡 해결방법: 네트워크 연결을 확인하고 페이지를 새로고침 해주세요.');
                    resolve(false);
                } else {
                    setTimeout(checkSupabase, 100);
                }
            };
            checkSupabase();
        });
    };
    
    // Supabase 라이브러리 로드 대기
    const isSupabaseLoaded = await waitForSupabase();
    
    if (isSupabaseLoaded) {
        // Supabase 초기화
        const supabaseClient = initSupabase();
        
        if (supabaseClient) {
            // 인증 리스너 설정
            setupAuthListener();
            
            // 세션 복원
            try {
                await authFunctions.restoreSession();
            } catch (error) {
                console.log('💡 세션 없음 (정상):', error.message);
            }
            
            console.log('✅ 인증 시스템 초기화 완료');
        } else {
            console.warn('⚠️ Supabase 클라이언트 초기화 실패');
        }
    } else {
        console.warn('⚠️ Supabase 라이브러리 로드 실패 - 데모 모드로 실행');
    }
    
    // 전역으로 내보내기 (항상 실행)
    window.authFunctions = authFunctions;
    window.authManager = authManager;
    window.supabaseClient = supabase;
}); 