export class MessageSend {
  room_uuid: string;
  from_uuid: string;
  body: string;
  reply?: string;
}

export class MessageNew {
  body: string;
  reply?: string;
}

export class MessageSocket {
  uuid: string;
  body: string;
  time: number;
  replied: string | null;
}
