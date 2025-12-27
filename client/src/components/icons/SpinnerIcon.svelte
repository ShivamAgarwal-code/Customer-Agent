<script lang="ts">
  interface Props {
    size?: number;
  }

  let { size = 20 }: Props = $props();
</script>

<svg class="spinner" width={size} height={size} viewBox="0 0 24 24">
  <circle 
    cx="12" 
    cy="12" 
    r="10" 
    stroke="currentColor" 
    stroke-width="2" 
    fill="none" 
    stroke-dasharray="31.416" 
    stroke-dashoffset="31.416"
  >
    <animate 
      attributeName="stroke-dasharray" 
      dur="2s" 
      values="0 31.416;15.708 15.708;0 31.416;0 31.416" 
      repeatCount="indefinite"
    />
    <animate 
      attributeName="stroke-dashoffset" 
      dur="2s" 
      values="0;-15.708;-31.416;-31.416" 
      repeatCount="indefinite"
    />
  </circle>
</svg>

<style>
  .spinner {
    display: block;
  }
</style>
