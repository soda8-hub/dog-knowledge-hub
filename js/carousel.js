    //橫幅輪播
  //取得相關元素
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn'); 

   let currentIndex = 0; //顯示

  //更新輪播位置
  function updateCarousel() {
    const offset = -currentIndex * 100; //每張寬度是 100%
    track.style.transform = `translateX(${offset}%)`;
  }

  //下一張
  nextBtn.addEventListener('click', function () {
    currentIndex++;
    if (currentIndex >= slides.length) {
      currentIndex = 0; //回到第一張
    }
    updateCarousel();
  });

  //上一張
  prevBtn.addEventListener('click', function () {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = slides.length - 1; //跳到最後一張
    }
    updateCarousel();
  });

  //自動輪播 每2秒下一張
    setInterval(function () {
    nextBtn.click();
        }, 2000);

;