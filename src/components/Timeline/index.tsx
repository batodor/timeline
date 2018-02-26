import * as React from 'react';

import { FileIsUploaded } from '../FileIsUploaded';
import { Comment } from '../Comment';
import { ShowNew } from '../ShowNew';

import faker from 'faker';
import * as API from '../../API';
import InfiniteScroll from 'react-infinite-scroller';

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as css from './style.css';

interface timelineState {
	apiActs: any;
	userId: number;
	userName: string;
	fileId: number;
	fileName: string;
	projectId: number;
	showAllProjects: any;
	isActivities: boolean;
	projectName: string;
}
interface timelineProps {
	changeProjectName: any;
	changeFileName: any;
	changeUserName: any;
	showAllProjects: any;
}
export class Timeline extends React.Component<timelineProps, timelineState> {
	constructor(props) {
		super(props);
		this.state = {
			apiActs: [],
			userId: null,
			userName: null,
			fileId: null,
			fileName: null,
			projectId: null,
			projectName: null,
			showAllProjects: false,
			isActivities: true
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.showAllProjects !== this.props.showAllProjects && newProps.showAllProjects) {
			this.setState({
				userId: null,
				fileId: null,
				projectId: null,
				apiActs: [],
				showAllProjects: true
			});
		}
	}

	// Load function for infinite scroll
	// no sort after scroll at bottom, not to distruct users
	// since faker generates not always sooner actvities
	loadMore(page) {
		if (this.state.userId) {
			// Load user's activities if user selected
			API.user(this.state.userId).getActivities().then((data) => {
				this.setState({
					isActivities: true,
					apiActs: this.state.apiActs
						.concat(data)
						.sort(function(a, b) {
							return b.date - a.date;
						})
						.filter((thing, index, self) => index === self.findIndex((t) => t.id === thing.id))
				});
			});
		} else if (this.state.fileId) {
			// Load file's activities if file selected
			API.file(this.state.fileId).getActivities().then((data) => {
				if (data['length'] > 0) {
					this.setState({
						isActivities: true,
						apiActs: this.state.apiActs
							.concat(data)
							.sort(function(a, b) {
								return b.date - a.date;
							})
							.filter((thing, index, self) => index === self.findIndex((t) => t.id === thing.id))
					});
				} else {
					this.setState({
						isActivities: false
					});
				}
			});
		} else if (this.state.projectId) {
			// Load projects's activities if it was selected
			API.project(this.state.projectId).getActivities().then((data) => {
				this.setState({
					isActivities: true,
					apiActs: this.state.apiActs
						.concat(data)
						.sort(function(a, b) {
							return b.date - a.date;
						})
						.filter((thing, index, self) => index === self.findIndex((t) => t.id === thing.id))
				});
			});
		} else {
			// Load all activities
			API.timeline.getActivities().then((data) => {
				let newApiActs = this.state.apiActs
					.concat(data)
					.filter(
						(thing, index, self) =>
							index === self.findIndex((t) => t.id === thing.id && t.userId === thing.userId)
					);
				this.setState({
					isActivities: true,
					apiActs: newApiActs
				});
			});
		}
	}

	// Function to show new subscription activities
	// applied sort by date, faker fakes sometimes not new activites
	showNewLink(newActivities) {
		let newApiActs = newActivities
			.concat(this.state.apiActs)
			.sort(function(a, b) {
				return b.date - a.date;
			})
			.filter(
				(thing, index, self) => index === self.findIndex((t) => t.id === thing.id && t.userId === thing.userId)
			);
		this.setState({
			apiActs: newApiActs
		});
	}

	// On user click show user's activities
	showUserTimeline(userId, userName) {
		API.user(userId).getActivities().then((data) => {
			this.setState({
				apiActs: data,
				userId: userId,
				fileId: null,
				projectId: null,
				userName: userName,
				fileName: '',
				projectName: '',
				showAllProjects: false
			});
			this.props.changeUserName(userName);
		});
	}

