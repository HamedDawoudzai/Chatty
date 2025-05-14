# WebSocket Protocol

## Connection

Connect to `ws://host/api/v1/ws/{room_id}?token={jwt_token}`

## Client → Server Events

### Send a message
```json
{"type": "message.new", "payload": {"content": "Hello!"}}
```

### Typing indicator
```json
{"type": "typing.start", "payload": {}}
{"type": "typing.stop", "payload": {}}
```

### Read receipt
```json
{"type": "read.receipt", "payload": {"message_id": "uuid"}}
```

## Server → Client Events

### New message
```json
{"type": "message.new", "message": {...}}
```

### User typing
```json
{"type": "typing.start", "user_id": "uuid", "username": "alice"}
```

### Presence
```json
{"type": "presence.join", "user_id": "uuid", "online_count": 5}
{"type": "presence.leave", "user_id": "uuid", "online_count": 4}
```
