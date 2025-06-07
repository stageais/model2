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
                        isFitWidth: true 
                    });
                };
            } else {
                gallery.innerHTML = "<p>Для этой модели пока нет изображений.</p>";
            }

            setupLikes(model.id, 0); 
            setupInfoDrawer(); // Вызываем простую функцию
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

    likeButton.addEventListener('click', (event) => {
        // Останавливаем "всплытие" события, чтобы клик по кнопке не закрывал шторку
        event.stopPropagation(); 

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

// --- ИЗМЕНЕНИЕ ЗДЕСЬ: Возвращаем простую логику для шторки ---
function setupInfoDrawer() {
    const drawer = document.getElementById('info-drawer');

    if (drawer) {
        drawer.addEventListener('click', () => {
            drawer.classList.toggle('is-open');
        });
    }
}
