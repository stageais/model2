document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const modelId = params.get('id');

    if (!modelId) {
        window.location.href = 'index.html';
        return;
    }

    const gallery = document.getElementById('masonry-gallery');
    const modelNameHeader = document.getElementById('model-name-header');
    const modelNameDrawer = document.getElementById('model-name-drawer');
    const modelDescription = document.getElementById('model-description');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const model = data.find(m => m.id === modelId);
            if (!model) {
                modelNameHeader.textContent = "Модель не найдена";
                return;
            }

            modelNameHeader.textContent = model.name;
            modelNameDrawer.textContent = model.name;
            document.title = model.name;
            modelDescription.textContent = model.description;

            if (model.images && model.images.length > 0) {
                model.images.forEach(imgSrc => {
                    const item = document.createElement('div');
                    item.className = 'masonry-item';
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = `Пример от ${model.name}`;
                    item.appendChild(img);
                    gallery.appendChild(item);
                });

                window.onload = () => {
                    new Masonry(gallery, {
                        itemSelector: '.masonry-item',
                        percentPosition: true, 
                        gutter: 5,
                        // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
                        // Эта опция автоматически центрирует всю сетку по горизонтали
                        isFitWidth: true 
                    });
                };
            } else {
                gallery.innerHTML = "<p>Для этой модели пока нет изображений.</p>";
            }

            setupLikes(model.id, 0); 
            setupDraggableDrawer();
        })
        .catch(error => console.error('Ошибка при загрузке данных:', error));
});

// --- ЛОГИКА ЛАЙКОВ ---
function setupLikes(modelId, initialLikes) {
    const likeButton = document.getElementById('like-button');
    const likeCountSpan = document.getElementById('like-count');
    
    const likedModelsKey = 'likedModels';
    const likesCountKey = `likes_${modelId}`;

    let currentLikes = parseInt(localStorage.getItem(likesCountKey) || initialLikes);
    likeCountSpan.textContent = currentLikes;

    let likedModels = JSON.parse(localStorage.getItem(likedModelsKey)) || [];
    if (likedModels.includes(modelId)) {
        likeButton.classList.add('liked');
        likeButton.disabled = true;
    }

    likeButton.addEventListener('click', () => {
        if (likeButton.classList.contains('liked')) return;

        currentLikes++;
        likeCountSpan.textContent = currentLikes;
        localStorage.setItem(likesCountKey, currentLikes);

        likeButton.classList.add('liked');
        likeButton.disabled = true;
        likedModels.push(modelId);
        localStorage.setItem(likedModelsKey, JSON.stringify(likedModels));
    });
}

// --- ЛОГИКА ПЕРЕТАСКИВАЕМОЙ ШТОРКИ ---
function setupDraggableDrawer() {
    const drawer = document.getElementById('info-drawer');
    const handle = drawer.querySelector('.drawer-handle-wrapper');
    
    let isDragging = false;
    let startY, startTransform;

    const dragStart = (e) => {
        isDragging = true;
        drawer.classList.add('is-dragging');
        startY = e.pageY || e.touches[0].pageY;
        
        // Запоминаем текущее смещение
        const currentTransform = window.getComputedStyle(drawer).transform;
        startTransform = new DOMMatrix(currentTransform).m42; // m42 - это смещение по Y

        document.body.style.overflow = 'hidden';
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        const currentY = e.pageY || e.touches[0].pageY;
        const delta = currentY - startY; // Насколько сдвинули
        const newTransformY = startTransform + delta;
        
        // Ограничиваем движение, чтобы шторка не "улетала" вверх
        const minTransformY = window.innerHeight * 0.2; // 20% от высоты экрана
        if (newTransformY > minTransformY) {
            drawer.style.transform = `translateY(${newTransformY}px)`;
        }
    };

    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        drawer.classList.remove('is-dragging');
        document.body.style.overflow = '';

        // Сбрасываем инлайновый стиль, чтобы CSS-переход сработал
        drawer.style.transform = ''; 
        
        const currentTransform = window.getComputedStyle(drawer).transform;
        const matrix = new DOMMatrix(currentTransform);
        const currentY = matrix.m42;
        
        if (currentY < window.innerHeight * 0.7) {
            drawer.classList.add('is-open');
        } else {
            drawer.classList.remove('is-open');
        }
    };

    handle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);

    handle.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', dragMove);
    document.addEventListener('touchend', dragEnd);
}