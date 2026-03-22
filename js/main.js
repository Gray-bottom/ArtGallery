// 全局变量（移除DOM引用）
let currentTab = "college";
let currentIndex = 0;
let sliderInterval = null;

// 图片路径
function getImgSrc(item) {
    return item.src + ".jpg";
}

// 缺失图片占位（纯干净 HTML，无引号冲突）
const placeholderHTML = `
<div class="img-placeholder">
    <div>👽</div>
    <div>Image Not Found</div>
    <div>Resource Missing</div>
</div>`;

// 1. 主题切换
let starsCreated = false;

// 在全局变量部分添加
let navigationInitialized = false;

// 初始化导航栏增强功能
function initNavigationEnhancements() {
    if (navigationInitialized) return;

    // 添加按钮点击波纹效果到所有导航按钮
    document.querySelectorAll('nav button, nav a, .tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // 创建波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;

            // 添加动画关键帧
            if (!document.getElementById('ripple-animation')) {
                const styleSheet = document.createElement("style");
                styleSheet.id = 'ripple-animation';
                styleSheet.type = "text/css";
                styleSheet.innerText = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(styleSheet);
            }

            this.appendChild(ripple);

            // 移除波纹元素
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // 添加键盘访问支持到所有导航按钮
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // 添加页面加载时的导航栏淡入效果
    if (document.querySelector('header')) {
        document.querySelector('header').style.opacity = '0';
        document.querySelector('header').style.transform = 'translateY(-20px)';

        setTimeout(() => {
            document.querySelector('header').style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            document.querySelector('header').style.opacity = '1';
            document.querySelector('header').style.transform = 'translateY(0)';
        }, 100);
    }

    navigationInitialized = true;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 重新定义DOM相关变量
    const slider = document.getElementById("slider");
    const grid = document.getElementById("artGrid");
    const themeBtn = document.getElementById("themeBtn");
    const enterGalleryBtn = document.getElementById("enterGalleryBtn");
    const centerEnterBtn = document.getElementById("centerEnterBtn");
    const gallerySection = document.getElementById("gallerySection");
    const immersiveContainer = document.getElementById("immersiveContainer");

    // 修改主题切换事件监听器以包含导航栏优化
    themeBtn?.addEventListener("click", () => {
        // 添加主题切换动画类
        document.body.classList.add('theme-transition');

        // 触发重排以确保动画开始
        void document.body.offsetWidth;

        // 切换主题
        document.body.classList.toggle("dark");

        // 创建星星效果（如果尚未创建）
        if (!starsCreated && document.body.classList.contains("dark")) {
            createStars();
            starsCreated = true;
        }

        // 更新主题按钮文本
        updateThemeButtonText();

        // 移除动画类
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 1000);

        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    // 创建星空效果
    function createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;

        // 清除现有星星
        starsContainer.innerHTML = '';

        // 创建100颗随机分布的星星
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            // 随机位置
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            // 随机大小 (1-3px)
            const size = Math.random() * 2 + 1;

            // 随机动画延迟和持续时间
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animation = `twinkle ${duration}s infinite ${delay}s ease-in-out`;
            star.style.opacity = Math.random() * 0.8 + 0.2;

            starsContainer.appendChild(star);
        }
    }

    // 添加闪烁动画
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
@keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
}`;
    document.head.appendChild(styleSheet);

    // 页面加载时检查主题设置并初始化
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        // 延迟创建星星，确保DOM已准备就绪
        setTimeout(() => {
            createStars();
            starsCreated = true;
        }, 100);
    }

    const themeBtn2 = document.getElementById("themeBtn2");
    themeBtn2?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    // 2. 进入作品展厅
    function enterGallery() {
        if (immersiveContainer) {
            immersiveContainer.style.display = 'none';
        }
        if (gallerySection) {
            gallerySection.style.display = 'block';
            // 滚动到画廊区域
            gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
        // 渲染作品列表和轮播图
        renderGrid();
        renderSlider();
    }

    enterGalleryBtn?.addEventListener("click", enterGallery);
    centerEnterBtn?.addEventListener("click", enterGallery);

    // 工具函数：数组随机打乱
    function shuffleArray(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }

    // 3. 【修复】按加载速度排序 + 仅真正加载失败才显示占位
    function renderGrid() {
        if (!grid) return;

        grid.innerHTML = "Loading...";
        const list = artWorks.filter(item => item.type === currentTab);

        // 分批加载，避免一次性加载所有图片影响性能
        const batchSize = 5;
        let loadedCount = 0;

        function loadBatch(startIndex) {
            const endIndex = Math.min(startIndex + batchSize, list.length);
            const batch = list.slice(startIndex, endIndex);

            const itemLoadData = [];
            let finished = 0;

            batch.forEach(item => {
                const img = new Image();
                const startTime = performance.now();
                img.src = getImgSrc(item);

                img.onload = () => {
                    finished++;
                    itemLoadData.push({ item, time: performance.now() - startTime, ok: true });
                    checkBatchComplete();
                };
                img.onerror = () => {
                    finished++;
                    itemLoadData.push({ item, time: performance.now() - startTime, ok: false });
                    checkBatchComplete();
                };
            });

            function checkBatchComplete() {
                if (finished === batch.length) {
                    loadedCount += batch.length;
                    // 排序并渲染当前批次的数据
                    itemLoadData.sort((a, b) => a.time - b.time);

                    itemLoadData.forEach(data => {
                        const item = data.item;
                        const card = document.createElement("div");
                        card.className = "art-card";

                        if (data.ok) {
                            card.innerHTML = `
                                <img src="${getImgSrc(item)}" alt="${item.name}" loading="lazy">
                                <p>${item.name}</p>
                            `;
                            card.onclick = () => location.href = `detail.html?id=${item.id}`;
                        } else {
                            card.innerHTML = placeholderHTML + `<p>${item.name}</p>`;
                            card.style.cursor = "not-allowed";
                        }
                        grid.appendChild(card);
                    });

                    // 继续加载下一批
                    if (loadedCount < list.length) {
                        setTimeout(() => loadBatch(loadedCount), 100); // 小延迟，让UI有机会更新
                    }
                }
            }
        }

        // 开始第一批加载
        loadBatch(0);
    }

    // 4. 【修复】轮播：随机 5 张横版图 + 16:9 + 仅失效图占位
    async function renderSlider() {
        if (!slider) return;

        clearInterval(sliderInterval);
        const fullList = artWorks.filter(item => item.type === currentTab);
        const horizontalImages = await filterHorizontalImages(fullList);
        const randomSliderList = shuffleArray(horizontalImages).slice(0, 5);

        if (randomSliderList.length === 0) {
            slider.innerHTML = "<div style='display:flex;align-items:center;justify-content:center;height:100%;'>No images</div>";
            return;
        }

        slider.innerHTML = randomSliderList.map(item =>
            `<img src="${getImgSrc(item)}" alt="${item.name}">`
        ).join("");

        currentIndex = 0;
        sliderInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % randomSliderList.length;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 5000);
    }

    // 筛选横屏图
    function filterHorizontalImages(list) {
        return new Promise(resolve => {
            const result = [];
            let count = 0;
            if (list.length === 0) return resolve([]);

            list.forEach(item => {
                const img = new Image();
                img.src = getImgSrc(item);
                img.onload = () => {
                    count++;
                    if (img.width / img.height > 1) result.push(item);
                    if (count === list.length) resolve(result);
                };
                img.onerror = () => {
                    count++;
                    if (count === list.length) resolve(result);
                };
            });
        });
    }

    // 5. 轮播上下张
    window.nextSlide = function () {
        const imgs = slider.querySelectorAll("img");
        if (!imgs.length) return;
        currentIndex = (currentIndex + 1) % imgs.length;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    window.prevSlide = function () {
        const imgs = slider.querySelectorAll("img");
        if (!imgs.length) return;
        currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // 6. 分类切换
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTab = btn.dataset.tab;
            renderGrid();
            renderSlider();
        });
    });

    // 7. 详情页
    if (location.pathname.includes("detail")) {
        const params = new URLSearchParams(location.search);
        const id = parseInt(params.get("id"));
        let current = artWorks.find(item => item.id === id);
        let idx = artWorks.indexOf(current);

        const img = document.getElementById("detailImg");
        const info = document.getElementById("artInfo");

        function loadDetail() {
            // 确保索引在有效范围内
            if (idx < 0 || idx >= artWorks.length) {
                // 找到第一个有效作品
                for (let i = 0; i < artWorks.length; i++) {
                    if (artWorks[i]) {
                        idx = i;
                        break;
                    }
                }
            }

            current = artWorks[idx];
            if (!current) {
                // 如果当前没有有效作品，尝试找到下一个有效作品
                for (let i = 0; i < artWorks.length; i++) {
                    if (artWorks[i]) {
                        idx = i;
                        current = artWorks[i];
                        break;
                    }
                }
            }

            img.src = getImgSrc(current);
            img.style.display = "inline-block";
            img.style.transform = "scale(1)";
            img.style.left = "0";
            img.style.top = "0";

            // ✅ 修复：详情页仅图片真正加载失败才显示占位
            img.onload = null;
            img.onerror = () => {
                img.outerHTML = placeholderHTML;
            };

            info.innerHTML = `
                <h2>${current.name}</h2>
                <p>Creation Time：${current.time}</p>
                <p>Size：${current.size}</p>
                <p>Description：${current.desc}</p>
            `;
        }
        loadDetail();

        // 修复上一张按钮逻辑 - 使用更健壮的算法
        document.getElementById("prevBtn").onclick = () => {
            // 保存原始索引用于循环检测
            const originalIdx = idx;

            // 循环查找前一个有效作品
            do {
                idx = (idx - 1 + artWorks.length) % artWorks.length;

                // 安全检查：确保不陷入无限循环
                if (idx === originalIdx) {
                    break; // 已经遍历了所有作品
                }

                // 检查当前索引的作品是否存在且有效
                if (artWorks[idx] && artWorks[idx].id) {
                    loadDetail();
                    return;
                }
            } while (idx !== originalIdx);

            // 如果没有找到其他有效作品，保持当前位置
            loadDetail();
        }

        // 修复下一张按钮逻辑 - 使用更健壮的算法
        document.getElementById("nextBtn").onclick = () => {
            // 保存原始索引用于循环检测
            const originalIdx = idx;

            // 循环查找后一个有效作品
            do {
                idx = (idx + 1) % artWorks.length;

                // 安全检查：确保不陷入无限循环
                if (idx === originalIdx) {
                    break; // 已经遍历了所有作品
                }

                // 检查当前索引的作品是否存在且有效
                if (artWorks[idx] && artWorks[idx].id) {
                    loadDetail();
                    return;
                }
            } while (idx !== originalIdx);

            // 如果没有找到其他有效作品，保持当前位置
            loadDetail();
        }

        // 缩放
        let scale = 1;
        img.addEventListener("wheel", (e) => {
            e.preventDefault();
            scale += e.deltaY > 0 ? -0.1 : 0.1;
            scale = Math.max(0.5, Math.min(2, scale));
            img.style.transform = `scale(${scale})`;
        });

        // 拖拽
        let isDrag = false, x = 0, y = 0;
        img.addEventListener("mousedown", (e) => {
            isDrag = true;
            x = e.clientX;
            y = e.clientY;
        });
        window.addEventListener("mousemove", (e) => {
            if (!isDrag) return;
            img.style.position = "relative";
            img.style.left = (e.clientX - x) + "px";
            img.style.top = (e.clientY - y) + "px";
        });
        window.addEventListener("mouseup", () => isDrag = false);

        // 全屏
        document.getElementById("fullscreen").onclick = () => {
            if (img.requestFullscreen) img.requestFullscreen();
        };

        // 下载
        document.getElementById("downloadBtn").onclick = () => {
            if (!img.src.includes(".jpg")) return alert("No image available");
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.src = img.src;
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                ctx.font = "30px Arial";
                ctx.fillStyle = "rgba(128,128,128,0.6)";
                ctx.fillText("Asuka", canvas.width - 180, canvas.height - 30);
                const a = document.createElement("a");
                a.download = current.name + ".jpg";
                a.href = canvas.toDataURL("image/jpeg");
                a.click();
            };
        };

        // 评论
        document.getElementById("submitComment").onclick = () => {
            const name = document.getElementById("username").value.trim();
            const content = document.getElementById("commentContent").value.trim();
            if (!name) return alert("Please enter nickname!");
            if (!content) return alert("Please enter comment!");
            const commentList = document.getElementById("commentList");
            const div = document.createElement("div");
            div.style.padding = "12px 10px";
            div.style.borderBottom = "1px solid #ddd";
            div.innerHTML = `<strong>${name}</strong>：${content}`;
            commentList.appendChild(div);
            document.getElementById("commentContent").value = "";
        };
    }

    // 初始化 - 只在 gallery.html 页面渲染轮播和网格
    if (slider && grid) {
        renderGrid();
        renderSlider();
    }

    // 更新主题按钮文本
    function updateThemeButtonText() {
        const themeBtns = document.querySelectorAll('#themeBtn, #themeBtn2');
        themeBtns.forEach(btn => {
            if (btn) {
                btn.innerHTML = document.body.classList.contains("dark") ?
                    '<i>🌙</i> 日间模式' :
                    '<i>☀️</i> 夜间模式';
            }
        });
    }

    // 更新主题按钮文本
    updateThemeButtonText();
});
