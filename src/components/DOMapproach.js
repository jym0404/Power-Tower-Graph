export default function DOMapproach(){
    function checkWrappedAndHide() {
        const base = document.querySelector('.canvas-wrapper'); // 기준이 되는 요소 (줄 바꿈 안 된 것)
        const target = document.querySelector('.color-panel');
      
        const baseTop = base.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;

        if (baseTop > 250) { //I don't know why getBoundingClientRect().top doesn't work well. So I hardcoded it.
          target.style.display = 'none';
        } else {
          target.style.display = 'block';
        }
      }
      
    // 최초 실행 + 창 크기 변경 대응
    checkWrappedAndHide();
    window.addEventListener('resize', checkWrappedAndHide);
}
  