export interface ChampionDetails {
  name: string;
  item: string[];
}

export interface Season9TeamComp {
  name: string;
  champions: ChampionDetails[];
}

export interface Item {
  itemName: string;
  count: number;
  place: number;
}

export interface ItemCategory {
  categoryName: string;
  items: Item[];
}

export interface ItemCategoryRow {
  rowName: string;
  categories: ItemCategory[];
}

export type AugmentData = {
  augment: string;
  unit: string;
  places: {
    avg_place: number;
    count: number;
    avg_place_change: number;
    unit_count: number;
  };
};

export type AugmentUnit = {
  augment: string;
  units: string[];
  avgPlace: number;
};

export type TeamComp = {
  id: string;
  name: string;
  unit_list: any;
  avg: number;
  win: number;
};

export type EarlyOptions = {
  [key: number]: TeamComp[];
};

export const ItemTypes = {
  CARD: "card",
};
