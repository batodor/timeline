import * as React from 'react';

import * as ItemCss from '../../assets/item.css';
import * as FileCss from './index.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/fontawesome-free-regular';

interface FileIsUploadedProps {
	highlight?: boolean;
	avatar: string;
	userName: string;
	userId: number;
	filename: string;
	timestamp: Date;
	id: number;
	projectId: number;
	projectName: string;
	showUserTimeline?: any;
	showFileTimeline?: any;
	showProjectTimeline?: any;
}

export class FileIsUploaded extends React.Component<FileIsUploadedProps> {
	public render() {
		const { userId, filename, timestamp, id, avatar, userName, highlight, projectId, projectName } = this.props;

		let showUserTimeline = function() {
			this.props.showUserTimeline(userId, userName);
		};
		let showFileTimeline = function() {
			this.props.showFileTimeline(id, filename);
		};
		let showProjectTimeline = function() {
			this.props.showProjectTimeline(projectId, projectName);
		};
		return (
			<div className={`${ItemCss.item} ${FileCss.root}`} data-highlight={highlight ? 'true' : null}>
				<div className={FileCss.icon}>
					<FontAwesomeIcon icon={faFileExcel} />
				</div>
				<div className={FileCss.content}>
					<div>
						File{' '}
						<a href="#" onClick={showFileTimeline.bind(this)}>
							{filename}
						</a>{' '}
						was uploaded in{' '}
						<a href="#" onClick={showProjectTimeline.bind(this)}>
							{projectName}
						</a>
					</div>

					<div className={FileCss.user}>
						<img src={avatar} className={FileCss.avatar} />
						<div className={FileCss.userName}>
							<a href="#" onClick={showUserTimeline.bind(this)}>
								{userName}
							</a>
						</div>
						<div className={FileCss.timestamp}>{timestamp.toDateString()}</div>
					</div>
				</div>
			</div>
		);
	}
}
