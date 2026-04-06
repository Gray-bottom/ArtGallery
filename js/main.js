// ==================== 全局变量定义 ====================
// 当前选中的作品分类（college/middle）
let currentTab = "college";
// 轮播图当前索引
let currentIndex = 0;
// 轮播图自动播放定时器
let sliderInterval = null;
// 获取 DOM 元素
const slider = document.getElementById("slider");
const grid = document.getElementById("artGrid");
const themeBtn = document.getElementById("themeBtn");
const enterGalleryBtn = document.getElementById("enterGalleryBtn");
const centerEnterBtn = document.getElementById("centerEnterBtn");
const gallerySection = document.getElementById("gallerySection");
const immersiveContainer = document.getElementById("immersiveContainer");

/**
 * 获取图片完整路径
 * @param {Object} item - 作品对象
 * @returns {string} 图片路径（自动添加.jpg 后缀）
 */
function getImgSrc(item) {
    return item.src + ".jpg";
}

/**
 * 缺失图片的占位符 HTML（使用模板字符串避免引号冲突）
 * 显示外星人表情和提示信息
 */
const placeholderHTML = `
<div class="img-placeholder">
    <div>👽</div>
    <div>Image Not Found</div>
    <div>Resource Missing</div>
</div>`;

/**
 * 创建粒子背景效果（首页专属）
 * 生成 30 个随机大小、位置和动画时长的粒子
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // 清空容器内现有粒子
    particlesContainer.innerHTML = '';
    
    // 循环创建 30 个粒子
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // 随机生成粒子大小（2-6px）
        const size = Math.random() * 4 + 2;
        
        // 随机设置水平位置（0-100%）
        const left = Math.random() * 100;
        
        // 随机设置动画持续时间和延迟
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        // 应用样式和动画
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.bottom = '-10px';
        particle.style.animation = `float ${duration}s infinite ${delay}s ease-in-out`;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * 创建浮动装饰气泡（所有页面）
 * 生成 8 个随机分布的渐变气泡，增加页面动感
 */
function createFloatingBubbles() {
    const container = document.getElementById('floatingBubbles');
    if (!container) return;
    
    // 清空现有气泡
    container.innerHTML = '';
    
    // 循环创建 8 个装饰气泡
    for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('floating-bubble');
        
        // 随机生成气泡大小（50-150px）
        const size = Math.random() * 100 + 50;
        
        // 随机设置位置
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // 随机设置动画延迟（0-5s）
        const delay = Math.random() * 5;
        
        // 应用样式和浮动动画
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.top = `${top}%`;
        bubble.style.animationDelay = `${delay}s`;
        
        container.appendChild(bubble);
    }
}

// 鼠标拖尾效果
function initCursorTrail() {
    let trails = [];
    const maxTrails = 20;
    
    document.addEventListener('mousemove', (e) => {
        // 创建拖尾
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        trails.push(trail);
        
        // 缩小并移除
        setTimeout(() => {
            trail.style.transform = 'scale(0)';
            trail.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            trail.remove();
            trails.shift();
        }, 300);
        
        // 限制数量
        if (trails.length > maxTrails) {
            const oldTrail = trails.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.remove();
            }
        }
    });
}

// 1. 主题切换 - 增强版
let starsCreated = false;

// 在全局变量部分添加
let navigationInitialized = false;

// 初始化导航栏增强功能
function initNavigationEnhancements() {
    if (navigationInitialized) return;

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

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

        // 为所有导航按钮添加键盘访问支持（Enter 键和空格键）
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // 设置页面加载时导航栏的淡入动画效果
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

// ==================== 主题切换功能实现 ====================
// 主题按钮点击事件监听器
themeBtn?.addEventListener("click", () => {
    // 添加主题切换过渡动画类
    document.body.classList.add('theme-transition');

    // 触发浏览器重排，确保动画能够开始执行
    void document.body.offsetWidth;

    // 切换暗色/亮色主题
    document.body.classList.toggle("dark");

    // 如果是切换到夜间模式且星星未创建，则创建星空背景
    if (!starsCreated && document.body.classList.contains("dark")) {
        createStars();
        starsCreated = true;
    }

    // 更新主题按钮上的文字提示
    updateThemeButtonText();

    // 1 秒后移除过渡动画类
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 1000);

    // 将用户主题偏好保存到本地存储
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

/**
 * 创建夜空星星背景效果（仅在夜间模式显示）
 * 生成 100 颗随机分布、闪烁的星星
 */
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    // 清空容器内现有星星
    starsContainer.innerHTML = '';

    // 循环创建 100 颗星星
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // 随机生成星星位置（0-100%）
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // 随机生成星星大小（1-3px）
        const size = Math.random() * 2 + 1;

        // 随机设置闪烁动画的持续时间和延迟
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        // 应用样式和闪烁动画
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animation = `twinkle ${duration}s infinite ${delay}s ease-in-out`;
        star.style.opacity = Math.random() * 0.8 + 0.2;

        starsContainer.appendChild(star);
    }
}

