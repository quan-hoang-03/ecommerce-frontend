import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  FETCH_CONVERSATIONS_FAILURE,
  FETCH_MESSAGES_REQUEST,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  RECEIVE_MESSAGE,
  FETCH_UNREAD_COUNT_REQUEST,
  FETCH_UNREAD_COUNT_SUCCESS,
  FETCH_UNREAD_COUNT_FAILURE,
  SELECT_CONVERSATION,
  MARK_AS_READ_REQUEST,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_FAILURE,
  DELETE_MESSAGE_REQUEST,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAILURE,
} from "./ActionType";

const initialState = {
  conversations: [],
  selectedConversation: null,
  messages: {},
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_REQUEST:
    case FETCH_MESSAGES_REQUEST:
    case SEND_MESSAGE_REQUEST:
    case FETCH_UNREAD_COUNT_REQUEST:
    case MARK_AS_READ_REQUEST:
    case DELETE_MESSAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        conversations: action.payload,
        error: null,
      };

    case FETCH_CONVERSATIONS_FAILURE:
    case FETCH_MESSAGES_FAILURE:
    case SEND_MESSAGE_FAILURE:
    case FETCH_UNREAD_COUNT_FAILURE:
    case MARK_AS_READ_FAILURE:
    case DELETE_MESSAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case FETCH_MESSAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        messages: {
          ...state.messages,
          [action.payload.userId]: action.payload.messages,
        },
        error: null,
      };

    case SEND_MESSAGE_SUCCESS:
    case RECEIVE_MESSAGE: {
      const message = action.payload;
      const userId = message.senderId === action.currentUserId ? message.receiverId : message.senderId;
      const existingMessages = state.messages[userId] || [];
      
      // Check if message already exists
      const messageExists = existingMessages.some(m => m.id === message.id);
      
      return {
        ...state,
        isLoading: action.type === SEND_MESSAGE_SUCCESS ? false : state.isLoading,
        messages: {
          ...state.messages,
          [userId]: messageExists ? existingMessages : [...existingMessages, message],
        },
        error: null,
      };
    }

    case FETCH_UNREAD_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        unreadCount: action.payload,
        error: null,
      };

    case SELECT_CONVERSATION:
      return {
        ...state,
        selectedConversation: action.payload,
      };

    case MARK_AS_READ_SUCCESS: {
      const readUserId = action.payload;
      const updatedMessages = state.messages[readUserId]?.map(msg => 
        msg.senderId === readUserId ? { ...msg, isRead: true } : msg
      ) || [];
      
      return {
        ...state,
        isLoading: false,
        messages: {
          ...state.messages,
          [readUserId]: updatedMessages,
        },
        error: null,
      };
    }

    case DELETE_MESSAGE_SUCCESS: {
      const { messageId, userId: deleteUserId } = action.payload;
      const filteredMessages = state.messages[deleteUserId]?.filter(msg => msg.id !== messageId) || [];
      
      return {
        ...state,
        isLoading: false,
        messages: {
          ...state.messages,
          [deleteUserId]: filteredMessages,
        },
        error: null,
      };
    }

    default:
      return state;
  }
};

export default chatReducer;
