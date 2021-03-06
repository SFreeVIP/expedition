import Redux from 'redux';
import * as semver from 'semver';
import {handleFetchErrors} from 'shared/requests';
import {AUTH_SETTINGS, URLS, VERSION} from '../Constants';
import {getDevicePlatform} from '../Globals';
import {logEvent} from '../Logging';
import {AnnouncementSetAction, FetchAnnouncementResponse} from './ActionTypes';

export function fetchAnnouncements() {
  return (dispatch: Redux.Dispatch<any>): any => {
    fetch(AUTH_SETTINGS.URL_BASE + '/announcements')
    .then(handleFetchErrors)
    .then((response: Response) => response.json())
    .then((data: FetchAnnouncementResponse) => {
      dispatch(handleAnnouncements(data));
    }).catch((error: Error) => {
      // Don't alert user - it's not important to them if this fails
      logEvent('error', 'announcement_fetch_err', {label: error});
    });
  };
}

export function handleAnnouncements(data: FetchAnnouncementResponse) {
  return (dispatch: Redux.Dispatch<any>): any => {
    if (data.message !== null && data.message !== '') {
      dispatch(setAnnouncement(true, data.message, data.link));
    } else {
      const newVersion = data.versions[getDevicePlatform()];
      const oldVersion = VERSION;
      if (semver.valid(newVersion) && semver.valid(oldVersion)) {
        if (semver.gt(newVersion, oldVersion)) {
          const url = URLS[getDevicePlatform()];
          dispatch(setAnnouncement(true, 'New version available, click here to upgrade', url));
        }
      } else {
        logEvent('error', 'announcement_app_version_invalid_err', {label: newVersion});
      }
    }
  };
}

export function setAnnouncement(open: boolean, message?: string, link?: string): AnnouncementSetAction {
  return {type: 'ANNOUNCEMENT_SET', open, message, link};
}
