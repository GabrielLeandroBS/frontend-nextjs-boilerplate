import { ReactNode } from "react";

import { Sidebar } from "@/components/ui/sidebar";

import { DictionaryType } from "@/lib/get/dictionaries";

export interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  translation: DictionaryType;
  token?: string;
  children?: ReactNode;
}
