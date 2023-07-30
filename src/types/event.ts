export interface Event {
  body: Body;
}

export interface Body {
  update_id: number;
  message?: Message;
  edited_message?: Message;
}

export interface Message {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    username: string;
    type: string;
  };
  date: number;
  text: string;
}

export interface CurrResponse {
  date: string;
  currencies: Currency[];
}
export interface Currency {
  code: string;
  quantity: number;
  rateFormated: string;
  diffFormated: string;
  rate: number;
  name: string;
  diff: number;
  date: string;
  validFromDate: string;
}
