from enum import Enum


class WSEventType(str, Enum):
    MESSAGE_NEW = "message.new"
    MESSAGE_EDIT = "message.edit"
    MESSAGE_DELETE = "message.delete"
    TYPING_START = "typing.start"
    TYPING_STOP = "typing.stop"
    PRESENCE_JOIN = "presence.join"
    PRESENCE_LEAVE = "presence.leave"
    REACTION_ADD = "reaction.add"
    REACTION_REMOVE = "reaction.remove"
    READ_RECEIPT = "read.receipt"
    MENTION = "mention"
    NOTIFICATION = "notification"
