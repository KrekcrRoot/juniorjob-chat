export class MessageSend {
  room_uuid: string;
  from_uuid: string;
  body: string;
}

export class MessageNew {
  body: string;
}

export class MessageSocket {
  uuid: string;
  body: string;
  time: number;
}
