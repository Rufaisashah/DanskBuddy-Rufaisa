import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  menuLabel?: string;
};

type StyledDropdownProps<DName extends string> = {
  name: DName;
  value: string;
  options: SelectOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (name: DName, value: string) => void;
  onClose: () => void;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  isPositioned: boolean;
};

export default function StyledDropdown<DName extends string>({
  name,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  onClose,
}: StyledDropdownProps<DName>) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    width: 0,
    isPositioned: false,
  });

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  function updateMenuPosition() {
    if (!dropdownRef.current) {
      return;
    }

    const rect = dropdownRef.current.getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
      isPositioned: true,
    });
  }

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updateMenuPosition();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setMenuPosition({
        top: 0,
        left: 0,
        width: 0,
        isPositioned: false,
      });
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      const clickedButton = dropdownRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedButton && !clickedMenu) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleSelect(optionValue: string) {
    onSelect(name, optionValue);
    onClose();
  }

  const menu = isOpen ? (
    <div
      ref={menuRef}
      className="absolute z-50 w-max rounded-2xl border border-surface bg-white p-1.5 shadow-card"
      style={{
        top: menuPosition.top,
        left: menuPosition.left,
        minWidth: menuPosition.width,
        opacity: menuPosition.isPositioned ? 1 : 0,
      }}
    >
      <div role="listbox" aria-label={name}>
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                isSelected
                  ? "bg-primary-pale text-primary-dark"
                  : "text-neutral hover:bg-surface-alt hover:text-foreground"
              }`}
            >
              <span>{option.menuLabel ?? option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-pill border border-surface bg-white px-4 text-left text-sm font-semibold text-foreground outline-none transition hover:bg-surface-alt focus:border-primary focus:ring-4 focus:ring-primary-pale"
      >
        <span>{selectedOption.label}</span>

        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`text-neutral-light transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
