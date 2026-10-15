<script>
  import '../app.css';
  let { children } = $props();
</script>

<div class="layout">
  <nav>
    <p><strong>Caffeine</strong></p>
    <p class="muted">Docs live here — not in the engine repo.</p>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/docs">Browse docs</a></li>
      <li><a href="/pdf">PDF / TeX</a></li>
    </ul>
  </nav>
  <main>{@render children()}</main>
</div>
