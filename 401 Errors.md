Ticket: https://mindtickle.atlassian.net/browse/CN-12207


***Generally 401 Errors are thrown when User is un authorized***
### Possible Reasons
1. ***User Logged out***: 
		Not the Case since when a user is logged out then user is re-directed to the Login and the Auth request fails.
1. ***Session Timeout***:
		Not the case since when session gets timed-out then we show a Modal with which we can reload the page.
2. ***Not Enough Permissions to view Content center***:
		This seems the case since first user was not able to load the content center but after some time when the tab is reloaded then the user was able to load the content center
		*Note:* Access token was different in both the attempts.
