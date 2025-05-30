import { ReactNode } from "react";

import { DictionaryType } from "@/lib/get/dictionaries";

export interface AuthProps extends React.ComponentProps<"div"> {
  translation: DictionaryType;
  token?: string;
  children?: ReactNode;
}
