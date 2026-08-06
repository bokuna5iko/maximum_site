import gsap from "gsap";

/**
 * 1. 3D-Параллакс при движении мыши
 */
export function initHeroParallax() {
  const hero = document.querySelector("#hero");
  const layers = document.querySelectorAll(".hero__layer");

  if (!hero || !layers.length) return;

  hero.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Центрируем координаты от -1 до 1
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;

    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed) || 0.05;
      const moveX = x * speed * 100;
      const moveY = y * speed * 100;

      gsap.to(layer, {
        x: moveX,
        y: moveY,
        duration: 0.6,
        ease: "power1.out",
      });
    });
  });

  // Возврат слоев в центр, когда мышь уходит с секции
  hero.addEventListener("mouseleave", () => {
    layers.forEach((layer) => {
      gsap.to(layer, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power2.out",
      });
    });
  });
}

/**
 * 2. Эффект стекающих капель воды на экране (Water Drops Canvas)
 */
export function initWaterDrops() {
  const canvas = document.querySelector("#water-drops-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Генерация случайных капель
  const numDrops = 45;
  const drops = [];

  for (let i = 0; i < numDrops; i++) {
    drops.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3.5 + 1.5, // Радиус капли
      vy: Math.random() * 1.5 + 0.3, // Скорость стекания
      alpha: Math.random() * 0.6 + 0.3,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    drops.forEach((drop) => {
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);

      // Глянцевый градиент капли
      const grad = ctx.createRadialGradient(
        drop.x - drop.r * 0.3,
        drop.y - drop.r * 0.3,
        drop.r * 0.1,
        drop.x,
        drop.y,
        drop.r,
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${drop.alpha})`);
      grad.addColorStop(0.8, `rgba(180, 220, 255, ${drop.alpha * 0.6})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0.2)");

      ctx.fillStyle = grad;
      ctx.fill();

      // Движение вниз (стекание)
      drop.y += drop.vy;

      // Возврат наверх при выходе за экран
      if (drop.y > height) {
        drop.y = -10;
        drop.x = Math.random() * width;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}
