export type InsertTemplate = {
  text: string;
  cursorOffset: number;
};

export function insertAtCursor(
  el: HTMLInputElement | HTMLTextAreaElement,
  template: InsertTemplate,
  onChange: (value: string) => void
) {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;

  const newValue =
    el.value.slice(0, start) + template.text + el.value.slice(end);
  const cursorPos = start + template.cursorOffset;

  // Update React state — this triggers the preview immediately
  onChange(newValue);

  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(cursorPos, cursorPos);
  });
}