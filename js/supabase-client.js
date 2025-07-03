// Supabase 클라이언트 설정
// 실제 프로젝트에서는 환경변수로 관리해야 합니다

// ✅ 바로교육 새로운 Supabase 프로젝트 설정
const SUPABASE_URL = 'https://bjsstktiiniigdnsdwsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqc3N0a3RpaW5paWdkbnNkd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDI4MTEsImV4cCI6MjA2NzA3ODgxMX0.h3W1Q3L_yX8_HPOMmEluq2Qum_INJSCv9OKV4IZdYRs';

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
            console.warn('⚠️ Supabase 프로젝트가 설정되지 않음 - 데모 모드로 실행');
            console.log('💡 실제 운영을 위해서는:');
            console.log('1. https://supabase.com에서 새 프로젝트 생성');
            console.log('2. Project Settings > API에서 URL과 anon key 복사');
            console.log('3. js/supabase-client.js 파일의 SUPABASE_URL과 SUPABASE_ANON_KEY 값 교체');
            
            // 데모 모드용 mock 클라이언트 생성
            const mockSupabaseClient = {
                auth: {
                    signInWithOAuth: async () => {
                        console.log('🎭 데모 모드: Google OAuth 시뮬레이션');
                        // 실제 Google OAuth URL로 리다이렉트하는 대신 데모 처리
                        alert('🎭 데모 모드입니다!\n\n실제 Google 로그인을 위해서는:\n1. Supabase 프로젝트 생성\n2. js/supabase-client.js에서 URL과 Key 설정\n3. Google OAuth 활성화');
                        return { success: false, error: '데모 모드에서는 실제 OAuth를 사용할 수 없습니다.' };
                    },
                    signOut: async () => {
                        console.log('🎭 데모 모드: 로그아웃 시뮬레이션');
                        return { error: null };
                    },
                    getSession: async () => {
                        console.log('🎭 데모 모드: 세션 확인');
                        return { data: { session: null }, error: null };
                    },
                    onAuthStateChange: (callback) => {
                        console.log('🎭 데모 모드: 인증 상태 리스너 등록');
                        // 데모용 리스너는 실제로 동작하지 않음
                        return { data: { subscription: { unsubscribe: () => {} } } };
                    }
                }
            };
            
            console.log('✅ 데모 모드 클라이언트 생성 완료');
            return mockSupabaseClient;
        }
        
        // Supabase 클라이언트 초기화
        supabase = SupabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
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
    }
    
    getCurrentUser() { return this.user; }
    isAuthenticated() { return this.user !== null; }
    
    updateUser(user, session) {
        this.user = user;
        this.session = session;
    }
}

const authManager = new AuthManager();

// 인증 함수들
const authFunctions = {
    // 회원가입
    async signUp(email, password, userData = {}) {
        if (!supabase) throw new Error('Supabase가 초기화되지 않았습니다.');
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password, options: { data: userData }
            });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // 로그인
    async signIn(email, password) {
        if (!supabase) throw new Error('Supabase가 초기화되지 않았습니다.');
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            
            authManager.updateUser(data.user, data.session);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Google 로그인
    async signInWithGoogle() {
        if (!supabase) return { success: false, error: 'Supabase가 초기화되지 않았습니다.' };
        
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.href,
                    queryParams: { prompt: 'select_account' }
                }
            });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // 로그아웃
    async signOut() {
        if (!supabase) throw new Error('Supabase가 초기화되지 않았습니다.');
        
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            authManager.updateUser(null, null);
            return { success: true };
        } catch (error) {
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
        console.log('🔄 인증 상태:', event, session?.user?.email || '로그아웃');
        
        // 로그인 성공 처리
        if (event === 'SIGNED_IN' && session) {
            authManager.updateUser(session.user, session);
            
            if (typeof window.updateAuthUI === 'function') {
                window.updateAuthUI(session.user);
                window.closeModal?.('loginModal');
                window.closeModal?.('signupModal');
            }
            
            // Google OAuth 콜백 처리
            const url = new URL(window.location);
            const isOAuthCallback = url.searchParams.has('access_token') || url.hash.includes('access_token');
            
            if (isOAuthCallback && session.user.app_metadata?.provider === 'google') {
                const userName = session.user.user_metadata?.name || 
                               session.user.user_metadata?.full_name || 
                               session.user.email.split('@')[0];
                
                setTimeout(() => {
                    alert(`🎉 Google 로그인 성공!\n\n${userName}님, 바로교육에 오신 것을 환영합니다!`);
                }, 500);
            }
            
        } else if (event === 'SIGNED_OUT') {
            authManager.updateUser(null, null);
            if (typeof window.updateAuthUI === 'function') {
                window.updateAuthUI(null);
            }
            
        } else if (session) {
            // INITIAL_SESSION 처리
            authManager.updateUser(session.user, session);
            if (typeof window.updateAuthUI === 'function') {
                window.updateAuthUI(session.user);
            }
            
            // OAuth 콜백인지 확인 (INITIAL_SESSION이지만 실제로는 새 로그인)
            const url = new URL(window.location);
            const isOAuthCallback = url.searchParams.has('access_token') || url.hash.includes('access_token');
            
            if (isOAuthCallback && session.user.app_metadata?.provider === 'google') {
                if (typeof window.closeModal === 'function') {
                    window.closeModal('loginModal');
                    window.closeModal('signupModal');
                }
                
                const userName = session.user.user_metadata?.name || 
                               session.user.user_metadata?.full_name || 
                               session.user.email.split('@')[0];
                
                setTimeout(() => {
                    alert(`🎉 Google 로그인 성공!\n\n${userName}님, 바로교육에 오신 것을 환영합니다!`);
                }, 500);
            }
        } else {
            authManager.updateUser(null, null);
            if (typeof window.updateAuthUI === 'function') {
                window.updateAuthUI(null);
            }
        }
    });
}

// supabase-client.js에서는 UI 업데이트 함수를 제거하고 script.js의 함수 사용

// 초기화 및 내보내기
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 인증 시스템 초기화');
    
    // Supabase 라이브러리 확인
    const SupabaseLib = window.supabase || window.Supabase;
    
    if (!SupabaseLib) {
        console.error('❌ Supabase 라이브러리 로드 실패');
        return;
    }
    
    // Supabase 클라이언트 초기화
    try {
        supabase = SupabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
        
        setupAuthListener();
        
        // 기존 세션 복원
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            authManager.updateUser(session.user, session);
            
            // OAuth 콜백 URL 정리
            const url = new URL(window.location);
            if (url.searchParams.has('access_token') || url.hash.includes('access_token')) {
                url.searchParams.delete('access_token');
                url.searchParams.delete('refresh_token');
                url.searchParams.delete('expires_in');
                url.searchParams.delete('expires_at');
                url.searchParams.delete('token_type');
                url.searchParams.delete('type');
                if (url.hash.includes('access_token')) url.hash = '';
                
                window.history.replaceState({}, document.title, url.toString());
            }
        }
        
        console.log('✅ 인증 시스템 초기화 완료');
        
    } catch (error) {
        console.error('❌ Supabase 초기화 실패:', error);
    }
    
    // 전역으로 내보내기
    window.authFunctions = authFunctions;
    window.authManager = authManager;
}); 