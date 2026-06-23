import React from 'react';

function AuthView({
    view,
    setView,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authName,
    setAuthName,
    authError,
    setAuthError,
    handleLogin,
    handleRegister
}) {
    return (
        <div className="auth-container glass-panel animate-fade">
            <h2 className="auth-title">{view === 'login' ? 'Sign In' : 'Sign Up'}</h2>
            {authError && <div style={{ color: 'var(--danger)', fontWeight: 600 }}>{authError}</div>}
            <form onSubmit={view === 'login' ? handleLogin : handleRegister}>
                {view === 'register' && (
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input type="text" required className="form-input" value={authName} onChange={(e) => setAuthName(e.target.value)} />
                    </div>
                )}
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" required className="form-input" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" required className="form-input" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    {view === 'login' ? 'Login' : 'Create Account'}
                </button>
            </form>
            <div>
                {view === 'login' ? (
                    <p style={{ color: 'var(--text-muted)' }}>
                        New Customer? <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }} onClick={() => { setView('register'); setAuthError(''); }}>Sign Up</a>
                    </p>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>
                        Already have an account? <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }} onClick={() => { setView('login'); setAuthError(''); }}>Sign In</a>
                    </p>
                )}
            </div>
        </div>
    );
}

export default AuthView;
