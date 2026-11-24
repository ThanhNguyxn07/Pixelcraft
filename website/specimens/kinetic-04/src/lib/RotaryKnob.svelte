<script>
  let {
    label,
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    accent = '#f59e0b',
    format = (v) => String(Math.round(v)),
  } = $props();

  let dragging = $state(false);
  let startY = 0;
  let startVal = 0;

  let norm = $derived((value - min) / (max - min));
  // Sweep from -135deg to +135deg
  let angle = $derived(-135 + norm * 270);
  let arcLength = 157; // 270deg arc on r=33.3
  let dashOffset = $derived(arcLength * (1 - norm));

  function clamp(v) {
    const stepped = Math.round(v / step) * step;
    return Math.min(max, Math.max(min, Number(stepped.toFixed(4))));
  }

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging = true;
    startY = e.clientY;
    startVal = value;
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dy = startY - e.clientY;
    const span = max - min;
    value = clamp(startVal + (dy / 140) * span);
  }

  function onPointerUp(e) {
    if (dragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      dragging = false;
    }
  }

  function onKeyDown(e) {
    const delta = e.shiftKey ? step * 5 : step;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      value = clamp(value + delta);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      value = clamp(value - delta);
    }
  }
</script>

<div class="knob-wrap">
  <div
    class="knob-dial"
    class:dragging
    role="slider"
    tabindex="0"
    aria-label={label}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    aria-valuetext={`${format(value)}${unit}`}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onkeydown={onKeyDown}
  >
    <svg viewBox="0 0 84 84" class="knob-svg" aria-hidden="true">
      <circle
        cx="42"
        cy="42"
        r="33.3"
        fill="none"
        stroke="#2f323b"
        stroke-width="4"
        stroke-dasharray="157 220"
        stroke-linecap="round"
        transform="rotate(135 42 42)"
      />
      <circle
        cx="42"
        cy="42"
        r="33.3"
        fill="none"
        stroke={accent}
        stroke-width="4"
        stroke-dasharray="157 220"
        stroke-dashoffset={dashOffset}
        stroke-linecap="round"
        transform="rotate(135 42 42)"
      />
      <circle cx="42" cy="42" r="24" fill="#23252c" stroke="#3a3d47" stroke-width="1.5" />
      <g transform={`rotate(${angle} 42 42)`}>
        <line x1="42" y1="22" x2="42" y2="32" stroke={accent} stroke-width="2.6" stroke-linecap="round" />
      </g>
    </svg>
  </div>

  <div class="knob-meta">
    <span class="knob-label">{label}</span>
    <span class="knob-val tabular-nums">{format(value)}{unit}</span>
  </div>
</div>

<style>
  .knob-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .knob-dial {
    width: 72px;
    height: 72px;
    cursor: ns-resize;
    border-radius: 999px;
    touch-action: none;
    user-select: none;
    transition: transform 140ms ease;
  }

  .knob-dial:hover,
  .knob-dial.dragging {
    transform: scale(1.04);
  }

  .knob-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .knob-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .knob-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-on-dark-muted);
  }

  .knob-val {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-on-dark);
  }
</style>
