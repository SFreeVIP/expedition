import {RECEIVE_QUEST_LIST, SET_DRAWER, NEW_QUEST, REQUEST_QUEST_LOAD, REQUEST_QUEST_SAVE, REQUEST_QUEST_DELETE, REQUEST_QUEST_PUBLISH} from '../ActionTypes'

export function drawer(state = {open: false, quests: null, receivedAt: null}, action) {
  switch (action.type) {
    case SET_DRAWER:
      return {open: action.is_open, quests: state.quests}; // TODO: Fetch
    case RECEIVE_QUEST_LIST:
      return {open: state.open, quests: action.quests, receivedAt: action.receivedAt};
    case NEW_QUEST:
    case REQUEST_QUEST_LOAD:
    case REQUEST_QUEST_SAVE:
    case REQUEST_QUEST_DELETE:
    case REQUEST_QUEST_PUBLISH:
      return {...state, open: false};
    default:
      return state;
  }
}