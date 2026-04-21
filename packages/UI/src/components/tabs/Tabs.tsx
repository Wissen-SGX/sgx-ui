import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../utils';
import { tabsVariants, tabsListVariants, tabsTriggerVariants, tabsContentVariants } from './tabs.variants';
import type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './Tabs.types';

function Tabs({ className, gap, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(tabsVariants({ gap }), className)}
      {...props}
    />
  );
}

function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, variant, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(tabsContentVariants({}), className)}
      {...props}
    />
  );
}

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { tabsVariants, tabsListVariants, tabsTriggerVariants, tabsContentVariants };
export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
