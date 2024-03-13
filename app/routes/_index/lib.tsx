export const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

type OptionSymbol = string;
type ExpirationDate = string;
export type OptionChain = {
  ask: number;
  ask_date: number;
  askexch: string;
  asksize: number;
  average_volume: number;
  bid: number;
  bid_date: number;
  bidexch: string;
  bidsize: number;
  change: number;
  change_percentage: number;
  close: number;
  contract_size: number;
  description: string;
  exch: string;
  expiration_date: string;
  expiration_type: string;
  high: number;
  last: number;
  last_volume: number;
  low: number;
  open: number;
  open_interest: number;
  option_type: string;
  percentage: number;
  prevclose: number;
  root_symbol: string;
  strike: number;
  symbol: string;
  trade_date: number;
  type: string;
  underlying: string;
  volume: number;
  week_52_high: number;
  week_52_low: number;
};

export type Options = {
  [key: OptionSymbol]: {
    [key: ExpirationDate]: OptionChain[];
  };
};
