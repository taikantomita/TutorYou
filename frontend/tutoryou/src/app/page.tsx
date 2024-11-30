'use client';

import React from 'react';

export default function HomePage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <header style={{ marginBottom: '20px' }}>
                    <nav>
                        <div className="logo">
                            <h1 style={{ fontSize: '2.5rem', color: '#4f46e5' }}>TutorYou</h1>
                        </div>
                    </nav>
                </header>

                <main>
                    <section className="welcome" style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '2rem', color: '#4f46e5' }}>Welcome to TutorYou</h2>
                        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                            Connecting tutors and students for free academic assistance.
                        </p>
                    </section>

                    <section className="auth-options">
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                            <a href="/login" style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center' }}>
                                Login
                            </a>
                            <a href="/signup" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#ffffff', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center' }}>
                                Sign Up
                            </a>
                        </div>
                    </section>
                </main>

                <footer style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>&copy; 2024 TutorYou. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
