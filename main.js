// AI科技感網站主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== 導航欄功能 ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 導航欄滾動效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移動端導航切換
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 導航鏈接點擊
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // 關閉移動端菜單
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // ==================== 粒子動畫背景 ====================
    class ParticleSystem {
        constructor(container) {
            this.container = container;
            this.particles = [];
            this.particleCount = 80;
            this.init();
        }
        
        init() {
            this.createParticles();
            this.animate();
        }
        
        createParticles() {
            for (let i = 0; i < this.particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 1}px;
                    height: ${Math.random() * 4 + 1}px;
                    background: ${this.getRandomColor()};
                    border-radius: 50%;
                    pointer-events: none;
                    opacity: ${Math.random() * 0.8 + 0.2};
                    box-shadow: 0 0 ${Math.random() * 10 + 5}px currentColor;
                `;
                
                // 隨機初始位置
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = Math.random() * window.innerHeight + 'px';
                
                // 添加粒子運動數據
                particle.vx = (Math.random() - 0.5) * 2;
                particle.vy = (Math.random() - 0.5) * 2;
                particle.life = Math.random() * 300 + 200;
                particle.maxLife = particle.life;
                
                this.particles.push(particle);
                this.container.appendChild(particle);
            }
        }
        
        getRandomColor() {
            const colors = ['#00ffff', '#8a2be2', '#ff1493', '#00ff41', '#ff6b35'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        animate() {
            this.particles.forEach((particle, index) => {
                // 更新位置
                const currentX = parseFloat(particle.style.left);
                const currentY = parseFloat(particle.style.top);
                
                let newX = currentX + particle.vx;
                let newY = currentY + particle.vy;
                
                // 邊界碰撞檢測
                if (newX <= 0 || newX >= window.innerWidth) {
                    particle.vx *= -1;
                    newX = Math.max(0, Math.min(window.innerWidth, newX));
                }
                if (newY <= 0 || newY >= window.innerHeight) {
                    particle.vy *= -1;
                    newY = Math.max(0, Math.min(window.innerHeight, newY));
                }
                
                particle.style.left = newX + 'px';
                particle.style.top = newY + 'px';
                
                // 更新生命週期
                particle.life--;
                const lifeRatio = particle.life / particle.maxLife;
                particle.style.opacity = lifeRatio * 0.8;
                
                // 重生粒子
                if (particle.life <= 0) {
                    particle.style.left = Math.random() * window.innerWidth + 'px';
                    particle.style.top = Math.random() * window.innerHeight + 'px';
                    particle.life = particle.maxLife;
                    particle.vx = (Math.random() - 0.5) * 2;
                    particle.vy = (Math.random() - 0.5) * 2;
                }
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }
    
    // 初始化粒子系統
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        new ParticleSystem(particlesContainer);
    }
    
    // ==================== 打字效果 ====================
    const typingText = document.getElementById('typing-text');
    const texts = [
        '奇華智能行銷',
        'AI科技創新',
        '智慧製造專家',
        '電控玻璃整合',
        '國防科技合作'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 200;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    if (typingText) {
        setTimeout(typeWriter, 1000);
    }
    
    // ==================== 數字動畫 ====================
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        statNumbers.forEach(num => observer.observe(num));
    }
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }
    
    animateNumbers();
    
    // ==================== 滾動動畫 ====================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('section, .service-card, .news-card, .partner-card, .achievement-item, .feature-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }
    
    initScrollAnimations();
    
    // ==================== 表單功能 ====================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // 表單動畫效果
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                input.addEventListener('input', () => {
                    if (input.value) {
                        group.classList.add('has-value');
                    } else {
                        group.classList.remove('has-value');
                    }
                });
            }
        });
        
        // 表單提交
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 驗證表單資料
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('請填寫所有必填欄位！', 'error');
                return;
            }
            
            // 顯示提交動畫
            showNotification('正在開啟郵件客戶端...', 'info');
            
            // 準備郵件內容
            const subject = `【奇華智能行銷】${getSubjectText(data.subject)} - ${data.name}`;
            
            const body = `
親愛的奇華智能行銷團隊：

我對貴公司的服務很感興趣，希望能進一步了解相關資訊。

聯絡人資訊：
姓名：${data.name}
電子郵件：${data.email}
聯絡電話：${data.phone || '未提供'}

諮詢類型：${getSubjectText(data.subject)}

詳細需求：
${data.message}

期待您的回覆。

謝謝！

---
此訊息由奇華智能行銷官方網站聯絡表單自動產生
            `.trim();
            
            // 使用 mailto 開啟郵件客戶端
            setTimeout(() => {
                const mailtoUrl = `mailto:synta@kimo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoUrl;
                
                showNotification('郵件客戶端已開啟，請完成發送！', 'success');
                
                // 重置表單
                setTimeout(() => {
                    contactForm.reset();
                    formGroups.forEach(group => {
                        group.classList.remove('focused', 'has-value');
                    });
                }, 1000);
            }, 1000);
        });
    }
    
    // 取得諮詢類型文字
    function getSubjectText(value) {
        const subjects = {
            'ai': 'AI技術整合',
            'manufacturing': '智慧製造',
            'glass': '電控玻璃應用',
            'defense': '國防科技合作',
            'other': '其他合作'
        };
        return subjects[value] || value;
    }
    
    // ==================== 通知系統 ====================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">×</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff41' : type === 'error' ? '#ff1493' : '#00ffff'};
            color: #0a0a0f;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 動畫進入
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 關閉按鈕
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: inherit;
            margin-left: 0.5rem;
        `;
        
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // 自動關閉
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
    }
    
    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // ==================== 鼠標互動效果 ====================
    function initMouseEffects() {
        const interactiveElements = document.querySelectorAll('.service-card, .news-card, .partner-card, .btn, .nav-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                createMouseEffect(e.clientX, e.clientY);
            });
        });
        
        // 鼠標跟隨效果
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // 創建自定義光標
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);
        
        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX - 10 + 'px';
            cursor.style.top = cursorY - 10 + 'px';
            
            requestAnimationFrame(updateCursor);
        }
        updateCursor();
    }
    
    function createMouseEffect(x, y) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border: 2px solid #00ffff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            animation: ripple 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 800);
    }
    
    // 添加波紋動畫CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    initMouseEffects();
    
    // ==================== 3D 傾斜效果 ====================
    function init3DTilt() {
        const tiltElements = document.querySelectorAll('.service-card, .news-card, .partner-card');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', function(e) {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * 10;
                const rotateY = (centerX - x) / centerX * 10;
                
                element.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateY(-10px)
                `;
            });
            
            element.addEventListener('mouseleave', function() {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
    
    init3DTilt();
    
    // ==================== 主題色彩切換效果 ====================
    function initColorEffects() {
        const colorElements = document.querySelectorAll('.section-title, .glow-text, h3');
        
        setInterval(() => {
            colorElements.forEach(element => {
                if (Math.random() > 0.95) { // 5% 機率觸發
                    const originalColor = element.style.color;
                    element.style.color = '#ff1493'; // 短暫變成粉紅色
                    
                    setTimeout(() => {
                        element.style.color = originalColor;
                    }, 200);
                }
            });
        }, 1000);
    }
    
    initColorEffects();
    
    // ==================== 響應式處理 ====================
    function handleResize() {
        // 重新計算粒子位置
        if (window.innerWidth <= 768) {
            // 移動端優化
            document.querySelectorAll('.particle').forEach(particle => {
                particle.style.display = Math.random() > 0.5 ? 'block' : 'none';
            });
        } else {
            // 桌面端顯示所有粒子
            document.querySelectorAll('.particle').forEach(particle => {
                particle.style.display = 'block';
            });
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始調用
    
    // ==================== 性能優化 ====================
    // 節流函數
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // 防抖函數
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
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
    
    // 優化滾動事件
    const optimizedScrollHandler = throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 16);
    
    window.removeEventListener('scroll', function() {}); // 移除之前的監聽器
    window.addEventListener('scroll', optimizedScrollHandler);
    
    // ==================== 法律條款功能 ====================
    function initLegalFunctionality() {
        // 隱私政策連結
        const privacyLink = document.querySelector('a[href="#privacy"]');
        const termsLink = document.querySelector('a[href="#terms"]');
        
        // 法律條款區域
        const privacySection = document.getElementById('privacy');
        const termsSection = document.getElementById('terms');
        
        // 關閉按鈕
        const closeBtns = document.querySelectorAll('.legal-close');
        
        // 顯示隱私政策
        if (privacyLink && privacySection) {
            privacyLink.addEventListener('click', function(e) {
                e.preventDefault();
                showLegalSection('privacy');
            });
        }
        
        // 顯示服務條款
        if (termsLink && termsSection) {
            termsLink.addEventListener('click', function(e) {
                e.preventDefault();
                showLegalSection('terms');
            });
        }
        
        // 關閉法律條款頁面
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeLegalSections();
            });
        });
        
        // 點擊背景關閉
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('legal-section')) {
                closeLegalSections();
            }
        });
        
        // ESC鍵關閉
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLegalSections();
            }
        });
    }
    
    function showLegalSection(type) {
        // 隱藏所有法律條款
        closeLegalSections();
        
        // 顯示指定的條款
        const targetSection = document.getElementById(type);
        if (targetSection) {
            targetSection.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滾動
            
            // 平滑動畫
            setTimeout(() => {
                targetSection.style.opacity = '1';
            }, 10);
        }
    }
    
    function closeLegalSections() {
        const legalSections = document.querySelectorAll('.legal-section');
        legalSections.forEach(section => {
            section.style.display = 'none';
            section.style.opacity = '0';
        });
        document.body.style.overflow = ''; // 恢復滾動
    }
    
    // 初始化法律條款功能
    initLegalFunctionality();
    
    // ==================== 社群媒體追蹤功能 ====================
    // 社群媒體點擊追蹤函數（全域函數，供HTML onclick使用）
    window.trackSocialClick = function(platform, account) {
        // Google Analytics 事件追蹤
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                'event_category': 'Social Media',
                'event_label': platform + ' - ' + account,
                'transport_type': 'beacon'
            });
        }
        
        // 控制台記錄（開發用）
        console.log(`Social media click tracked: ${platform} - ${account}`);
        
        // 可選：顯示追蹤通知
        showNotification(`已開啟 ${platform} 社群頁面`, 'info');
        
        return true; // 允許正常連結跳轉
    };
    
    // ==================== 載入完成效果 ====================
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        // 添加載入完成的特效
        setTimeout(() => {
            showNotification('歡迎來到奇華智能行銷！', 'success');
        }, 1000);
    });
    
    // 預載入樣式
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    console.log('🚀 奇華智能行銷 AI科技感網站載入完成！');
});