// 定义星星闪烁动画关键帧（0%和 100%为最暗，50%为最亮）
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }  /* 最暗状态 */
    50% { opacity: 1; transform: scale(1.2); }      /* 最亮状态 */
}`;
document.head.appendChild(styleSheet);

// 页面加载时检查用户的主题偏好设置
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    // 延迟 100ms 创建星星，确保 DOM 已经完全加载
    setTimeout(() => {
        createStars();
        starsCreated = true;
    }, 100);
}

// 第二个主题按钮（画廊区域）的事件监听
const themeBtn2 = document.getElementById("themeBtn2");
themeBtn2?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// ==================== 进入作品展厅功能 ====================
/**
 * 从首页沉浸式展示区进入作品画廊
 * 隐藏沉浸式容器，显示画廊区域，并渲染作品
 */
function enterGallery() {
    // 隐藏首页沉浸式展示容器
    if (immersiveContainer) {
        immersiveContainer.style.display = 'none';
    }
    // 显示画廊区域
    if (gallerySection) {
        gallerySection.style.display = 'block';
        // 平滑滚动到画廊区域
        gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
    // 渲染作品列表和轮播图
    renderGrid();
    renderSlider();
}

// 绑定进入画廊按钮的点击事件
enterGalleryBtn?.addEventListener("click", enterGallery);
centerEnterBtn?.addEventListener("click", enterGallery);

/**
 * 工具函数：随机打乱数组顺序（Fisher-Yates 洗牌算法简化版）
 * @param {Array} arr - 待打乱的数组
 * @returns {Array} 打乱后的新数组
 */
function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * 渲染作品列表网格
 * 核心优化：
 * 1. 过滤掉标记为缺失的图片
 * 2. 记录每张图片的加载时间，按加载速度排序（快的先显示）
 * 3. 只在真正加载失败时显示占位符
 */
function renderGrid() {
    if (!grid) return;

    // 显示加载中提示
    grid.innerHTML = "Loading...";
    
    // 过滤掉标记为缺失的图片数据
    const list = artWorks.filter(item => item.type === currentTab && !item._missing);

    // 用于记录每张图片的加载时间和状态
    const itemLoadData = [];
    let finished = 0; // 已加载完成的图片数量

    // 遍历所有图片，开始预加载
    list.forEach(item => {
        const img = new Image();
        const startTime = performance.now(); // 记录开始加载时间
        img.src = getImgSrc(item);

        // 加载成功回调
        img.onload = () => {
            finished++;
            itemLoadData.push({ item, time: performance.now() - startTime, ok: true });
            if (finished === list.length) renderSortedGrid();
        };
        
        // 加载失败回调
        img.onerror = () => {
            finished++;
            itemLoadData.push({ item, time: performance.now() - startTime, ok: false });
            if (finished === list.length) renderSortedGrid();
        };
    });

    /**
     * 按加载时间排序并渲染到页面
     * 加载快的图片会排在前面，提升用户体验
     */
    function renderSortedGrid() {
        // 按加载时间升序排序
        itemLoadData.sort((a, b) => a.time - b.time);
        grid.innerHTML = "";

        // 依次渲染每张图片
        itemLoadData.forEach(data => {
            const item = data.item;
            const card = document.createElement("div");
            card.className = "art-card";

            // 根据加载结果决定显示内容
            if (data.ok) {
                // 加载成功：正常显示图片和标题，绑定点击跳转到详情页
                card.innerHTML = `
                    <img src="${getImgSrc(item)}" alt="${item.name}">
                    <p>${item.name}</p>
                `;
                card.onclick = () => location.href = `detail.html?id=${item.id}`;
            } else {
                // 加载失败：显示占位符，禁用点击
                card.innerHTML = placeholderHTML + `<p>${item.name}</p>`;
                card.style.cursor = "not-allowed";
            }
            grid.appendChild(card);
        });
    }
}

/**
 * 渲染轮播图（异步函数）
 * 功能：
 * 1. 从当前分类中筛选横版图片（宽>高）
 * 2. 随机选择 5 张进行展示
 * 3. 支持自动播放（4 秒切换）
 * 4. 失效图片自动隐藏
 */
async function renderSlider() {
    if (!slider) return;

    // 清除之前的自动播放定时器
    clearInterval(sliderInterval);
    
    // 过滤掉标记为缺失的图片
    const fullList = artWorks.filter(item => item.type === currentTab && !item._missing);
    
    // 筛选出横版图片（等待异步完成）
    const horizontalImages = await filterHorizontalImages(fullList);
    
    // 随机打乱并取前 5 张
    const randomSliderList = shuffleArray(horizontalImages).slice(0, 5);

    // 如果没有可用图片，显示提示信息
    if (randomSliderList.length === 0) {
        slider.innerHTML = "<div style='display:flex;align-items:center;justify-content:center;height:100%;color:var(--text);'>No images available for this category</div>";
        return;
    }

    // 生成轮播图 HTML，添加 onerror 处理隐藏失效图片
    slider.innerHTML = randomSliderList.map(item =>
        `<img src="${getImgSrc(item)}" alt="${item.name}" onerror="this.style.display='none'">`
    ).join("");

    // 重置索引到第一张
    currentIndex = 0;
    
    // 确保显示第一张图片
    slider.style.transform = `translateX(-0%)`;
    
    // 启动自动播放（每 4 秒切换一次）
    sliderInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % randomSliderList.length;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 4000);
}

/**
 * 停止轮播图自动播放
 * 在用户手动切换时调用，避免冲突
 */
function stopAutoPlay() {
    if (sliderInterval) {
        clearInterval(sliderInterval);
        sliderInterval = null;
    }
}

/**
 * 重新开始自动播放
 * @param {number} totalImages - 图片总数，用于计算循环
 */
function startAutoPlay(totalImages) {
    stopAutoPlay();
    sliderInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalImages;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 4000);
}

/**
 * 筛选横版图片（宽度大于高度）
 * @param {Array} list - 作品数组
 * @returns {Promise<Array>} 横版图片数组（Promise）
 */
function filterHorizontalImages(list) {
    return new Promise(resolve => {
        const result = [];
        let count = 0;
        if (list.length === 0) return resolve([]);

        // 遍历所有图片，检测尺寸比例
        list.forEach(item => {
            const img = new Image();
            img.src = getImgSrc(item);
            img.onload = () => {
                count++;
                // 宽高比大于 1 则为横版
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

// ==================== 轮播图控制功能 ====================
/**
 * 下一张轮播图（暴露到全局作用域）
 * 点击“→”按钮时触发
 */
window.nextSlide = function () {
    const imgs = slider.querySelectorAll("img");
    if (!imgs.length) return;
    
    stopAutoPlay(); // 停止自动播放
    currentIndex = (currentIndex + 1) % imgs.length; // 计算下一张索引
    slider.style.transform = `translateX(-${currentIndex * 100}%)`; // 移动到对应位置
    startAutoPlay(imgs.length); // 重新开始自动播放
}

/**
 * 上一张轮播图（暴露到全局作用域）
 * 点击“←”按钮时触发
 */
window.prevSlide = function () {
    const imgs = slider.querySelectorAll("img");
    if (!imgs.length) return;
    
    stopAutoPlay(); // 停止自动播放
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length; // 计算上一张索引（支持循环）
    slider.style.transform = `translateX(-${currentIndex * 100}%)`; // 移动到对应位置
    startAutoPlay(imgs.length); // 重新开始自动播放
}

// ==================== 分类切换功能 ====================
// 为所有分类标签按钮绑定点击事件
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        // 移除所有按钮的激活状态
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        // 添加当前按钮激活状态
        btn.classList.add("active");
        // 更新当前分类（从 data-tab 属性获取）
        currentTab = btn.dataset.tab;
        // 重新渲染作品列表和轮播图
        renderGrid();
        renderSlider();
    });
});

// ==================== 作品详情页功能 ====================
// 判断当前是否在详情页
if (location.pathname.includes("detail")) {
    // 获取 URL 参数中的作品 ID
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get("id"));
    
    // 查找对应 ID 的作品
    let current = artWorks.find(item => item.id === id);
    let idx = artWorks.indexOf(current);

    // 容错处理：如果找到的作品标记为缺失，找到下一个有效作品
    if (!current || current._missing) {
        for (let i = 0; i < artWorks.length; i++) {
            if (artWorks[i] && !artWorks[i]._missing) {
                current = artWorks[i];
                idx = i;
                break;
            }
        }
    }

    // 获取 DOM 元素
    const img = document.getElementById("detailImg");
    const info = document.getElementById("artInfo");

    /**
     * 加载作品详情信息
     * 包括图片、名称、创作时间、尺寸和描述
     */
    function loadDetail() {
        // 确保索引在有效范围内
        if (idx < 0 || idx >= artWorks.length) {
            // 找到第一个有效作品
            for (let i = 0; i < artWorks.length; i++) {
                if (artWorks[i] && !artWorks[i]._missing) {
                    idx = i;
                    break;
                }
            }
        }

        current = artWorks[idx];
        if (!current) {
            // 如果当前没有有效作品，尝试找到下一个有效作品
            for (let i = 0; i < artWorks.length; i++) {
                if (artWorks[i] && !artWorks[i]._missing) {
                    idx = i;
                    current = artWorks[i];
                    break;
                }
            }
        }

        // 图片加载成功时的处理
        img.onload = () => {
            img.style.display = "inline-block";
            img.style.transform = "scale(1)";
            img.style.left = "0";
            img.style.top = "0";
        };
        
        // 图片加载失败时的处理（显示占位图）
        img.onerror = () => {
            img.style.display = "none";
            const placeholder = document.createElement('div');
            placeholder.className = 'img-placeholder';
            placeholder.innerHTML = `
                <div>👽</div>
                <div>Image Not Found</div>
                <div>Resource Missing</div>
            `;
            img.parentNode.insertBefore(placeholder, img.nextSibling);
        };
        
        // 开始加载图片
        img.src = getImgSrc(current);

        // 显示作品详细信息
        info.innerHTML = `
            <h2>${current.name}</h2>
            <p>Creation Time：${current.time}</p>
            <p>Size：${current.size}</p>
            <p>Description：${current.desc}</p>
        `;
    }
    loadDetail();

    /**
     * 上一张作品按钮
     * 使用健壮的循环查找算法，跳过缺失图片
     */
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

            // 检查当前索引的作品是否存在且有效（未标记为缺失）
            if (artWorks[idx] && !artWorks[idx]._missing) {
                // 移除之前可能添加的占位图
                const existingPlaceholder = document.querySelector('.img-placeholder');
                if (existingPlaceholder) existingPlaceholder.remove();
                img.style.display = "inline-block";
                loadDetail();
                return;
            }
        } while (idx !== originalIdx);

        // 如果没有找到其他有效作品，保持当前位置
        loadDetail();
    }

    /**
     * 下一张作品按钮
     * 使用健壮的循环查找算法，跳过缺失图片
     */
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

            // 检查当前索引的作品是否存在且有效（未标记为缺失）
            if (artWorks[idx] && !artWorks[idx]._missing) {
                // 移除之前可能添加的占位图
                const existingPlaceholder = document.querySelector('.img-placeholder');
                if (existingPlaceholder) existingPlaceholder.remove();
                img.style.display = "inline-block";
                loadDetail();
                return;
            }
        } while (idx !== originalIdx);

        // 如果没有找到其他有效作品，保持当前位置
        loadDetail();
    }

    // ==================== 图片交互功能 ====================
    // 图片缩放功能（鼠标滚轮控制）
    let scale = 1;
    img.addEventListener("wheel", (e) => {
        e.preventDefault();
        // 根据滚轮方向调整缩放比例
        scale += e.deltaY > 0 ? -0.1 : 0.1;
        // 限制缩放范围在 0.5-2 倍之间
        scale = Math.max(0.5, Math.min(2, scale));
        img.style.transform = `scale(${scale})`;
    });

    // 图片拖拽功能
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

    // ==================== 工具按钮功能 ====================
    // 全屏查看功能
    document.getElementById("fullscreen").onclick = () => {
        if (img.requestFullscreen) img.requestFullscreen();
    };

    // 下载功能（添加水印）
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
            // 添加文字水印
            ctx.font = "30px Arial";
            ctx.fillStyle = "rgba(128,128,128,0.6)";
            ctx.fillText("Asuka", canvas.width - 180, canvas.height - 30);
            // 触发下载
            const a = document.createElement("a");
            a.download = current.name + ".jpg";
            a.href = canvas.toDataURL("image/jpeg");
            a.click();
        };
    };

    // 评论功能
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

// ==================== 页面初始化逻辑 ====================
// 只在 gallery.html 页面渲染轮播和网格（避免在其他页面重复渲染）
if (slider && grid && !location.pathname.includes("detail") && !immersiveContainer) {
    renderGrid();
    renderSlider();
}

/**
 * 更新主题按钮的文字提示
 * 夜间模式显示“🌙 日间模式”，日间模式显示“☀️ 夜间模式”
 */
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

// ==================== 页面加载完成后的初始化 ====================
window.addEventListener('load', () => {
    // 初始化导航栏增强功能（滚动效果、波纹动画等）
    initNavigationEnhancements();
    
    // 创建粒子效果（首页专属）
    if (document.getElementById('particles')) {
        createParticles();
    }
    
    // 创建浮动气泡（所有页面）
    createFloatingBubbles();
    
    // 初始化鼠标拖尾（所有页面）
    initCursorTrail();

    // 更新主题按钮文字提示
    updateThemeButtonText();
});
