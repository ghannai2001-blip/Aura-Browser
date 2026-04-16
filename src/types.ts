export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export interface BrowserState {
  tabs: Tab[];
  activeTabId: string;
  history: string[];
  bookmarks: Tab[];
}
