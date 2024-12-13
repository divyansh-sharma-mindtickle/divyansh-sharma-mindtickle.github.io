

**

Ownership of Features & Execution:

- Specific features or initiatives you worked on and how you took ownership of them from start to finish.
	- worked on various projects:
		- Mt-player optimizations which help me onboarding to code and coding practices of mindtickle and optimised the loading time of ms-viewer. PR: https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9574
		- ps-pdf migrations - includes evaluating multiple players according to our need (viewing and conversion) and choosing the right player and done the implementation with good coding practices and unit tests. 
			- PR: https://gitlab.com/mindtickle/design-library/-/merge_requests/2123
			- This feature never made it to production due to compatibility issues with node version
		- improved PLT of content center with caching the remote entry improved can be tracked on this ticket: https://mindtickle.atlassian.net/browse/CN-12113?focusedCommentId=447267
		- Partial Sync status: took ownership of frontend and Graphql development and also Content side of code as well as integrations side of code
			- mt-content-ui: https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9646
			- integrations-ui: https://gitlab.com/mindtickle/integrations-ui/-/merge_requests/998
			- content-gql-schema:
				- https://gitlab.com/mindtickle/content-gql-schema/-/merge_requests/3244
				- https://gitlab.com/mindtickle/content-gql-schema/-/merge_requests/3241
			- integration-gql: https://gitlab.com/mindtickle/integration-gql/-/merge_requests/93

		- Prod Issues: 
			- File or folder is accessed after deletion.
				- https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9593
			- SNAG: Fix: At max 100 files are supported in one request!
				- https://gitlab.com/mindtickle/uploader/-/merge_requests/402
			- SNAG: Avoid logging unauthorised GraphQL errors in SNAG
				- https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9702
			- SNAG: Remove SNAG error logging in case of media processing failure or move it to non snag-ui-errors
				- https://gitlab.com/mindtickle/content-media-ui/-/merge_requests/433
			- Orphan Folders
				- Implementation: 
					- integrations-ui: https://gitlab.com/mindtickle/integrations-ui/-/merge_requests/965
					- integrations-gql: https://gitlab.com/mindtickle/integration-gql/-/merge_requests/131
				- Optimisation: https://gitlab.com/mindtickle/integration-gql/-/merge_requests/140

Code reviews:
PRS:
- https://gitlab.com/mindtickle/content-media-ui/-/merge_requests/432
- https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9697
- https://gitlab.com/mindtickle/mt-mailer-ops/-/merge_requests/1461
- https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9602
- https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9624
- https://gitlab.com/mindtickle/content-center-service/-/merge_requests/838
- https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9597
- https://gitlab.com/mindtickle/mt-content-ui/-/merge_requests/9613
- https://gitlab.com/mindtickle/content-media-ui/-/merge_requests/383
- https://gitlab.com/mindtickle/content-gql-schema/-/merge_requests/3115
