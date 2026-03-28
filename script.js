document.addEventListener("DOMContentLoaded", function () {
  // =========================
  // ハンバーガーメニュー
  // =========================
  const hamburger = document.querySelector(".hamburger");
  const gnav = document.querySelector(".gnav");

  if (hamburger && gnav) {
    hamburger.addEventListener("click", () => {
      const open = gnav.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    gnav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        gnav.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================
  // ネイル画像スライダー
  // =========================
  const slider = document.querySelector(".slider");
  if (!slider) return;

  const inner = slider.querySelector(".slider-inner");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".slider-btn.prev");
  const nextBtn = slider.querySelector(".slider-btn.next");
  const dots = Array.from(slider.querySelectorAll(".slider-dots .dot"));

  let current = 0;
  const total = slides.length;

  function setTransition(enabled) {
    inner.style.transition = enabled ? "transform 0.4s ease" : "none";
  }

  function goTo(rawIndex) {
    const prev = current;

    // 正規化
    let index = rawIndex;
    if (index < 0) index = total - 1;
    else if (index >= total) index = 0;

    // 端から端へ移動する時（例：7枚目→1枚目）は、
    // transform が -600% → 0% のように「逆方向にアニメーション」してしまうので、
    // その時だけ transition を切って瞬間移動させる。
    const wrapForward = prev === total - 1 && index === 0 && rawIndex >= total;
    const wrapBackward = prev === 0 && index === total - 1 && rawIndex < 0;

    current = index;

    if (wrapForward || wrapBackward) {
      setTransition(false);
      inner.style.transform = `translateX(-${index * 100}%)`;

      // reflow してから transition を戻す
      void inner.offsetHeight;
      setTransition(true);
    } else {
      setTransition(true);
      inner.style.transform = `translateX(-${index * 100}%)`;
    }

    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  // 手動操作（前後ボタン）
  if (prevBtn) {
    prevBtn.addEventListener("click", () => goTo(current - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => goTo(current + 1));
  }

  // ドット操作
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });

  // 最初の1枚目を表示
  goTo(0);

  // =========================
  // 自動でずっと時計回りに回す
  // =========================
  const INTERVAL = 4200; // 少しゆっくり（約4.2秒ごと）
  setInterval(() => {
    goTo(current + 1);
  }, INTERVAL);
});
