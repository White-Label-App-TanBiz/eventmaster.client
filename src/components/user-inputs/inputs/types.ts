interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

interface PeriodSelectorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export type {
  ColorPickerProps, //
  PeriodSelectorProps,
};
