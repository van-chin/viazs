export interface IconCollection {
  name: string;
  total: number;
  author: {
    name: string;
    url: string;
  };
  license: {
    title: string;
    spdx: string;
    url: string;
  };
  samples: string[];
  height: number;
  category: string;
  palette: boolean;
}

export interface IconCollections {
  [key: string]: IconCollection;
}
