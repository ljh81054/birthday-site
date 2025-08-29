import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')


    // js/main.js — 公共脚本（星空、漂心、按钮、音乐）
    // 放在所有页面 <script src="js/main.js"></script> 后面加载

    (function () {
        // ====== 星空 ======
        const canvas = document.getElementById('stars');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let stars = [];
            let rafId = null;

            function buildStars() {
                const area = window.innerWidth * window.innerHeight;
                const count = Math.min(260, Math.max(80, Math.floor(area / 9000)));
                stars = Array.from({ length: count }).map(() => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.4 + 0.2,
                    a: Math.random() * 0.8 + 0.1,
                    tw: (Math.random() * 0.02 + 0.003) * (Math.random() < 0.5 ? -1 : 1)
                }));
            }

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                buildStars();
            }
            window.addEventListener('resize', () => {
                resizeCanvas();
            }, { passive: true });
            resizeCanvas();

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const s of stars) {
                    s.a += s.tw;
                    if (s.a < 0.08 || s.a > 0.95) s.tw *= -1;
                    ctx.globalAlpha = s.a;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                }
                rafId = requestAnimationFrame(draw);
            }
            if (!rafId) draw();
        }

        // ====== 漂浮爱心（点击） ======
        document.body.addEventListener('click', (e) => {
            const tag = (e.target || {}).tagName || '';
            if (tag.toLowerCase() === 'button' || (e.target && e.target.classList.contains && e.target.classList.contains('btn'))) {
                return; // 避免按钮触发心
            }
            const x = e.pageX, y = e.pageY;
            for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
                spawnHeart(x + (Math.random() * 24 - 12), y + (Math.random() * 18 - 9));
            }
        }, { passive: true });

        function spawnHeart(left, top) {
            const d = document.createElement('div');
            d.textContent = '❤';
            d.className = 'floating-heart';
            // inline style 保证在没有样式表时也能显示
            d.style.position = 'absolute';
            d.style.left = left + 'px';
            d.style.top = top + 'px';
            d.style.transform = 'translate(-50%, -50%)';
            d.style.pointerEvents = 'none';
            d.style.fontSize = (14 + Math.floor(Math.random() * 12)) + 'px';
            d.style.opacity = '1';
            document.body.appendChild(d);

            const anim = d.animate([
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: `translateY(-${120 + Math.random() * 90}px) scale(${1.1 + Math.random() * 0.8})`, opacity: 0 }
            ], {
                duration: 1400 + Math.random() * 900,
                easing: 'cubic-bezier(.22,.9,.35,1)'
            });
            anim.onfinish = () => d.remove();
        }

        // ====== 礼物按钮（共用行为） ======
        const giftBtn = document.getElementById('giftBtn');
        if (giftBtn) {
            giftBtn.addEventListener('click', () => {
                const card = document.getElementById('messageCard');
                if (card) {
                    card.classList.remove('hidden');
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                // 如果 fireworks 模块提供了 startFireworks，则触发一次（安全调用）
                if (window.startFireworks && typeof window.startFireworks === 'function') {
                    try { window.startFireworks(); } catch (err) { /* 忽略 */ }
                }
            });
        }

        // ====== 音乐按钮 ======
        const playBtn = document.getElementById('playMusic') || document.getElementById('play-music');
        if (playBtn) {
            const bgm = document.getElementById('bgm');
            playBtn.addEventListener('click', async () => {
                if (!bgm) return;
                try {
                    await bgm.play();
                } catch (err) {
                    // 浏览器策略可能阻止自动播放：简单提示用户
                    console.warn('音频无法播放（需要用户手动允许）：', err);
                }
            });
        }
    })();
