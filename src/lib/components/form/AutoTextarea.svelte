<script lang="ts">
  let {
    value = $bindable(),
    class: classList,
    placeholder,
    onkeydown,
  }: {
    value?: string;
    class?: string;
    placeholder?: string;
    onkeydown?: Function;
  } = $props();

  let target: HTMLTextAreaElement | undefined = $state();

  $effect(() => {
    value = value;
    if (target) {
      target.style.height = "0px";
      target.style.height = target.scrollHeight + 2 + "px";
    }
  });
</script>

<textarea
  class="textarea textarea-bordered resize-none min-h-12 max-h-96 {classList}"
  {placeholder}
  bind:value
  onkeydown={(e) => {
    onkeydown?.(e);
  }}
  bind:this={target}
></textarea>
