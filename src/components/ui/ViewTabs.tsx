import type { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export function ViewTabs({
  value,
  onChange,
  options,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  children: ReactNode;
  label: string;
}) {
  return (
    <Tabs.Root value={value} onValueChange={onChange}>
      <Tabs.List className="tabs" aria-label={label}>
        {options.map((o) => (
          <Tabs.Trigger className={value === o.id ? 'active' : ''} value={o.id} key={o.id}>
            {o.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {options.map((o) => (
        <Tabs.Content value={o.id} key={o.id} className="tab-content">
          {value === o.id ? children : null}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
