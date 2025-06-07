document.addEventListener('DOMContentLoaded', () => {
    const modelGrid = document.getElementById('model-grid');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(model => {
                const card = document.createElement('a');
                card.href = `model.html?id=${model.id}`;
                card.className = 'model-card';

                const carousel = document.createElement('div');
                carousel.className = 'card-carousel';

                model.images.slice(0, 5).forEach((imgSrc, index) => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = model.name;
                    if (index === 0) {
                        img.classList.add('active');
                    }
                    carousel.appendChild(img);
                });
                
                // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
                // Загружаем лайки из localStorage, а если их нет, ставим 0
                const likes = localStorage.getItem(`likes_${model.id}`) || 0;

                const info = document.createElement('div');
                info.className = 'card-info';
                info.innerHTML = `
                    <h3>${model.name}</h3>
                    <div class="likes">👍 ${likes}</div>
                `;

                card.appendChild(carousel);
                card.appendChild(info);
                modelGrid.appendChild(card);
                
                startCarousel(carousel);
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            modelGrid.innerHTML = '<p style="color: #ff5555;">Не удалось загрузить модели. Убедитесь, что файл data.json существует и доступен.</p>';
        });
});

function startCarousel(carouselElement) {
    let currentIndex = 0;
    const images = carouselElement.querySelectorAll('img');
    if (images.length <= 1) return;

    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 3000);
}