	// On file click show files's activities
	showFileTimeline(fileId, fileName) {
		API.file(fileId).getActivities().then((data) => {
			this.setState({
				apiActs: data,
				fileId: fileId,
				userId: null,
				projectId: null,
				fileName: fileName,
				userName: '',
				projectName: '',
				showAllProjects: false
			});
			this.props.changeFileName(fileName);
		});
	}

	// On file click show files's activities
	showProjectTimeline(projectId, projectName) {
		API.project(projectId).getActivities().then((data) => {
			this.setState({
				apiActs: data,
				userId: null,
				fileId: null,
				projectId: projectId,
				projectName: projectName,
				userName: '',
				fileName: '',
				showAllProjects: false
			});
			this.props.changeProjectName(projectName);
		});
	}

	public render() {
		let apiActs = this.state.apiActs;
		let VisibilitySensor = require('react-visibility-sensor');

		// Visibility function, idx - index of activity(comment/file),
		// isVisible - if visible then change its parameter highlight to false after 5sec
		let onVisChange = function(idx, isVisible) {
			if (isVisible) {
				let self = this;
				setTimeout(function() {
					if (self.state.apiActs[idx] && self.state.apiActs[idx].highlight)
						self.state.apiActs[idx].highlight = null;
					self.setState({
						apiActs: self.state.apiActs
					});
				}, 5000);
			}
		};
		return (
			<div>
				<h2>Timeline</h2>
				<div>
					<ShowNew
						userId={this.state.userId}
						fileId={this.state.fileId}
						projectId={this.state.projectId}
						showNewLink={this.showNewLink.bind(this)}
						showAllProjects={this.state.showAllProjects}
					/>

					{/* Activites - files and comments */}
					<InfiniteScroll
						pageStart={0}
						loadMore={this.loadMore.bind(this)}
						hasMore={true}
						threshold={250}
						loader={
							this.state.isActivities ? (
								<Spinner
									size={SpinnerSize.large}
									key={0}
									className={css.spinner}
									label="Loading older events..."
									ariaLive="assertive"
								/>
							) : (
								<div key={0}>No Activities</div>
							)
						}
					>
						{apiActs &&
							apiActs.map((act, actIdx) => {
								if (act.type === 'file') {
									const apiFile = {
										avatar: act.avatar,
										userName: act.userName,
										userId: act.userId,
										filename: act.name,
										timestamp: act.date,
										id: act.id,
										projectName: act.projectName,
										projectId: act.projectId
									};
									return (
										<VisibilitySensor
											key={'file' + act.id}
											active={act.highlight ? true : false}
											onChange={onVisChange.bind(this, actIdx)}
										>
											<FileIsUploaded
												showUserTimeline={this.showUserTimeline.bind(this)}
												showFileTimeline={this.showFileTimeline.bind(this)}
												showProjectTimeline={this.showProjectTimeline.bind(this)}
												key={'file' + act.id}
												{...apiFile}
												highlight={act.highlight}
											/>
										</VisibilitySensor>
									);
								} else if (act.type === 'comment') {
									const apiComment = {
										user: {
											avatar: act.avatar,
											userName: act.userName,
											userId: act.userId
										},
										file: {
											fileId: act.fileId,
											fileName: act.fileName
										},
										timestamp: act.date,
										text: act.text,
										projectId: act.projectId,
										id: act.id
									};
									return (
										<VisibilitySensor
											key={'comment' + act.id}
											active={act.highlight ? true : false}
											onChange={onVisChange.bind(this, actIdx)}
										>
											<Comment
												showUserTimeline={this.showUserTimeline.bind(this)}
												showFileTimeline={this.showFileTimeline.bind(this)}
												key={'comment' + act.id}
												{...apiComment}
												highlight={act.highlight}
											/>
										</VisibilitySensor>
									);
								}
							})}
					</InfiniteScroll>
				</div>
			</div>
		);
	}
}
