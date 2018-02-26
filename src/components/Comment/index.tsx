import * as React from 'react';
import faker from 'faker';

import * as ItemCss from '../../assets/item.css';
import * as CommentCss from './index.css';

interface CommentProps {
	highlight?: boolean;

	user: {
		avatar: string;
		userName: string;
		userId: number;
	};

	file: {
		fileName: string;
		fileId: number;
	};

	timestamp: Date;
	text: string;
	projectId: number;
	id: number;
	showUserTimeline: any;
	showFileTimeline: any;
}

export class Comment extends React.Component<CommentProps> {
	public render() {
		const { user, file, text, timestamp, projectId } = this.props;

		const { avatar, userName, userId } = user;
		const { fileName, fileId } = file;

		const timeStamp = timestamp.toDateString();

		let showUserTimeline = function() {
			this.props.showUserTimeline(userId, userName);
		};
		let showFileTimeline = function() {
			this.props.showFileTimeline(fileId, fileName);
		};
		return (
			<div className={`${ItemCss.item} ${CommentCss.root}`} data-highlight={this.props.highlight ? 'true' : null}>
				<img src={avatar} className={CommentCss.avatar} />
				<div>
					<a href="#" onClick={showUserTimeline.bind(this)}>
						{userName}
					</a>{' '}
					commented{' '}
					<a href="#" onClick={showFileTimeline.bind(this)}>
						{fileName}
					</a>{' '}
					<span className={CommentCss.timestamp}>{timeStamp}</span>
				</div>
				<div className={CommentCss.text}>{text}</div>
			</div>
		);
	}
}
